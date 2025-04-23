import type { PlayerPerks } from "./perks"
import type { ReputationData } from "./reputation"
import type { DialogueState } from "./dialogue"
import type { EffectsState } from "./effects"

export interface GameState {
  currentEpisodeId: string
  currentSceneId?: string | null
  inventory: Item[]
  stats: Stats
  skills: Skills
  flags: Record<string, boolean | string | number>
  history: HistoryEntry[]
  perks: PlayerPerks
  level?: number
  reputation?: ReputationData
  dialogueState?: DialogueState
  npcInteractions?: Record<string, Record<string, boolean | string | number>>
  effects?: EffectsState // Add effects state
}

export interface Item {
  id: string
  name: string
  description: string
  quantity: number
  // Add item effects
  effects?: {
    onUse?: string[] // IDs of effects to apply when used
    onEquip?: string[] // IDs of effects to apply when equipped
    isEquippable?: boolean
    isEquipped?: boolean
    isConsumable?: boolean
    charges?: number // For limited-use items
  }
}

export interface Stats {
  health: number
  energy: number
  maxHealth?: number
  maxEnergy?: number
  healthRegen?: number
  energyRegen?: number
  radiationResistance?: number
  toxinResistance?: number
  carryWeight?: number
  [key: string]: number | undefined
}

export interface Skills {
  strength: number
  intelligence: number
  charisma: number
  perception: number
  agility: number
  luck: number
  [key: string]: number
}

export interface HistoryEntry {
  episodeId: string
  text: string
  choiceText: string
  timestamp: string
}

export interface SkillCheckResult {
  success: boolean
  skillName: string
  playerValue: number
  difficulty: number
  bonusApplied?: number
  roll?: number
  luckBonus?: number
}
