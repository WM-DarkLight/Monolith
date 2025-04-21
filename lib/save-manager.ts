import { v4 as uuidv4 } from "uuid"
import { get, getAll, put, remove } from "@/lib/db"
import type { GameState } from "@/types/game"
import type { SavedGame, SaveSlot } from "@/types/save"
import { compressData, decompressData } from "@/lib/compression"

// Current version of save data format
const SAVE_DATA_VERSION = "1.0.0"
const MAX_SAVE_SLOTS = 10
const AUTO_SAVE_SLOT_ID = "auto-save"

/**
 * Save game data to IndexedDB
 */
export async function saveGame(
  saveData: Omit<SavedGame, "id" | "version" | "thumbnail" | "compressed">,
): Promise<string> {
  try {
    const id = saveData.slotId || uuidv4()

    // Generate a simple thumbnail representation (text-based for now)
    const thumbnail = generateThumbnail(saveData.gameState)

    // Compress game state data to reduce storage size
    const compressedGameState = await compressData(saveData.gameState)

    const savedGame: SavedGame = {
      id,
      version: SAVE_DATA_VERSION,
      thumbnail,
      compressed: true,
      ...saveData,
      gameState: compressedGameState as any, // Type assertion as we're storing compressed data
      timestamp: new Date().toISOString(),
    }

    await put("saves", savedGame)
    return id
  } catch (error) {
    console.error("Failed to save game:", error)
    throw new Error("Failed to save game. Please try again.")
  }
}

/**
 * Load a saved game by ID
 */
export async function loadSavedGame(id: string): Promise<SavedGame | undefined> {
  try {
    const savedGame = await get("saves", id)

    if (!savedGame) {
      return undefined
    }

    // Handle data decompression if the save is compressed
    if (savedGame.compressed) {
      const decompressedGameState = await decompressData(savedGame.gameState as any)
      return {
        ...savedGame,
        gameState: decompressedGameState,
        compressed: false,
      }
    }

    return savedGame
  } catch (error) {
    console.error(`Failed to load saved game with ID ${id}:`, error)
    throw new Error("Failed to load saved game. The save file may be corrupted.")
  }
}

/**
 * Get all saved games
 */
export async function getSavedGames(): Promise<SavedGame[]> {
  try {
    const saves = await getAll("saves")

    // Sort by timestamp (newest first)
    return saves.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error("Failed to get saved games:", error)
    throw new Error("Failed to retrieve saved games.")
  }
}

/**
 * Delete a saved game
 */
export async function deleteSavedGame(id: string): Promise<void> {
  try {
    await remove("saves", id)
  } catch (error) {
    console.error(`Failed to delete saved game with ID ${id}:`, error)
    throw new Error("Failed to delete saved game.")
  }
}

/**
 * Update an existing saved game
 */
export async function updateSavedGame(id: string, updates: Partial<SavedGame>): Promise<void> {
  try {
    const existingSave = await get("saves", id)
    if (!existingSave) {
      throw new Error(`Save with ID ${id} not found`)
    }

    // If updating game state, compress it
    let updatedGameState = updates.gameState
    if (updatedGameState) {
      updatedGameState = (await compressData(updatedGameState)) as any
    }

    const updatedSave: SavedGame = {
      ...existingSave,
      ...updates,
      gameState: updatedGameState || existingSave.gameState,
      compressed: updatedGameState ? true : existingSave.compressed,
    }

    await put("saves", updatedSave)
  } catch (error) {
    console.error(`Failed to update saved game with ID ${id}:`, error)
    throw new Error("Failed to update saved game.")
  }
}

/**
 * Auto-save the current game state
 */
export async function autoSaveGame(
  saveData: Omit<SavedGame, "id" | "version" | "thumbnail" | "compressed">,
): Promise<void> {
  try {
    await saveGame({
      ...saveData,
      name: "Auto Save",
      slotId: AUTO_SAVE_SLOT_ID,
    })
  } catch (error) {
    console.error("Auto-save failed:", error)
    // Don't throw here to prevent disrupting gameplay
  }
}

/**
 * Get available save slots
 */
