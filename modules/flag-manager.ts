import type { GameState } from "@/types/game"

export class FlagManager {
  static setFlag(gameState: GameState, flagName: string, value: boolean | string | number): GameState {
    return {
      ...gameState,
      flags: {
        ...gameState.flags,
        [flagName]: value,
      },
    }
  }

  static getFlag(gameState: GameState, flagName: string): boolean | string | number | undefined {
    return gameState.flags[flagName]
  }

  static hasFlag(gameState: GameState, flagName: string): boolean {
    return gameState.flags[flagName] !== undefined
  }

  static removeFlag(gameState: GameState, flagName: string): GameState {
    const { [flagName]: _, ...remainingFlags } = gameState.flags

    return {
      ...gameState,
      flags: remainingFlags,
    }
  }

  static checkFlag(gameState: GameState, flagName: string, expectedValue?: boolean | string | number): boolean {
    const actualValue = gameState.flags[flagName]

    if (expectedValue === undefined) {
      // Just check if the flag exists and is truthy
      return !!actualValue
    }

    // Check if the flag has the expected value
    return actualValue === expectedValue
  }
}
