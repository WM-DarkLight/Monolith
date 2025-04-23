import type { Condition, SkillCheck } from "@/types/episode"
import type { GameState, SkillCheckResult } from "@/types/game"
import { SkillManager } from "@/modules/skill-manager"
import { ReputationManager } from "@/modules/reputation-manager"
import { EffectsManager } from "@/modules/effects-manager"

export function checkOptionCondition(condition: Condition, gameState: GameState): boolean {
  // Check flag conditions
  if (condition.flags) {
    for (const [flagName, requiredValue] of Object.entries(condition.flags)) {
      const actualValue = gameState.flags[flagName]

      // If the flag doesn't exist or doesn't match the required value
      if (actualValue !== requiredValue) {
        return false
      }
    }
  }

  // Check stat conditions
  if (condition.stats) {
    for (const [statName, requirement] of Object.entries(condition.stats)) {
      // Get base stat value
      const baseValue = gameState.stats[statName]

      // Get stat modifiers from effects
      const effectsModifier = EffectsManager.getTotalStatModifier(gameState, statName)

      // Calculate total stat value
      const actualValue = baseValue !== undefined ? baseValue + effectsModifier : undefined

      if (actualValue === undefined) {
        return false
      }

      if (typeof requirement === "number") {
        // Simple equality check
        if (actualValue !== requirement) {
          return false
        }
      } else {
        // Range check with min/max
        if (requirement.min !== undefined && actualValue < requirement.min) {
          return false
        }
        if (requirement.max !== undefined && actualValue > requirement.max) {
          return false
        }
      }
    }
  }

  // Check skill conditions
  if (condition.skills) {
    for (const [skillName, requirement] of Object.entries(condition.skills)) {
      // Get effective skill value including effects
      const actualValue = SkillManager.getEffectiveSkill(gameState, skillName)

      if (actualValue === undefined) {
        return false
      }

      if (typeof requirement === "number") {
        // Simple equality check
        if (actualValue < requirement) {
          return false
        }
      } else {
        // Range check with min/max
        if (requirement.min !== undefined && actualValue < requirement.min) {
          return false
        }
        if (requirement.max !== undefined && actualValue > requirement.max) {
          return false
        }
      }
    }
  }

  // Check inventory conditions
  if (condition.hasItems) {
    for (const itemId of condition.hasItems) {
      if (!gameState.inventory.some((item) => item.id === itemId)) {
        return false
      }
    }
  }

  // Check perk conditions
  if (condition.perks) {
    for (const [perkId, required] of Object.entries(condition.perks)) {
      const hasPerk = gameState.perks?.unlockedPerks[perkId] > 0
      if (required && !hasPerk) {
        return false
      }
    }
  }

  // Check reputation conditions
  if (condition.reputation && gameState.reputation) {
    for (const [factionId, requirement] of Object.entries(condition.reputation)) {
      const faction = gameState.reputation.factions[factionId]

      // If faction doesn't exist or is hidden
      if (!faction || faction.hidden) {
        return false
      }

      if (typeof requirement === "string") {
        // Simple level check
        const requiredLevelValue = ReputationManager.REPUTATION_THRESHOLDS[requirement]
        const currentLevelValue = ReputationManager.REPUTATION_THRESHOLDS[faction.level]

        if (currentLevelValue < requiredLevelValue) {
          return false
        }
      } else {
        // Range check with min/max
        if (requirement.min) {
          const minLevelValue = ReputationManager.REPUTATION_THRESHOLDS[requirement.min]
          const currentLevelValue = ReputationManager.REPUTATION_THRESHOLDS[faction.level]

          if (currentLevelValue < minLevelValue) {
            return false
          }
        }

        if (requirement.max) {
          const maxLevelValue = ReputationManager.REPUTATION_THRESHOLDS[requirement.max]
          const currentLevelValue = ReputationManager.REPUTATION_THRESHOLDS[faction.level]

          if (currentLevelValue > maxLevelValue) {
            return false
          }
        }
      }
    }
  }

  // All conditions passed
  return true
}

export function performSkillCheck(skillCheck: SkillCheck, gameState: GameState): SkillCheckResult {
  return SkillManager.performSkillCheck(gameState, skillCheck)
}