export async function getSaveSlots(): Promise<SaveSlot[]> {
  try {
    const saves = await getSavedGames()
    const slots: SaveSlot[] = []

    // Create the auto-save slot
    const autoSave = saves.find((save) => save.id === AUTO_SAVE_SLOT_ID)
    if (autoSave) {
      slots.push({
        id: AUTO_SAVE_SLOT_ID,
        name: "Auto Save",
        timestamp: autoSave.timestamp,
        episodeTitle: autoSave.episodeTitle,
        isAutoSave: true,
        isEmpty: false,
      })
    } else {
      slots.push({
        id: AUTO_SAVE_SLOT_ID,
        name: "Auto Save",
        timestamp: "",
        episodeTitle: "",
        isAutoSave: true,
        isEmpty: true,
      })
    }

    // Create regular save slots
    for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
      const slotId = `slot-${i}`
      const existingSave = saves.find((save) => save.slotId === slotId)

      if (existingSave) {
        slots.push({
          id: existingSave.id,
          name: existingSave.name,
          slotId,
          timestamp: existingSave.timestamp,
          episodeTitle: existingSave.episodeTitle,
          isEmpty: false,
        })
      } else {
        slots.push({
          id: slotId,
          name: `Save Slot ${i}`,
          slotId,
          timestamp: "",
          episodeTitle: "",
          isEmpty: true,
        })
      }
    }

    return slots
  } catch (error) {
    console.error("Failed to get save slots:", error)
    throw new Error("Failed to retrieve save slots.")
  }
}

/**
 * Generate a simple text-based thumbnail representation of the game state
 */
function generateThumbnail(gameState: GameState): string {
  // For now, just return the episode ID and some stats
  // In a production game, this could be a base64 encoded small image
  return `EP:${gameState.currentEpisodeId}|H:${gameState.stats.health}|E:${gameState.stats.energy}|I:${gameState.inventory.length}`
}

/**
 * Check if a save is compatible with the current game version
 */
export function isSaveCompatible(saveVersion: string): boolean {
  // Simple version check - in production this would be more sophisticated
  const currentMajorVersion = SAVE_DATA_VERSION.split(".")[0]
  const saveMajorVersion = saveVersion?.split(".")[0]

  return currentMajorVersion === saveMajorVersion
}

/**
 * Export save data as a JSON file for backup
 */
export function exportSaveData(saveData: SavedGame): void {
  try {
    const dataStr = JSON.stringify(saveData)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `monolith-save-${saveData.name.replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  } catch (error) {
    console.error("Failed to export save data:", error)
    throw new Error("Failed to export save data.")
  }
}

/**
 * Import save data from a JSON file
 */
export async function importSaveData(jsonData: string): Promise<string> {
  try {
    const saveData = JSON.parse(jsonData) as SavedGame

    // Validate the imported data
    if (!saveData.id || !saveData.gameState || !saveData.version) {
      throw new Error("Invalid save data format")
    }

    // Check compatibility
    if (!isSaveCompatible(saveData.version)) {
      throw new Error(
        `Save data version ${saveData.version} is not compatible with the current game version ${SAVE_DATA_VERSION}`,
      )
    }

    // Generate a new ID to avoid conflicts
    const newId = uuidv4()
    const importedSave: SavedGame = {
      ...saveData,
      id: newId,
      name: `Imported: ${saveData.name}`,
      timestamp: new Date().toISOString(),
    }

    await put("saves", importedSave)
    return newId
  } catch (error) {
    console.error("Failed to import save data:", error)
    throw new Error("Failed to import save data. The file may be corrupted or incompatible.")
  }
}

// Add a function to check if there are unsaved changes
export function hasUnsavedChanges(currentState: GameState, lastSavedState?: GameState): boolean {
  if (!lastSavedState) return true

  // Check if the episode has changed
  if (currentState.currentEpisodeId !== lastSavedState.currentEpisodeId) return true

  // Check if inventory has changed
  if (currentState.inventory.length !== lastSavedState.inventory.length) return true

  // Check if stats have changed significantly
  if (Math.abs(currentState.stats.health - lastSavedState.stats.health) > 5) return true
  if (Math.abs(currentState.stats.energy - lastSavedState.stats.energy) > 5) return true

  // Check if history has new entries
  if (currentState.history.length !== lastSavedState.history.length) return true

  // Check if flags have changed
  const currentFlags = Object.keys(currentState.flags).length
  const savedFlags = Object.keys(lastSavedState.flags).length
  if (currentFlags !== savedFlags) return true

  return false
}
