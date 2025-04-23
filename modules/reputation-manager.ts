import type { GameState } from "@/types/game"
import type { FactionReputation, ReputationLevel, ReputationEffects, ReputationData } from "@/types/reputation"

export class ReputationManager {
  // Default reputation data
  static readonly DEFAULT_REPUTATION_DATA: ReputationData = {
    factions: {
      "wasteland-survivors": {
        id: "wasteland-survivors",
        name: "Wasteland Survivors",
        description: "Scattered groups of survivors trying to rebuild civilization in the wasteland.",
        currentValue: 0,
        level: "neutral",
        effects: {
          tradePriceModifier: 0,
          dialogueOptions: false,
          questAvailability: false,
          safePassage: true,
          companions: false,
        },
        icon: "people",
        color: "text-gold",
      },
      "tech-brotherhood": {
        id: "tech-brotherhood",
        name: "Tech Brotherhood",
        description: "A secretive organization dedicated to preserving pre-war technology.",
        currentValue: 0,
        level: "neutral",
        effects: {
          tradePriceModifier: 0,
          dialogueOptions: false,
          questAvailability: false,
          safePassage: true,
          companions: false,
        },
        icon: "cpu",
        color: "text-accent-blue",
      },
      raiders: {
        id: "raiders",
        name: "Raiders",
        description: "Violent gangs that prey on the weak and vulnerable.",
        currentValue: -20,
        level: "unfriendly",
        effects: {
          tradePriceModifier: 15, // They charge more
          dialogueOptions: false,
          questAvailability: false,
          safePassage: false,
          companions: false,
        },
        icon: "skull",
        color: "text-rust",
      },
      mutants: {
        id: "mutants",
        name: "Mutant Collective",
        description: "Communities of mutated humans with their own culture and goals.",
        currentValue: -10,
        level: "unfriendly",
        effects: {
          tradePriceModifier: 10,
          dialogueOptions: false,
          questAvailability: false,
          safePassage: false,
          companions: false,
        },
        icon: "radiation",
        color: "text-accent-purple",
      },
      "merchants-guild": {
        id: "merchants-guild",
        name: "Merchants Guild",
        description: "A network of traders who control most commerce in the wasteland.",
        currentValue: 0,
        level: "neutral",
        effects: {
          tradePriceModifier: 0,
          dialogueOptions: false,
          questAvailability: false,
          safePassage: true,
          companions: false,
        },
        icon: "shopping-bag",
        color: "text-gold",
      },
    },
    generalAlignment: "neutral",
    reputationEvents: [],
  }

  // Reputation thresholds for each level
  static readonly REPUTATION_THRESHOLDS = {
    hated: -100,
    hostile: -75,
    unfriendly: -25,
    neutral: -10,
    friendly: 10,
    respected: 50,
    honored: 75,
    exalted: 90,
  }

  // Effects for each reputation level
  static readonly REPUTATION_EFFECTS: Record<ReputationLevel, ReputationEffects> = {
    hated: {
      tradePriceModifier: 50, // 50% more expensive
      dialogueOptions: false,
      questAvailability: false,
      safePassage: false,
      companions: false,
    },
    hostile: {
      tradePriceModifier: 30,
      dialogueOptions: false,
      questAvailability: false,
      safePassage: false,
      companions: false,
    },
    unfriendly: {
      tradePriceModifier: 15,
      dialogueOptions: false,
      questAvailability: false,
      safePassage: false,
      companions: false,
    },
    neutral: {
      tradePriceModifier: 0,
      dialogueOptions: false,
      questAvailability: false,
      safePassage: true,
      companions: false,
    },
    friendly: {
      tradePriceModifier: -10, // 10% discount
      dialogueOptions: true,
      questAvailability: true,
      safePassage: true,
      companions: false,
    },
    respected: {
      tradePriceModifier: -20,
      dialogueOptions: true,
      questAvailability: true,
      safePassage: true,
      companions: true,
    },
    honored: {
      tradePriceModifier: -30,
      dialogueOptions: true,
      questAvailability: true,
      safePassage: true,
      companions: true,
    },
    exalted: {
      tradePriceModifier: -40,
      dialogueOptions: true,
      questAvailability: true,
      safePassage: true,
      companions: true,
    },
  }

  // Calculate reputation level based on numeric value
  static calculateReputationLevel(value: number): ReputationLevel {
    if (value <= this.REPUTATION_THRESHOLDS.hated) return "hated"
    if (value <= this.REPUTATION_THRESHOLDS.hostile) return "hostile"
    if (value <= this.REPUTATION_THRESHOLDS.unfriendly) return "unfriendly"
    if (value < this.REPUTATION_THRESHOLDS.neutral) return "neutral"
    if (value < this.REPUTATION_THRESHOLDS.friendly) return "friendly"
    if (value < this.REPUTATION_THRESHOLDS.respected) return "respected"
    if (value < this.REPUTATION_THRESHOLDS.honored) return "honored"
    if (value < this.REPUTATION_THRESHOLDS.exalted) return "exalted"
    return "exalted"
  }

  // Get effects for a reputation level
  static getEffectsForLevel(level: ReputationLevel): ReputationEffects {
    return this.REPUTATION_EFFECTS[level]
  }

