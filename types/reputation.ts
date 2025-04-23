export type ReputationLevel =
  | "hated"
  | "hostile"
  | "unfriendly"
  | "neutral"
  | "friendly"
  | "respected"
  | "honored"
  | "exalted"

export interface ReputationEffects {
  tradePriceModifier: number // Percentage modifier to prices (positive = more expensive)
  dialogueOptions: boolean // Whether special dialogue options are available
  questAvailability: boolean // Whether faction quests are available
  safePassage: boolean // Whether the player can safely travel through faction territory
  companions: boolean // Whether faction companions are available
}

export interface FactionReputation {
  id: string
  name: string
  description: string
  currentValue: number // -100 to 100
  level: ReputationLevel
  effects: ReputationEffects
  icon: string
  color: string
  hidden?: boolean // Whether this faction is hidden until discovered
}

export interface ReputationEvent {
  factionId: string
  timestamp: string
  change: number
  reason: string
}

export interface ReputationData {
  factions: Record<string, FactionReputation>
  generalAlignment: "lawful" | "neutral" | "chaotic"
  reputationEvents: ReputationEvent[]
}

export interface ReputationChange {
  value: number
  reason: string
}
