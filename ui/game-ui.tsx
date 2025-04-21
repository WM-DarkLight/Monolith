"use client"
import { useState } from "react"
import type { Episode } from "@/types/episode"
import type { GameState } from "@/types/game"
import { OptionsPanel } from "@/ui/options-panel"
import { StatsDisplay } from "@/ui/stats-display"
import { InventoryDisplay } from "@/ui/inventory-display"
import { SkillsDisplay } from "@/ui/skills-display"
import { PerksDisplay } from "@/ui/perks-display"
import { PerkSelectionScreen } from "@/ui/perk-selection-screen"
import { TextDisplay } from "@/ui/text-display"
import { SaveGameModal } from "@/ui/save-game-modal"
import { deleteSavedGame } from "@/lib/save-manager"
import { Save, Map, Book, Clock, Radio, Shield, ChevronLeft, Award } from "lucide-react"

interface GameUIProps {
  episode: Episode | null
  gameState: GameState
  onOptionSelect: (optionId: string, success?: boolean) => void
  onSaveGame: (saveName: string, slotId?: string) => Promise<string>
  onImportSave: (file: File) => void
  onUnlockPerk: (perkId: string) => void
  onEquipArtifact: (perkId: string) => void
  onUnequipArtifact: (perkId: string) => void
  currentSaveData: any
  saveError: string | null
  shouldPulseSaveIcon?: boolean
  onExit: () => void
}

export function GameUI(props: GameUIProps) {
  const {
    episode,
    gameState,
    onOptionSelect,
    onSaveGame,
    onImportSave,
    onUnlockPerk,
    onEquipArtifact,
    onUnequipArtifact,
    currentSaveData,
    saveError,
    shouldPulseSaveIcon,
    onExit,
  } = props
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const [showJournal, setShowJournal] = useState(() => {
    // Check if we have a saved preference in localStorage
    const savedPreference = typeof window !== "undefined" ? localStorage.getItem("showJournal") : null
    return savedPreference === "true"
  })
  const [showMap, setShowMap] = useState(false)
  const [showSkills, setShowSkills] = useState(true)
  const [showPerks, setShowPerks] = useState(false)
  const [showPerkSelection, setShowPerkSelection] = useState(false)

  if (!episode) {
    return <div className="text-gold text-center p-8">No episode loaded</div>
  }

  const handleSaveGame = async (saveName: string, slotId?: string) => {
    setSaveStatus("saving")
    try {
      await onSaveGame(saveName, slotId)
      setSaveStatus("success")
      setTimeout(() => {
        setIsSaveModalOpen(false)
        setSaveStatus("idle")
      }, 1500)
    } catch (error) {
      console.error("Failed to save game:", error)
      setSaveStatus("error")
    }
  }

  const handleDeleteSave = async (slotId: string) => {
    try {
      await deleteSavedGame(slotId)
      // No need to close modal, the slot will be refreshed
    } catch (error) {
      console.error("Failed to delete save:", error)
    }
  }

  const toggleJournal = () => {
    const newState = !showJournal
    setShowJournal(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem("showJournal", String(newState))
    }
  }

  return (
    <div className="wasteland-background min-h-screen">
      <div className="scan-line"></div>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="terminal-header text-3xl group cursor-pointer flex items-center"
            onClick={onExit}
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-5 h-5 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            {episode.title}
          </h1>

          <div className="flex items-center gap-2">
            <button
              className="p-2 border border-gold-dark hover:bg-dark-gray text-white/70 hover:text-gold transition-colors relative"
              onClick={toggleJournal}
              title="Journal"
            >
              <Book className="w-5 h-5" />
              {gameState.history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"></span>
              )}
            </button>
            <button
              className="p-2 border border-gold-dark hover:bg-dark-gray text-white/70 hover:text-gold transition-colors"
              onClick={() => setShowMap(!showMap)}
              title="Map"
            >
              <Map className="w-5 h-5" />
            </button>
            <button
              className="p-2 border border-gold-dark hover:bg-dark-gray text-white/70 hover:text-gold transition-colors relative"
              onClick={() => setShowPerkSelection(true)}
              title="Perks"
            >
              <Award className="w-5 h-5" />
              {(gameState.perks?.perkPoints || 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"></span>
              )}
            </button>
            <button
              className={`p-2 border border-gold-dark hover:bg-dark-gray text-white/70 hover:text-gold transition-colors relative group ${
                props.shouldPulseSaveIcon ? "pulse-save border-gold" : ""
              }`}
              onClick={() => setIsSaveModalOpen(true)}
              title="Save Game"
            >
              <Save className={`w-5 h-5 ${props.shouldPulseSaveIcon ? "text-gold" : ""}`} />
              <div className="absolute -bottom-8 right-0 bg-darker-gray border border-gold-dark px-2 py-1 text-xs text-gold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {props.shouldPulseSaveIcon ? "Important progress! Save your game" : "Save Game"}
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="wasteland-container p-6 mb-6">
              <div className="flex items-center justify-between mb-4 text-xs text-white/50">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>SESSION TIME: 00:45:12</span>
                </div>
                <div className="flex items-center">
                  <Radio className="w-3 h-3 mr-1" />
                  <span>SIGNAL STRENGTH: WEAK</span>
                </div>
              </div>

              {showPerks ? (
                <PerksDisplay
                  gameState={gameState}
                  onUnlockPerk={onUnlockPerk}
                  onEquipArtifact={onEquipArtifact}
                  onUnequipArtifact={onUnequipArtifact}
                />
              ) : (
                <>
                  <TextDisplay text={episode.text} />

                  <div className="mt-8">
                    <OptionsPanel options={episode.options} onSelect={onOptionSelect} gameState={gameState} />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            <div className="wasteland-container p-4">
              <StatsDisplay stats={gameState.stats} />
            </div>

            <div className="wasteland-container p-4">
              <SkillsDisplay skills={gameState.skills} />
            </div>

            <div className="wasteland-container p-4">
              <InventoryDisplay inventory={gameState.inventory} />
            </div>

            {showJournal && (
              <div className="wasteland-container p-4">
                <h3 className="terminal-header text-lg mb-3">JOURNAL</h3>
                <div className="max-h-48 overflow-y-auto pr-1 space-y-3">
                  {gameState.history
                    .slice()
                    .reverse()
                    .map((entry, index) => (
                      <div key={index} className="text-xs border-l-2 border-gold/30 pl-2">
                        <div className="text-white/80">{entry.choiceText}</div>
                        <div className="text-white/40">{entry.episodeId}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {showMap && (
              <div className="wasteland-container p-4">
                <h3 className="terminal-header text-lg mb-3">AREA MAP</h3>
                <div className="aspect-square bg-darker-gray border border-gold-dark flex flex-col items-center justify-center">
                  <Shield className="w-8 h-8 text-gold/30 mb-2" />
                  <div className="text-white/30 text-xs text-center">MAP DATA CORRUPTED</div>
                  <div className="text-white/30 text-xs text-center">SIGNAL REQUIRED</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showPerkSelection && (
          <PerkSelectionScreen
            gameState={gameState}
            onUnlockPerk={onUnlockPerk}
            onClose={() => setShowPerkSelection(false)}
          />
        )}

        {isSaveModalOpen && (
          <SaveGameModal
            onSave={handleSaveGame}
            onCancel={() => setIsSaveModalOpen(false)}
            status={saveStatus}
            errorMessage={saveError || "An error occurred while saving the game."}
            currentSaveData={currentSaveData}
            onImport={onImportSave}
            onDelete={handleDeleteSave}
          />
        )}
      </div>
    </div>
  )
}
