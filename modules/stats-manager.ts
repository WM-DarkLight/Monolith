import type { GameState, Stats } from "@/types/game"

export class StatsManager {
  static modifyStat(gameState: GameState, statName: keyof Stats, amount: number): GameState {
    if (gameState.stats[statName] === undefined) {
      return gameState
    }

    // Create a new stats object with the updated value
    const updatedStats = {
      ...gameState.stats,
      [statName]: Math.max(0, gameState.stats[statName] + amount), // Prevent negative values
    }

    return {
      ...gameState,
      stats: updatedStats,
    }
  }

  static setStat(gameState: GameState, statName: keyof Stats, value: number): GameState {
    // Create a new stats object with the set value
    const updatedStats = {
      ...gameState.stats,
      [statName]: Math.max(0, value), // Prevent negative values
    }

    return {
      ...gameState,
      stats: updatedStats,
    }
  }

  static checkStatThreshold(
    gameState: GameState,
    statName: keyof Stats,
    threshold: number,
    comparison: "greater" | "less" | "equal" = "greater",
  ): boolean {
    if (gameState.stats[statName] === undefined) {
      return false
    }

    const value = gameState.stats[statName]

    switch (comparison) {
      case "greater":
        return value > threshold
      case "less":
        return value < threshold
      case "equal":
        return value === threshold
      default:
        return false
    }
  }
}
