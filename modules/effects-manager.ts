import type { GameState } from "@/types/game"
import type { Effect, EffectCondition, EffectsState } from "@/types/effects"
import { checkOptionCondition } from "@/lib/condition-checker"
import { v4 as uuidv4 } from "uuid"

export class EffectsManager {
  static readonly DEFAULT_EFFECTS_STATE: EffectsState = {
    activeEffects: [],
    effectHistory: [],
  }

  // Add a new effect to the game state
  static addEffect(gameState: GameState, effect: Omit<Effect, "id" | "isActive" | "appliedAt">): GameState {
    // Initialize effects state if it doesn't exist
    if (!gameState.effects) {
      gameState = {
        ...gameState,
        effects: this.DEFAULT_EFFECTS_STATE,
      }
    }

    // Create a new effect with generated ID and metadata
    const newEffect: Effect = {
      id: uuidv4(),
      isActive: true,
      appliedAt: new Date().toISOString(),
      triggerCount: 0,
      ...effect,
    }

    // Check if the effect should be applied based on conditions
    if (newEffect.applyCondition && !this.checkEffectCondition(gameState, newEffect.applyCondition)) {
      // Don't apply the effect if conditions aren't met
      return gameState
    }

    // Add the effect to active effects
    let updatedGameState = {
      ...gameState,
      effects: {
        ...gameState.effects,
        activeEffects: [...gameState.effects.activeEffects, newEffect],
        effectHistory: [
          ...gameState.effects.effectHistory,
          {
            effectId: newEffect.id,
            appliedAt: newEffect.appliedAt,
            source: newEffect.source,
            sourceId: newEffect.sourceId,
          },
        ],
      },
    }

    // Apply immediate effect modifications
    updatedGameState = this.applyEffectModifiers(updatedGameState, newEffect)

    // Run onApply callback if it exists
    if (newEffect.onApply) {
      updatedGameState = newEffect.onApply(updatedGameState)
    }

    return updatedGameState
  }

  // Remove an effect from the game state
  static removeEffect(gameState: GameState, effectId: string): GameState {
    if (!gameState.effects) return gameState

    const effectToRemove = gameState.effects.activeEffects.find((effect) => effect.id === effectId)
    if (!effectToRemove) return gameState

    // Update effect history
    const updatedHistory = gameState.effects.effectHistory.map((entry) => {
      if (entry.effectId === effectId && !entry.removedAt) {
        return {
          ...entry,
          removedAt: new Date().toISOString(),
        }
      }
      return entry
    })

    // Remove the effect from active effects
    let updatedGameState = {
      ...gameState,
      effects: {
        ...gameState.effects,
        activeEffects: gameState.effects.activeEffects.filter((effect) => effect.id !== effectId),
        effectHistory: updatedHistory,
      },
    }

    // Run onRemove callback if it exists
    if (effectToRemove.onRemove) {
      updatedGameState = effectToRemove.onRemove(updatedGameState)
    }

    // Reapply all remaining active effects to ensure state consistency
    updatedGameState = this.recalculateEffects(updatedGameState)

    return updatedGameState
  }

  // Trigger an effect (for event-based effects)
  static triggerEffect(gameState: GameState, effectId: string, context: any = {}): GameState {
    if (!gameState.effects) return gameState

    const effectToTrigger = gameState.effects.activeEffects.find((effect) => effect.id === effectId)
    if (!effectToTrigger || !effectToTrigger.isActive || !effectToTrigger.onTrigger) return gameState

    // Update trigger metadata
    const updatedEffect = {
      ...effectToTrigger,
      lastTriggered: new Date().toISOString(),
      triggerCount: (effectToTrigger.triggerCount || 0) + 1,
    }

    // Update the effect in the game state
    let updatedGameState = {
      ...gameState,
      effects: {
        ...gameState.effects,
        activeEffects: gameState.effects.activeEffects.map((effect) =>
          effect.id === effectId ? updatedEffect : effect,
        ),
      },
    }

    // Run the trigger callback
    updatedGameState = effectToTrigger.onTrigger(updatedGameState, context)

    return updatedGameState
  }

  // Update effects based on scene/episode change
  static updateEffectsOnSceneChange(gameState: GameState, episodeId: string, sceneId?: string): GameState {
    if (!gameState.effects) return gameState

    let updatedGameState = { ...gameState }
    const effectsToRemove: string[] = []

    // Check each effect for expiration or scene-based conditions
    gameState.effects.activeEffects.forEach((effect) => {
      // Check for temporary duration expiration
      if (effect.duration.type === "temporary") {
        // Decrement duration
        const updatedDuration = {
          ...effect.duration,
          duration: effect.duration.duration - 1,
        }

        // If duration is expired, mark for removal
        if (updatedDuration.duration <= 0) {
          effectsToRemove.push(effect.id)
        } else {
          // Update the effect with new duration
          updatedGameState = {
            ...updatedGameState,
            effects: {
              ...updatedGameState.effects,
              activeEffects: updatedGameState.effects.activeEffects.map((e) =>
                e.id === effect.id
                  ? {
                      ...e,
                      duration: updatedDuration,
                    }
                  : e,
              ),
            },
          }
        }
      }

      // Check for conditional duration based on scene/episode
      if (
        effect.duration.type === "conditional" &&
        (effect.duration.condition.episodeId || effect.duration.condition.sceneId)
      ) {
        const episodeMatches = effect.duration.condition.episodeId
          ? effect.duration.condition.episodeId === episodeId
          : true
        const sceneMatches = effect.duration.condition.sceneId ? effect.duration.condition.sceneId === sceneId : true

        // If both conditions match, remove the effect
        if (episodeMatches && sceneMatches) {
          effectsToRemove.push(effect.id)
        }
      }
    })

    // Remove expired effects
    effectsToRemove.forEach((effectId) => {
      updatedGameState = this.removeEffect(updatedGameState, effectId)
    })

    // Check for new effects that should be activated based on scene/episode
    // This would be implemented in the scene/episode handling code

    return updatedGameState
  }

