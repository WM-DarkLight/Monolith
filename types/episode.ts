import type { Stats, Skills } from "./game"
import type { ReputationChange } from "./reputation"
import type { NPC } from "./dialogue" // Add this import

export interface Episode {
  id: string
  title: string
  description?: string
  text: string
  options: Option[]
  scenes?: Record<string, Scene> // Collection of scenes for this episode
  initialScene?: string // Initial scene to display
  allowCustomSkills?: boolean
  recommendedSkills?: Partial<Record<keyof Skills, number>>
  skillPoints?: number
  npcs?: Record<string, NPC> // Add NPCs to episodes
}

export interface EpisodeSummary {
  id: string
  title: string
  description: string
  completed: boolean
  started: boolean
  allowCustomSkills?: boolean
}

export interface Option {
  id: string
  text: string
  nextEpisode?: string // Keep for backward compatibility
  scene?: string // New scene identifier for navigation
  failureEpisode?: string
  failureScene?: string // New failure scene identifier
  condition?: Condition
  skillCheck?: SkillCheck
  setFlags?: Record<string, boolean | string | number>
  modifyStats?: Partial<Record<keyof Stats, number>>
  modifySkills?: Partial<Record<keyof Skills, number>>
  modifyReputation?: Record<string, ReputationChange> // Add reputation changes
  failureReputation?: Record<string, ReputationChange> // Add failure reputation changes
  addItems?: Array<{
    id: string
    name: string
    description: string
    quantity: number
  }>
  removeItems?: string[]
  successText?: string
  failureText?: string
  failureFlags?: Record<string, boolean | string | number>
  failureStats?: Partial<Record<keyof Stats, number>>
}

export type ReputationLevel = "hostile" | "unfriendly" | "neutral" | "friendly" | "helpful"

export interface Condition {
  flags?: Record<string, boolean | string | number>
  stats?: Record<string, number | { min?: number; max?: number }>
  skills?: Record<string, number | { min?: number; max?: number }>
  hasItems?: string[]
  perks?: Record<string, boolean> // Add this line for perk conditions
  reputation?: Record<string, ReputationLevel | { min: ReputationLevel; max?: ReputationLevel }> // Add reputation conditions
}

export interface SkillCheck {
  skill: keyof Skills
  difficulty: number
  bonus?: {
    itemId?: string
    flagName?: string
    value: number
  }
}

export type EpisodeRegistry = Record<string, Episode>

// Add a Scene interface
export interface Scene {
  id: string
  title: string
  text: string
  options: Option[]
  availableNpcs?: string[] // IDs of NPCs available for dialogue in this scene
}
