import type { Stats, Skills } from "./game"

export interface Episode {
  id: string
  title: string
  description?: string
  text: string
  options: Option[]
  allowCustomSkills?: boolean
  recommendedSkills?: Partial<Record<keyof Skills, number>>
  skillPoints?: number
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
  nextEpisode?: string
  failureEpisode?: string
  condition?: Condition
  skillCheck?: SkillCheck
  setFlags?: Record<string, boolean | string | number>
  modifyStats?: Partial<Record<keyof Stats, number>>
  modifySkills?: Partial<Record<keyof Skills, number>>
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

export interface Condition {
  flags?: Record<string, boolean | string | number>
  stats?: Record<string, number | { min?: number; max?: number }>
  skills?: Record<string, number | { min?: number; max?: number }>
  hasItems?: string[]
  perks?: Record<string, boolean> // Add this line for perk conditions
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