  // Check for timed effect expirations
  static checkTimedEffects(gameState: GameState): GameState {
    if (!gameState.effects) return gameState

    let updatedGameState = { ...gameState }
    const now = new Date().toISOString()
    const effectsToRemove: string[] = []

    // Check each effect for timed expiration
    gameState.effects.activeEffects.forEach((effect) => {
      if (effect.duration.type === "timed" && effect.duration.expiresAt < now) {
        effectsToRemove.push(effect.id)
      }
    })

    // Remove expired effects
    effectsToRemove.forEach((effectId) => {
      updatedGameState = this.removeEffect(updatedGameState, effectId)
    })

    return updatedGameState
  }

  // Get all active effects
  static getActiveEffects(gameState: GameState): Effect[] {
    if (!gameState.effects) return []
    return gameState.effects.activeEffects
  }

  // Get active effects by source
  static getEffectsBySource(gameState: GameState, source: string, sourceId?: string): Effect[] {
    if (!gameState.effects) return []
    return gameState.effects.activeEffects.filter(
      (effect) => effect.source === source && (!sourceId || effect.sourceId === sourceId),
    )
  }

  // Get active effects that modify a specific stat
  static getEffectsForStat(gameState: GameState, statName: string): Effect[] {
    if (!gameState.effects) return []
    return gameState.effects.activeEffects.filter(
      (effect) => effect.statModifiers && effect.statModifiers[statName] !== undefined,
    )
  }

  // Get active effects that modify a specific skill
  static getEffectsForSkill(gameState: GameState, skillName: string): Effect[] {
    if (!gameState.effects) return []
    return gameState.effects.activeEffects.filter(
      (effect) => effect.skillModifiers && effect.skillModifiers[skillName] !== undefined,
    )
  }

  // Get the total modifier for a specific stat from all active effects
  static getTotalStatModifier(gameState: GameState, statName: string): number {
    if (!gameState.effects) return 0
    return gameState.effects.activeEffects.reduce((total, effect) => {
      if (effect.isActive && effect.statModifiers && effect.statModifiers[statName] !== undefined) {
        return total + effect.statModifiers[statName]
      }
      return total
    }, 0)
  }

  // Get the total modifier for a specific skill from all active effects
  static getTotalSkillModifier(gameState: GameState, skillName: string): number {
    if (!gameState.effects) return 0
    return gameState.effects.activeEffects.reduce((total, effect) => {
      if (effect.isActive && effect.skillModifiers && effect.skillModifiers[skillName] !== undefined) {
        return total + effect.skillModifiers[skillName]
      }
      return total
    }, 0)
  }

  // Check if an effect condition is met
  static checkEffectCondition(gameState: GameState, condition: EffectCondition): boolean {
    return checkOptionCondition({ ...condition }, gameState)
  }

  // Apply effect modifiers to game state
  private static applyEffectModifiers(gameState: GameState, effect: Effect): GameState {
    let updatedGameState = { ...gameState }

    // Apply stat modifiers
    if (effect.statModifiers) {
      const updatedStats = { ...updatedGameState.stats }
      Object.entries(effect.statModifiers).forEach(([statName, value]) => {
        if (updatedStats[statName] !== undefined) {
          updatedStats[statName] += value
        }
      })
      updatedGameState.stats = updatedStats
    }

    // Apply skill modifiers
    if (effect.skillModifiers) {
      const updatedSkills = { ...updatedGameState.skills }
      Object.entries(effect.skillModifiers).forEach(([skillName, value]) => {
        if (updatedSkills[skillName] !== undefined) {
          updatedSkills[skillName] += value
          // Clamp between 1-10
          updatedSkills[skillName] = Math.max(1, Math.min(10, updatedSkills[skillName]))
        }
      })
      updatedGameState.skills = updatedSkills
    }

    // Apply reputation modifiers
    if (effect.reputationModifiers && updatedGameState.reputation) {
      Object.entries(effect.reputationModifiers).forEach(([factionId, value]) => {
        const faction = updatedGameState.reputation?.factions[factionId]
        if (faction) {
          updatedGameState = {
            ...updatedGameState,
            reputation: {
              ...updatedGameState.reputation,
              factions: {
                ...updatedGameState.reputation.factions,
                [factionId]: {
                  ...faction,
                  currentValue: Math.max(-100, Math.min(100, faction.currentValue + value)),
                },
              },
            },
          }
        }
      })
    }

    // Apply flag modifiers
    if (effect.flagModifiers) {
      updatedGameState = {
        ...updatedGameState,
        flags: {
          ...updatedGameState.flags,
          ...effect.flagModifiers,
        },
      }
    }

    return updatedGameState
  }

  // Recalculate all effects (used after removing an effect)
  private static recalculateEffects(gameState: GameState): GameState {
    if (!gameState.effects) return gameState

    // Reset stats and skills to base values
    // This would require storing base values separately from modified values
    // For now, we'll just reapply all active effects

    let updatedGameState = { ...gameState }

    // Apply all active effects in order
    gameState.effects.activeEffects.forEach((effect) => {
      if (effect.isActive) {
        updatedGameState = this.applyEffectModifiers(updatedGameState, effect)
      }
    })

    return updatedGameState
  }
}
