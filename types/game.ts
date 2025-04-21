import type { PlayerPerks } from "./perks"

export interface GameState {
  currentEpisodeId: string
  inventory: Item[]
  stats: Stats
  skills: Skills
  flags: Record<string, boolean | string | number>
  history: HistoryEntry[]
  perks: PlayerPerks
  level?: number
}

export interface Item {
  id: string
  name: string
  description: string
  quantity: number
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
