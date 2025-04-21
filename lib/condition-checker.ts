import type { Condition, SkillCheck } from "@/types/episode"
import type { GameState, SkillCheckResult } from "@/types/game"
import { SkillManager } from "@/modules/skill-manager"

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
      const actualValue = gameState.stats[statName]

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
      const actualValue = gameState.skills[skillName]

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

  // All conditions passed
  return true
}

export function performSkillCheck(skillCheck: SkillCheck, gameState: GameState): SkillCheckResult {
  return SkillManager.performSkillCheck(gameState, skillCheck)
}