  // Change reputation with a faction
  static changeReputation(gameState: GameState, factionId: string, change: number, reason: string): GameState {
    // If reputation data doesn't exist, initialize it
    if (!gameState.reputation) {
      gameState = {
        ...gameState,
        reputation: { ...this.DEFAULT_REPUTATION_DATA },
      }
    }

    // If faction doesn't exist, return unchanged state
    if (!gameState.reputation.factions[factionId]) {
      console.warn(`Faction ${factionId} not found in reputation data`)
      return gameState
    }

    // Get current faction data
    const faction = gameState.reputation.factions[factionId]

    // Calculate new value (clamped between -100 and 100)
    const newValue = Math.max(-100, Math.min(100, faction.currentValue + change))

    // Calculate new level
    const newLevel = this.calculateReputationLevel(newValue)

    // Get effects for the new level
    const newEffects = this.getEffectsForLevel(newLevel)

    // Create updated faction data
    const updatedFaction: FactionReputation = {
      ...faction,
      currentValue: newValue,
      level: newLevel,
      effects: newEffects,
    }

    // Create reputation event
    const reputationEvent = {
      factionId,
      timestamp: new Date().toISOString(),
      change,
      reason,
    }

    // Update game state
    return {
      ...gameState,
      reputation: {
        ...gameState.reputation,
        factions: {
          ...gameState.reputation.factions,
          [factionId]: updatedFaction,
        },
        reputationEvents: [...gameState.reputation.reputationEvents, reputationEvent],
      },
    }
  }

  // Get reputation with a faction
  static getReputation(gameState: GameState, factionId: string): FactionReputation | undefined {
    if (!gameState.reputation || !gameState.reputation.factions[factionId]) {
      return undefined
    }
    return gameState.reputation.factions[factionId]
  }

  // Check if player has at least the specified reputation level with a faction
  static hasReputationLevel(gameState: GameState, factionId: string, level: ReputationLevel): boolean {
    const faction = this.getReputation(gameState, factionId)
    if (!faction) return false

    const currentLevelValue = this.REPUTATION_THRESHOLDS[faction.level]
    const requiredLevelValue = this.REPUTATION_THRESHOLDS[level]

    return currentLevelValue >= requiredLevelValue
  }

  // Discover a new faction (make it visible)
  static discoverFaction(gameState: GameState, factionId: string): GameState {
    if (
      !gameState.reputation ||
      !gameState.reputation.factions[factionId] ||
      !gameState.reputation.factions[factionId].hidden
    ) {
      return gameState
    }

    return {
      ...gameState,
      reputation: {
        ...gameState.reputation,
        factions: {
          ...gameState.reputation.factions,
          [factionId]: {
            ...gameState.reputation.factions[factionId],
            hidden: false,
          },
        },
      },
    }
  }

  // Calculate general alignment based on all faction reputations
  static calculateGeneralAlignment(gameState: GameState): "lawful" | "neutral" | "chaotic" {
    if (!gameState.reputation) return "neutral"

    // Get average reputation with "good" factions (survivors, brotherhood, merchants)
    const goodFactions = ["wasteland-survivors", "tech-brotherhood", "merchants-guild"]
    const goodRep =
      goodFactions.reduce((sum, factionId) => {
        const faction = gameState.reputation?.factions[factionId]
        return sum + (faction ? faction.currentValue : 0)
      }, 0) / goodFactions.length

    // Get average reputation with "bad" factions (raiders, mutants)
    const badFactions = ["raiders", "mutants"]
    const badRep =
      badFactions.reduce((sum, factionId) => {
        const faction = gameState.reputation?.factions[factionId]
        return sum + (faction ? faction.currentValue : 0)
      }, 0) / badFactions.length

    // Calculate alignment based on reputation with good vs bad factions
    if (goodRep > 25 && badRep < -25) return "lawful"
    if (goodRep < -25 && badRep > 25) return "chaotic"
    return "neutral"
  }

  // Update general alignment
  static updateGeneralAlignment(gameState: GameState): GameState {
    if (!gameState.reputation) return gameState

    const alignment = this.calculateGeneralAlignment(gameState)

    return {
      ...gameState,
      reputation: {
        ...gameState.reputation,
        generalAlignment: alignment,
      },
    }
  }

  // Get color for reputation level
  static getReputationColor(level: ReputationLevel): string {
    switch (level) {
      case "hated":
        return "text-rust"
      case "hostile":
        return "text-rust"
      case "unfriendly":
        return "text-rust-light"
      case "neutral":
        return "text-white"
      case "friendly":
        return "text-gold-dark"
      case "respected":
        return "text-gold"
      case "honored":
        return "text-gold"
      case "exalted":
        return "text-gold-light"
      default:
        return "text-white"
    }
  }

  // Get description for reputation level
  static getReputationDescription(level: ReputationLevel): string {
    switch (level) {
      case "hated":
        return "They will attack you on sight."
      case "hostile":
        return "They are openly hostile toward you."
      case "unfriendly":
        return "They distrust you and may refuse service."
      case "neutral":
        return "They neither like nor dislike you."
      case "friendly":
        return "They are willing to help you."
      case "respected":
        return "They hold you in high regard."
      case "honored":
        return "They consider you a valuable ally."
      case "exalted":
        return "They revere you as a hero."
      default:
        return ""
    }
  }
}
