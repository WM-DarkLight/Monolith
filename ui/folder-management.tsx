"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import {
  FolderIcon,
  FolderPlus,
  Edit2,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Pin,
  Search,
  Tag,
  SortAsc,
  CornerDownRight,
  Move,
} from "lucide-react"
import type { Folder as FolderType, FolderWithEpisodes, FolderHierarchy } from "@/types/folder"
import type { EpisodeSummary } from "@/types/episode"
import {
  createFolder,
  updateFolder,
  deleteFolder,
  moveEpisode,
  createSubfolder,
  moveFolder,
} from "@/lib/folder-service"
import { motion, AnimatePresence } from "framer-motion"

interface FolderManagementProps {
  folders: FolderHierarchy
  unorganizedEpisodes: EpisodeSummary[]
  onFoldersChange: () => void
  onSelectEpisode: (saveId: undefined, episodeId: string) => void
}

export function FolderManagement({
  folders,
  unorganizedEpisodes,
  onFoldersChange,
  onSelectEpisode,
}: FolderManagementProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [showUnorganized, setShowUnorganized] = useState(true)
  const [editingFolder, setEditingFolder] = useState<string | null>(null)
  const [folderName, setFolderName] = useState("")
  const [folderColor, setFolderColor] = useState("#d4af37") // Default gold color
  const [folderDescription, setFolderDescription] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isCreatingSubfolder, setIsCreatingSubfolder] = useState<string | null>(null)
  const [draggedEpisode, setDraggedEpisode] = useState<{ id: string; sourceFolderId: string | null } | null>(null)
  const [draggedFolder, setDraggedFolder] = useState<string | null>(null)
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null)
  const [dragOverDepth, setDragOverDepth] = useState(0)

  const [pinnedFolders, setPinnedFolders] = useState<Record<string, boolean>>({})
  const [folderSearchQuery, setFolderSearchQuery] = useState<Record<string, string>>({})
  const [folderSortOrder, setFolderSortOrder] = useState<Record<string, "asc" | "desc" | "completion">>({})
  const [folderTags, setFolderTags] = useState<Record<string, string[]>>({})
  const [showTagInput, setShowTagInput] = useState<string | null>(null)
  const [newTag, setNewTag] = useState("")
  const [filterByTag, setFilterByTag] = useState<string | null>(null)
  const [movingFolder, setMovingFolder] = useState<string | null>(null)
  const [moveTargetFolder, setMoveTargetFolder] = useState<string | null>(null)

  // Available colors for folders
  const folderColors = [
    "#d4af37", // gold
    "#3a7bd5", // blue
    "#9d50bb", // purple
    "#8b3103", // rust
    "#4CAF50", // green
    "#FF5722", // orange
    "#9C27B0", // purple
    "#607D8B", // blue-grey
  ]

  // Initialize expanded state for folders
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {}

    // Flatten the folder hierarchy for initialization
    const flattenFolders = (folderList: FolderWithEpisodes[]) => {
      folderList.forEach((folder) => {
        // If we don't have a state for this folder yet, default to collapsed
        if (expandedFolders[folder.id] === undefined) {
          initialExpandedState[folder.id] = false
        } else {
          initialExpandedState[folder.id] = expandedFolders[folder.id]
        }

        // Process subfolders if any
        if (folder.subfolders && folder.subfolders.length > 0) {
          flattenFolders(folder.subfolders)
        }
      })
    }

    flattenFolders(folders.rootFolders)
    setExpandedFolders((prev) => ({ ...prev, ...initialExpandedState }))
  }, [folders.rootFolders])

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return

    try {
      await createFolder({
        name: folderName,
        color: folderColor,
        description: folderDescription,
        episodeIds: [],
      })

      // Reset form
      setFolderName("")
      setFolderColor("#d4af37")
      setFolderDescription("")
      setIsCreatingFolder(false)

      // Refresh folders
      onFoldersChange()
    } catch (error) {
      console.error("Failed to create folder:", error)
    }
  }

  const handleCreateSubfolder = async (parentId: string) => {
    if (!folderName.trim()) return

    try {
      await createSubfolder(parentId, {
        name: folderName,
        color: folderColor,
        description: folderDescription,
        episodeIds: [],
      })

      // Reset form
      setFolderName("")
      setFolderColor("#d4af37")
      setFolderDescription("")
      setIsCreatingSubfolder(null)

      // Expand the parent folder to show the new subfolder
      setExpandedFolders((prev) => ({
        ...prev,
        [parentId]: true,
      }))

      // Refresh folders
      onFoldersChange()
    } catch (error) {
      console.error("Failed to create subfolder:", error)
    }
  }

  const handleUpdateFolder = async (folderId: string) => {
    try {
      await updateFolder(folderId, {
        name: folderName,
        color: folderColor,
        description: folderDescription,
      })

      setEditingFolder(null)
      onFoldersChange()
    } catch (error) {
      console.error("Failed to update folder:", error)
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (confirm("Are you sure you want to delete this folder? Episodes will be moved to Unorganized.")) {
      try {
        await deleteFolder(folderId)
        onFoldersChange()
      } catch (error) {
        console.error("Failed to delete folder:", error)
      }
    }
  }

  const handleMoveFolder = async () => {
    if (!movingFolder) return

    try {
      await moveFolder(movingFolder, moveTargetFolder)
      setMovingFolder(null)
      setMoveTargetFolder(null)
      onFoldersChange()
    } catch (error) {
      console.error("Failed to move folder:", error)
    }
  }

  const startEditingFolder = (folder: FolderType) => {
    setEditingFolder(folder.id)
    setFolderName(folder.name)
    setFolderColor(folder.color)
    setFolderDescription(folder.description || "")
  }

  const startCreatingSubfolder = (parentId: string) => {
    setIsCreatingSubfolder(parentId)
    setFolderName("")
    setFolderColor("#d4af37")
    setFolderDescription("")
  }

  const cancelEditing = () => {
    setEditingFolder(null)
    setIsCreatingFolder(false)
    setIsCreatingSubfolder(null)
    setFolderName("")
    setFolderColor("#d4af37")
    setFolderDescription("")
  }

  // Drag and drop handlers
  const handleDragStart = (episodeId: string, sourceFolderId: string | null) => {
    setDraggedEpisode({ id: episodeId, sourceFolderId })
  }

  const handleFolderDragStart = (e: React.DragEvent, folderId: string) => {
    e.stopPropagation()
    setDraggedFolder(folderId)
  }

  const handleDragOver = (e: React.DragEvent, folderId: string | null = null, depth = 0) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverFolderId(folderId)
    setDragOverDepth(depth)
  }

  const handleDragLeave = () => {
    setDragOverFolderId(null)
  }

  const handleDrop = async (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault()
    e.stopPropagation()

    // Reset drag state
    setDragOverFolderId(null)

    // Handle episode drop
    if (draggedEpisode) {
      try {
        await moveEpisode(draggedEpisode.id, draggedEpisode.sourceFolderId, targetFolderId)
        setDraggedEpisode(null)
        onFoldersChange()
      } catch (error) {
        console.error("Failed to move episode:", error)
      }
      return
    }

    // Handle folder drop
    if (draggedFolder && targetFolderId !== draggedFolder) {
      try {
        await moveFolder(draggedFolder, targetFolderId)
        setDraggedFolder(null)
        onFoldersChange()
      } catch (error) {
        console.error("Failed to move folder:", error)
      }
    }
  }

  const togglePinFolder = (folderId: string) => {
    setPinnedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
    // Store pinned status in localStorage
    localStorage.setItem(
      "pinnedFolders",
      JSON.stringify({
        ...pinnedFolders,
        [folderId]: !pinnedFolders[folderId],
      }),
    )
  }

  // Add this useEffect to load pinned folders from localStorage
  useEffect(() => {
    const storedPinnedFolders = localStorage.getItem("pinnedFolders")
    if (storedPinnedFolders) {
      setPinnedFolders(JSON.parse(storedPinnedFolders))
    }

    const storedFolderTags = localStorage.getItem("folderTags")
    if (storedFolderTags) {
      setFolderTags(JSON.parse(storedFolderTags))
    }
  }, [])

  // Add this function to add a tag to a folder
  const addTagToFolder = (folderId: string, tag: string) => {
    if (!tag.trim()) return

    const updatedTags = {
      ...folderTags,
      [folderId]: [...(folderTags[folderId] || []), tag.trim()],
    }

    setFolderTags(updatedTags)
    localStorage.setItem("folderTags", JSON.stringify(updatedTags))
    setNewTag("")
    setShowTagInput(null)
  }

  // Add this function to remove a tag from a folder
  const removeTagFromFolder = (folderId: string, tagToRemove: string) => {
    const updatedTags = {
      ...folderTags,
      [folderId]: (folderTags[folderId] || []).filter((tag) => tag !== tagToRemove),
    }

    setFolderTags(updatedTags)
    localStorage.setItem("folderTags", JSON.stringify(updatedTags))
  }

  // Add this function to get all unique tags
  const getAllTags = useMemo(() => {
    const allTags = new Set<string>()
    Object.values(folderTags).forEach((tags) => {
      tags.forEach((tag) => allTags.add(tag))
    })
    return Array.from(allTags)
  }, [folderTags])

  // Add this function to sort episodes within a folder
  const getSortedEpisodes = (folder: FolderWithEpisodes) => {
    const sortOrder = folderSortOrder[folder.id] || "asc"
    const searchQuery = folderSearchQuery[folder.id] || ""

    // First filter by search query if any
    let filteredEpisodes = folder.episodes
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredEpisodes = folder.episodes.filter(
        (episode) =>
          episode.title.toLowerCase().includes(query) ||
          (episode.description && episode.description.toLowerCase().includes(query)),
      )
    }

    // Then sort based on sort order
    return [...filteredEpisodes].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title)
      } else if (sortOrder === "desc") {
        return b.title.localeCompare(a.title)
      } else if (sortOrder === "completion") {
        // Sort by completion status: completed first, then in-progress, then not started
        if (a.completed && !b.completed) return -1
        if (!a.completed && b.completed) return 1
        if (a.started && !b.started) return -1
        if (!a.started && b.started) return 1
        return a.title.localeCompare(b.title)
      }
      return 0
    })
  }

  // Add this function to cycle through sort orders
  const cycleSortOrder = (folderId: string) => {
    const currentOrder = folderSortOrder[folderId] || "asc"
    const newOrder = currentOrder === "asc" ? "desc" : currentOrder === "desc" ? "completion" : "asc"

    setFolderSortOrder((prev) => ({
      ...prev,
      [folderId]: newOrder,
    }))
  }

  // Add this function to get episode counts by status
  const getEpisodeCounts = (episodes: EpisodeSummary[]) => {
    return {
      total: episodes.length,
      completed: episodes.filter((e) => e.completed).length,
      inProgress: episodes.filter((e) => e.started && !e.completed).length,
      notStarted: episodes.filter((e) => !e.started).length,
    }
  }

  // Function to render a folder and its subfolders recursively
  const renderFolder = (folder: FolderWithEpisodes, depth = 0) => {
    const hasSubfolders = folder.subfolders && folder.subfolders.length > 0
    const isExpanded = expandedFolders[folder.id] || false
    const isDraggedOver = dragOverFolderId === folder.id
    const isBeingDragged = draggedFolder === folder.id
    const isMovingTarget = moveTargetFolder === folder.id

    return (
      <motion.div
        key={folder.id}
        className={`wasteland-card overflow-hidden mb-4 ${isBeingDragged ? "opacity-50" : ""}`}
        style={{ marginLeft: `${depth * 20}px` }}
        onDragOver={(e) => handleDragOver(e, folder.id, depth)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, folder.id)}
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: 1,
          y: 0,
          boxShadow: isDraggedOver ? `0 0 0 2px ${folder.color}` : isMovingTarget ? "0 0 0 2px #ffffff" : "none",
        }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        draggable={!editingFolder && !isCreatingSubfolder}
        onDragStart={(e) => handleFolderDragStart(e, folder.id)}
      >
        {editingFolder === folder.id ? (
          <div className="p-3 border-b border-gold-dark">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-white/70 mb-1">Folder Name</label>
                <input
                  type="text"
                  className="wasteland-input w-full"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Folder Color</label>
                <div className="flex flex-wrap gap-2">
                  {folderColors.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full ${folderColor === color ? "ring-2 ring-white" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFolderColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Description (Optional)</label>
                <textarea
                  className="wasteland-input w-full"
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button className="wasteland-button bg-dark-gray text-sm" onClick={cancelEditing}>
                  <X className="w-4 h-4" />
                </button>
                <button
                  className="wasteland-button text-sm"
                  onClick={() => handleUpdateFolder(folder.id)}
                  disabled={!folderName.trim()}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : isCreatingSubfolder === folder.id ? (
          <div className="p-3 border-b border-gold-dark">
            <div className="space-y-3">
              <div className="flex items-center mb-2">
                <CornerDownRight className="w-4 h-4 mr-2 text-gold/50" />
                <h3 className="text-gold text-sm">CREATE SUBFOLDER</h3>
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Folder Name</label>
                <input
                  type="text"
                  className="wasteland-input w-full"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter subfolder name"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Folder Color</label>
                <div className="flex flex-wrap gap-2">
                  {folderColors.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full ${folderColor === color ? "ring-2 ring-white" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFolderColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Description (Optional)</label>
                <textarea
                  className="wasteland-input w-full"
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  placeholder="Enter folder description"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button className="wasteland-button bg-dark-gray text-sm" onClick={cancelEditing}>
                  CANCEL
                </button>
                <button
                  className="wasteland-button text-sm"
                  onClick={() => handleCreateSubfolder(folder.id)}
                  disabled={!folderName.trim()}
                >
                  CREATE
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="p-3 border-b border-gold-dark flex items-center justify-between"
            style={{ borderLeftWidth: "4px", borderLeftColor: folder.color }}
          >
            <div className="flex items-center flex-grow cursor-pointer" onClick={() => toggleFolder(folder.id)}>
              <FolderIcon className="w-5 h-5 mr-2" style={{ color: folder.color }} />
              <h3 className="text-lg font-bold" style={{ color: folder.color }}>
                {folder.name}
                {pinnedFolders[folder.id] && <Pin className="w-3 h-3 ml-2 inline-block" />}
              </h3>
            </div>
            <div className="flex items-center">
              {/* Episode count badges */}
              {folder.episodes.length > 0 && (
                <div className="flex mr-2 text-xs">
                  <span className="bg-gold text-black px-1 rounded-sm mr-1" title="Completed">
                    {getEpisodeCounts(folder.episodes).completed}
                  </span>
                  <span className="bg-gold/50 text-black px-1 rounded-sm mr-1" title="In Progress">
                    {getEpisodeCounts(folder.episodes).inProgress}
                  </span>
                  <span className="bg-dark-gray text-white/70 px-1 rounded-sm" title="Not Started">
                    {getEpisodeCounts(folder.episodes).notStarted}
                  </span>
                </div>
              )}

              <span className="text-xs bg-dark-gray text-white/70 px-2 py-1 mr-2">
                {folder.episodes.length} episodes
              </span>

              {/* Folder action buttons */}
              <button
                className="p-1 text-white/50 hover:text-white mr-1"
                onClick={() => togglePinFolder(folder.id)}
                title={pinnedFolders[folder.id] ? "Unpin folder" : "Pin folder"}
              >
                <Pin className={`w-4 h-4 ${pinnedFolders[folder.id] ? "text-gold" : ""}`} />
              </button>
              <button
                className="p-1 text-white/50 hover:text-white mr-1"
                onClick={() => setShowTagInput(showTagInput === folder.id ? null : folder.id)}
                title="Manage tags"
              >
                <Tag className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-white/50 hover:text-white mr-1"
                onClick={() => cycleSortOrder(folder.id)}
                title="Change sort order"
              >
                <SortAsc className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-white/50 hover:text-white mr-1"
                onClick={() => startCreatingSubfolder(folder.id)}
                title="Add subfolder"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-white/50 hover:text-white mr-1"
                onClick={() => {
                  setMovingFolder(folder.id)
                  setMoveTargetFolder(folder.parentId || null)
                }}
                title="Move folder"
              >
                <Move className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-white/50 hover:text-white mr-1"
                onClick={() => startEditingFolder(folder)}
                title="Edit folder"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-white/50 hover:text-rust"
                onClick={() => handleDeleteFolder(folder.id)}
                title="Delete folder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button className="p-1 ml-1" onClick={() => toggleFolder(folder.id)}>
                {expandedFolders[folder.id] ? (
                  <ChevronUp className="w-5 h-5 text-gold" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gold" />
                )}
              </button>
            </div>
          </div>
        )}

        <AnimatePresence>
          {expandedFolders[folder.id] && !editingFolder && !isCreatingSubfolder && (
            <motion.div
              className="p-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {folder.description && <p className="text-white/70 text-sm mb-3">{folder.description}</p>}

              {/* Tags display */}
              {(folderTags[folder.id]?.length > 0 || showTagInput === folder.id) && (
                <div className="mb-3 flex flex-wrap items-center gap-1">
                  {folderTags[folder.id]?.map((tag) => (
                    <div key={tag} className="bg-dark-gray text-gold text-xs px-2 py-1 rounded-sm flex items-center">
                      {tag}
                      <button
                        className="ml-1 text-white/50 hover:text-white"
                        onClick={() => removeTagFromFolder(folder.id, tag)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {showTagInput === folder.id && (
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="wasteland-input text-xs py-1 px-2 w-24"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New tag"
                        onKeyDown={(e) => e.key === "Enter" && addTagToFolder(folder.id, newTag)}
                      />
                      <button
                        className="ml-1 text-gold hover:text-white"
                        onClick={() => addTagToFolder(folder.id, newTag)}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Search within folder */}
              <div className="mb-3 relative">
                <input
                  type="text"
                  className="wasteland-input w-full pl-8 py-1 text-sm"
                  placeholder="Search in this folder..."
                  value={folderSearchQuery[folder.id] || ""}
                  onChange={(e) =>
                    setFolderSearchQuery((prev) => ({
                      ...prev,
                      [folder.id]: e.target.value,
                    }))
                  }
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gold/50" />
              </div>

              {/* Episodes in this folder */}
              {folder.episodes.length === 0 && (!folder.subfolders || folder.subfolders.length === 0) ? (
                <div className="text-white/50 text-sm italic text-center py-2 border border-dashed border-gold/20">
                  Drag episodes here
                </div>
              ) : (
                <>
                  {folder.episodes.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1 mb-4">
                      <AnimatePresence>
                        {getSortedEpisodes(folder).map((episode) => (
                          <motion.div
                            key={episode.id}
                            className={`p-2 border ${episode.completed ? "border-gold bg-gold/10" : episode.started ? "border-gold-dark bg-gold/5" : "border-gold-dark/50 bg-dark-gray"} hover:border-gold transition-colors`}
                            draggable
                            onDragStart={() => handleDragStart(episode.id, folder.id)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-sm text-white">{episode.title}</h4>
                                {episode.description && (
                                  <p className="text-xs text-white/60 mt-0.5">{episode.description}</p>
                                )}
                              </div>
                              <button
                                className="text-xs px-2 py-1 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-colors"
                                onClick={() => onSelectEpisode(undefined, episode.id)}
                              >
                                PLAY
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Render subfolders */}
                  {folder.subfolders && folder.subfolders.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <AnimatePresence>
                        {folder.subfolders.map((subfolder) => renderFolder(subfolder, depth + 1))}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Create folder button */}
      {!isCreatingFolder ? (
        <motion.button
          className="wasteland-button flex items-center text-sm mb-4"
          onClick={() => setIsCreatingFolder(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          CREATE NEW FOLDER
        </motion.button>
      ) : (
        <motion.div
          className="wasteland-card p-4 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-gold text-sm mb-2">CREATE NEW FOLDER</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-white/70 mb-1">Folder Name</label>
              <input
                type="text"
                className="wasteland-input w-full"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1">Folder Color</label>
              <div className="flex flex-wrap gap-2">
                {folderColors.map((color) => (
                  <motion.button
                    key={color}
                    className={`w-6 h-6 rounded-full ${folderColor === color ? "ring-2 ring-white" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFolderColor(color)}
                    aria-label={`Select color ${color}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/70 mb-1">Description (Optional)</label>
              <textarea
                className="wasteland-input w-full"
                value={folderDescription}
                onChange={(e) => setFolderDescription(e.target.value)}
                placeholder="Enter folder description"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <motion.button
                className="wasteland-button bg-dark-gray text-sm"
                onClick={cancelEditing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CANCEL
              </motion.button>
              <motion.button
                className="wasteland-button text-sm"
                onClick={handleCreateFolder}
                disabled={!folderName.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CREATE FOLDER
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Move folder dialog */}
      {movingFolder && (
        <motion.div
          className="wasteland-card p-4 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-gold text-sm mb-2">MOVE FOLDER</h3>
          <p className="text-white/70 text-sm mb-3">
            Select a destination folder or choose "Root" to move to the top level.
          </p>

          <div className="space-y-2 mb-4">
            <div
              className={`p-2 border ${moveTargetFolder === null ? "border-gold bg-gold/10" : "border-gold-dark/50 bg-dark-gray"} hover:border-gold cursor-pointer`}
              onClick={() => setMoveTargetFolder(null)}
            >
              <div className="flex items-center">
                <FolderIcon className="w-4 h-4 mr-2 text-gold" />
                <span className="text-sm">Root (Top Level)</span>
              </div>
            </div>

            {Object.values(folders.flatFolders)
              .filter((f) => f.id !== movingFolder && !findAllSubfolderIds([f], movingFolder).includes(f.id))
              .map((folder) => (
                <div
                  key={folder.id}
                  className={`p-2 border ${moveTargetFolder === folder.id ? "border-gold bg-gold/10" : "border-gold-dark/50 bg-dark-gray"} hover:border-gold cursor-pointer`}
                  onClick={() => setMoveTargetFolder(folder.id)}
                >
                  <div className="flex items-center">
                    <FolderIcon className="w-4 h-4 mr-2" style={{ color: folder.color }} />
                    <span className="text-sm">{folder.name}</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-end gap-2">
            <motion.button
              className="wasteland-button bg-dark-gray text-sm"
              onClick={() => {
                setMovingFolder(null)
                setMoveTargetFolder(null)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CANCEL
            </motion.button>
            <motion.button
              className="wasteland-button text-sm"
              onClick={handleMoveFolder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              MOVE FOLDER
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Tag filter */}
      {getAllTags.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs text-white/70 mb-1">Filter by tag:</label>
          <div className="flex flex-wrap gap-1">
            <motion.button
              className={`text-xs px-2 py-1 ${filterByTag === null ? "bg-gold text-black" : "bg-dark-gray text-white/70"} hover:bg-gold hover:text-black transition-colors`}
              onClick={() => setFilterByTag(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            {getAllTags.map((tag) => (
              <motion.button
                key={tag}
                className={`text-xs px-2 py-1 ${filterByTag === tag ? "bg-gold text-black" : "bg-dark-gray text-white/70"} hover:bg-gold hover:text-black transition-colors`}
                onClick={() => setFilterByTag(tag === filterByTag ? null : tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Unorganized episodes section */}
      <motion.div
        className="wasteland-card overflow-hidden mb-4"
        onDragOver={(e) => handleDragOver(e, null)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, null)}
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: 1,
          y: 0,
          boxShadow: dragOverFolderId === null ? "0 0 0 2px #d4af37" : "none",
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="p-3 border-b border-gold-dark flex items-center justify-between cursor-pointer"
          onClick={() => setShowUnorganized(!showUnorganized)}
        >
          <div className="flex items-center">
            <FolderIcon className="w-5 h-5 mr-2 text-white/70" />
            <h3 className="text-lg font-bold text-white">Unorganized</h3>
          </div>
          <div className="flex items-center">
            <span className="text-xs bg-dark-gray text-white/70 px-2 py-1 mr-2">
              {unorganizedEpisodes.length} episodes
            </span>
            {showUnorganized ? (
              <ChevronUp className="w-5 h-5 text-gold" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gold" />
            )}
          </div>
        </div>

        <AnimatePresence>
          {showUnorganized && (
            <motion.div
              className="p-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {unorganizedEpisodes.length === 0 ? (
                <p className="text-white/50 text-sm italic text-center py-2">No unorganized episodes</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  <AnimatePresence>
                    {unorganizedEpisodes.map((episode) => (
                      <motion.div
                        key={episode.id}
                        className="p-2 border border-gold-dark/50 bg-dark-gray hover:border-gold transition-colors"
                        draggable
                        onDragStart={() => handleDragStart(episode.id, null)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm text-white">{episode.title}</h4>
                            {episode.description && (
                              <p className="text-xs text-white/60 mt-0.5">{episode.description}</p>
                            )}
                          </div>
                          <motion.button
                            className="text-xs px-2 py-1 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-colors"
                            onClick={() => onSelectEpisode(undefined, episode.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            PLAY
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Folders */}
      <AnimatePresence>
        {folders.rootFolders
          .filter((folder) => !filterByTag || (folderTags[folder.id] || []).includes(filterByTag))
          .sort((a, b) => {
            // Sort by pinned status first
            if (pinnedFolders[a.id] && !pinnedFolders[b.id]) return -1
            if (!pinnedFolders[a.id] && pinnedFolders[b.id]) return 1
            // Then by name
            return a.name.localeCompare(b.name)
          })
          .map((folder) => renderFolder(folder))}
      </AnimatePresence>
    </div>
  )
}

// Helper function to find all subfolder IDs (direct and indirect)
function findAllSubfolderIds(folders: FolderWithEpisodes[], parentId: string): string[] {
  const directSubfolders = folders.filter((folder) => folder.parentId === parentId)

  if (directSubfolders.length === 0) {
    return []
  }

  const directSubfolderIds = directSubfolders.map((folder) => folder.id)
  const indirectSubfolderIds = directSubfolderIds.flatMap((id) => findAllSubfolderIds(folders, id))

  return [...directSubfolderIds, ...indirectSubfolderIds]
}
