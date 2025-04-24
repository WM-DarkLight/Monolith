import type { Skills } from "./game"

export interface Campaign {
  id: string
  title: string
  description: string
  episodes: CampaignEpisode[]
  allowCustomSkills?: boolean
  skillPoints?: number
  recommendedSkills?: Partial<Record<keyof Skills, number>>
  // Controls whether skills/perks carry over between episodes
  persistentProgress: boolean
}

export interface CampaignEpisode {
  id: string
  title: string
  description?: string
  // Optional conditions to unlock this episode
  unlockConditions?: {
    requiredFlags?: Record<string, boolean | string | number>
    requiredItems?: string[]
    requiredPerks?: string[]
    requiredEpisodes?: string[] // Previous episodes that must be completed
  }
}

export interface CampaignProgress {
  campaignId: string
  currentEpisodeIndex: number
  completedEpisodes: string[]
  startedAt: string
  lastPlayedAt: string
  everCompleted?: boolean // Track if campaign was ever fully completed
}

export type CampaignRegistry = Record<string, Campaign>
