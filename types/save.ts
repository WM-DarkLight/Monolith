import type { GameState, Stats } from "./game"

export interface SavedGame {
  id: string
  slotId?: string
  name: string
  episodeId: string
  episodeTitle: string
  timestamp: string
  gameState: GameState
  stats: Stats
  version: string
  thumbnail: string
  compressed: boolean
}

export interface SaveSlot {
  id: string
  slotId?: string
  name: string
  timestamp: string
  episodeTitle: string
  isEmpty: boolean
  isAutoSave?: boolean
}

export interface SaveError {
  message: string
  code: string
  details?: any
}
