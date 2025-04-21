import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { GameState } from "@/types/game"
import type { Option } from "@/types/episode"

// Helper function to filter available options based on conditions
export function getAvailableOptions(options: Option[], gameState: GameState): Option[] {
  return options.filter((option) => {
    // If there's no condition, the option is always available
    if (!option.condition) {
      return true
    }

    // Check flag conditions
    if (option.condition.flags) {
      for (const [flagName, expectedValue] of Object.entries(option.condition.flags)) {
        if (gameState.flags[flagName] !== expectedValue) {
          return false
        }
      }
    }

    // Check stat conditions
    if (option.condition.stats) {
      for (const [statName, requirement] of Object.entries(option.condition.stats)) {
        const statValue = gameState.stats[statName]

        if (statValue === undefined) {
          return false
        }

        if (typeof requirement === "number") {
          if (statValue < requirement) {
            return false
          }
        } else {
          if (requirement.min !== undefined && statValue < requirement.min) {
            return false
          }
          if (requirement.max !== undefined && statValue > requirement.max) {
            return false
          }
        }
      }
    }

    // Check inventory conditions
    if (option.condition.hasItems) {
      for (const itemId of option.condition.hasItems) {
        if (!gameState.inventory.some((item) => item.id === itemId)) {
          return false
        }
      }
    }

    return true
  })
}

// Format a timestamp for display
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
