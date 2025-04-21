"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { createPortal } from "react-dom"
import { Save, X, Check, AlertTriangle, Download, Upload, Trash2, RefreshCw } from "lucide-react"
import { getSaveSlots, exportSaveData } from "@/lib/save-manager"
import type { SaveSlot } from "@/types/save"

interface SaveGameModalProps {
  onSave: (saveName: string, slotId?: string) => void
  onCancel: () => void
  status: "idle" | "saving" | "success" | "error"
  errorMessage?: string
  currentSaveData?: any
  onImport?: (file: File) => void
  onDelete?: (slotId: string) => void
}

export function SaveGameModal({
  onSave,
  onCancel,
  status,
  errorMessage = "An error occurred while saving the game.",
  currentSaveData,
  onImport,
  onDelete,
}: SaveGameModalProps) {
  const [saveName, setSaveName] = useState(`SAVE - ${new Date().toLocaleDateString()}`)
  const [mounted, setMounted] = useState(false)
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<SaveSlot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<"slots" | "new">("slots")
  const [importError, setImportError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && status !== "saving") {
        onCancel()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onCancel, status])

  // Handle escape key to close modal
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape" && status !== "saving") {
        onCancel()
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [onCancel, status])

  useEffect(() => {
    setMounted(true)
    loadSaveSlots()
    return () => setMounted(false)
  }, [])

  const loadSaveSlots = async () => {
    setIsLoading(true)
    try {
      const slots = await getSaveSlots()
      setSaveSlots(slots)

      // Select the first non-empty slot or the first slot if all are empty
      const firstNonEmptySlot = slots.find((slot) => !slot.isEmpty && !slot.isAutoSave)
      setSelectedSlot(firstNonEmptySlot || slots[0])
    } catch (error) {
      console.error("Failed to load save slots:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (saveName.trim()) {
      if (view === "new") {
        onSave(saveName.trim())
      } else if (selectedSlot) {
        onSave(saveName.trim(), selectedSlot.slotId)
      }
    }
  }

  const handleExport = () => {
    if (currentSaveData) {
      exportSaveData(currentSaveData)
    }
  }

  const handleImportClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file && onImport) {
        setImportError(null)
        onImport(file)
      }
    }
    input.click()
  }

  const handleDeleteSlot = (slotId: string) => {
    if (onDelete && confirm("Are you sure you want to delete this save? This action cannot be undone.")) {
      onDelete(slotId)
      // Refresh the slots list
      loadSaveSlots()
    }
  }

  const renderSlotSelection = () => (
    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
      {saveSlots.map((slot) => (
        <button
          key={slot.id}
          className={`wasteland-card p-3 text-left transition-all ${
            selectedSlot?.id === slot.id ? "border-gold" : "border-gold-dark"
          } ${slot.isEmpty ? "opacity-70" : ""}`}
          onClick={() => {
            setSelectedSlot(slot)
            if (!slot.isEmpty) {
              setSaveName(slot.name)
            } else {
              setSaveName(`SAVE - ${new Date().toLocaleDateString()}`)
            }
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gold font-bold flex items-center">
                {slot.isAutoSave && <RefreshCw className="w-3 h-3 mr-1" />}
                {slot.name}
              </div>
              {!slot.isEmpty && (
                <div className="text-xs text-white/60 mt-1">
                  {slot.episodeTitle} • {new Date(slot.timestamp).toLocaleString()}
                </div>
              )}
              {slot.isEmpty && <div className="text-xs text-white/40 mt-1">Empty Slot</div>}
            </div>

            {!slot.isEmpty && !slot.isAutoSave && (
              <button
                className="text-rust hover:text-rust-light p-1"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteSlot(slot.id)
                }}
                title="Delete save"
              >
                <Trash2 size={16} />
              </button>
            )}

            {slot.isAutoSave && (
              <div className="text-xs px-2 py-1 bg-darker-gray border border-gold/30 text-gold">AUTO</div>
            )}
          </div>
        </button>
      ))}
    </div>
  )

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div ref={modalRef} className="wasteland-container w-full max-w-md p-0 overflow-hidden animate-fadeIn">
        <div className="bg-gold p-4 flex items-center justify-between">
          <h2 className="text-black font-bold flex items-center">
            <Save className="w-5 h-5 mr-2" />
            SAVE GAME
          </h2>
          <button onClick={onCancel} className="text-black/70 hover:text-black" disabled={status === "saving"}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {status === "success" ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-gold" />
              </div>
              <p className="text-gold font-medium mb-1">GAME SAVED SUCCESSFULLY</p>
              <p className="text-white/60 text-sm">Your progress has been saved.</p>
            </div>
          ) : status === "error" ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-rust/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-rust" />
              </div>
              <p className="text-rust font-medium mb-1">SAVE FAILED</p>
              <p className="text-white/60 text-sm">{errorMessage}</p>
              <button className="wasteland-button mt-4" onClick={onCancel}>
                CLOSE
              </button>
            </div>
          ) : (
            <>
              <div className="flex border-b border-gold-dark mb-4">
                <button
                  className={`px-4 py-2 ${view === "slots" ? "text-gold border-b-2 border-gold" : "text-white/60"}`}
                  onClick={() => setView("slots")}
                >
                  SAVE SLOTS
                </button>
                <button
                  className={`px-4 py-2 ${view === "new" ? "text-gold border-b-2 border-gold" : "text-white/60"}`}
                  onClick={() => setView("new")}
                >
                  NEW SAVE
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {view === "slots" ? (
                  <>
                    {isLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <RefreshCw className="w-6 h-6 text-gold animate-spin" />
                      </div>
                    ) : (
                      renderSlotSelection()
                    )}

                    {selectedSlot && !selectedSlot.isEmpty && (
                      <div className="mt-4 p-3 bg-dark-gray border border-gold/20">
                        <p className="text-xs text-white/70">This will overwrite the existing save in this slot.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mb-4">
                    <label htmlFor="saveName" className="block text-sm text-gold mb-2">
                      SAVE NAME
                    </label>
                    <input
                      type="text"
                      id="saveName"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      className="wasteland-input"
                      disabled={status === "saving"}
                      autoFocus
                    />
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleExport}
                      className="p-2 wasteland-button bg-dark-gray flex items-center"
                      disabled={!currentSaveData}
                      title="Export save"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleImportClick}
                      className="p-2 wasteland-button bg-dark-gray flex items-center"
                      title="Import save"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onCancel}
                      className="wasteland-button bg-dark-gray"
                      disabled={status === "saving"}
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="wasteland-button flex items-center"
                      disabled={status === "saving" || !saveName.trim() || (view === "slots" && !selectedSlot)}
                    >
                      {status === "saving" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin mr-2"></div>
                          SAVING...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          SAVE GAME
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {importError && (
                  <div className="mt-4 p-3 bg-rust/20 border border-rust text-rust text-sm">{importError}</div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return mounted ? createPortal(modalContent, document.body) : null
}
