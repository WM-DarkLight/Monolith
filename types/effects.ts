import type { GameState, Stats, Skills } from "@/types/game"
import type { ReputationLevel } from "@/types/reputation"

export type EffectSource = "perk" | "item" | "quest" | "event" | "dialogue" | "skill" | "scene"

export type EffectDuration =
  | { type: "permanent" }
  | { type: "temporary"; duration: number } // Duration in scenes or turns
  | { type: "timed"; expiresAt: string } // ISO timestamp
  | { type: "conditional"; condition: EffectCondition }

export interface EffectCondition {
  flags?: Record<string, boolean | string | number>
  stats?: Record<string, number | { min?: number; max?: number }>
  skills?: Record<string, number | { min?: number; max?: number }>
  hasItems?: string[]
  perks?: Record<string, boolean>
  reputation?: Record<string, ReputationLevel | { min: ReputationLevel; max?: ReputationLevel }>
  sceneId?: string
  episodeId?: string
}

export interface Effect {
  id: string
  name: string
  description: string
  source: EffectSource
  sourceId: string // ID of the perk, item, etc.
  duration: EffectDuration

  // Possible effect targets
  statModifiers?: Partial<Record<keyof Stats, number>>
  skillModifiers?: Partial<Record<keyof Skills, number>>
  reputationModifiers?: Record<string, number>
  flagModifiers?: Record<string, boolean | string | number>

  // Special effects
  unlockDialogueOptions?: string[]
  unlockSceneOptions?: string[]

  // Conditional application
  applyCondition?: EffectCondition

  // Callbacks for custom logic
  onApply?: (gameState: GameState) => GameState
  onRemove?: (gameState: GameState) => GameState
  onTrigger?: (gameState: GameState, context: any) => GameState

  // Metadata
  isActive: boolean
  appliedAt: string // ISO timestamp
  lastTriggered?: string // ISO timestamp
  triggerCount?: number
  icon?: string
  tags?: string[]
}

export interface EffectsState {
  activeEffects: Effect[]
  effectHistory: {
    effectId: string
    appliedAt: string
    removedAt?: string
    source: EffectSource
    sourceId: string
  }[]
}
