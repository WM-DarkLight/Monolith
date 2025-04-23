import type { GameState } from "@/types/game"
import type { Perk, PlayerPerks } from "@/types/perks"
import { perks } from "@/data/perks"
import { EffectsManager } from "@/modules/effects-manager"

export class PerkManager {
  static readonly DEFAULT_PLAYER_PERKS: PlayerPerks = {
    unlockedPerks: {},
    perkPoints: 0,
    artifactSlots: 2,
    equippedArtifacts: [],
  }

  static getPerk(perkId: string): Perk | undefined {
    return perks.find((perk) => perk.id === perkId)
  }

  static getAllPerks(): Perk[] {
    return [...perks]
  }

  static getAvailablePerks(gameState: GameState): Perk[] {
    const playerLevel = gameState.level || 1
    const playerPerks = gameState.perks || this.DEFAULT_PLAYER_PERKS

    return perks.filter((perk) => {
      // Skip already maxed out perks
      const currentRank = playerPerks.unlockedPerks[perk.id] || 0
      if (perk.maxRank && currentRank >= perk.maxRank) {
        return false
      }

      // Check requirements
      if (perk.requirements) {
        // Level requirement
        if (perk.requirements.level && playerLevel < perk.requirements.level) {
          return false
        }

        // Skill requirements
        if (perk.requirements.skills) {
          for (const [skill, value] of Object.entries(perk.requirements.skills)) {
            if ((gameState.skills[skill] || 0) < value) {
              return false
            }
          }
        }

        // Required perks
        if (perk.requirements.perks) {
          for (const requiredPerk of perk.requirements.perks) {
            if (!playerPerks.unlockedPerks[requiredPerk]) {
              return false
            }
          }
        }

        // Flag requirements
        if (perk.requirements.flags) {
          for (const [flag, value] of Object.entries(perk.requirements.flags)) {
            if (gameState.flags[flag] !== value) {
              return false
            }
          }
        }

        // Mutually exclusive perks
        if (perk.requirements.mutuallyExclusive) {
          for (const exclusivePerk of perk.requirements.mutuallyExclusive) {
            if (playerPerks.unlockedPerks[exclusivePerk]) {
              return false
            }
          }
        }
      }

      return true
    })
  }

  static unlockPerk(gameState: GameState, perkId: string): GameState {
    const perk = this.getPerk(perkId)
    if (!perk) return gameState

    const playerPerks = gameState.perks || this.DEFAULT_PLAYER_PERKS

    // Check if player has enough perk points
    if (playerPerks.perkPoints <= 0) return gameState

    // Check if perk is already at max rank
    const currentRank = playerPerks.unlockedPerks[perkId] || 0
    if (perk.maxRank && currentRank >= perk.maxRank) return gameState

    // Create updated perks object
    const updatedPerks: PlayerPerks = {
      ...playerPerks,
      perkPoints: playerPerks.perkPoints - 1,
      unlockedPerks: {
        ...playerPerks.unlockedPerks,
        [perkId]: currentRank + 1,
      },
    }

    // Apply perk effects to game state
    let updatedGameState = {
      ...gameState,
      perks: updatedPerks,
    }

    // Create an effect for this perk
    if (perk.effects) {
      const perkEffect = {
        name: perk.name,
        description: perk.description,
        source: "perk" as const,
        sourceId: perkId,
        duration: { type: "permanent" as const },
        statModifiers: perk.effects.stats,
        skillModifiers: perk.effects.skills,
        flagModifiers: perk.effects.setFlags,
        icon: perk.icon,
        tags: ["perk", perk.id],
      }

      // Add the effect to the game state
      updatedGameState = EffectsManager.addEffect(updatedGameState, perkEffect)
    }

    return updatedGameState
  }

  static equipArtifact(gameState: GameState, perkId: string): GameState {
    const perk = this.getPerk(perkId)
    if (!perk || !perk.isArtifact) return gameState

    const playerPerks = gameState.perks || this.DEFAULT_PLAYER_PERKS

    // Check if player has the artifact perk
    if (!playerPerks.unlockedPerks[perkId]) return gameState

    // Check if player has available artifact slots
    if (playerPerks.equippedArtifacts.length >= playerPerks.artifactSlots) return gameState

    // Check if artifact is already equipped
    if (playerPerks.equippedArtifacts.includes(perkId)) return gameState

    // Create updated perks object
    const updatedPerks: PlayerPerks = {
      ...playerPerks,
      equippedArtifacts: [...playerPerks.equippedArtifacts, perkId],
    }

    // Apply artifact effects to game state
    let updatedGameState = {
      ...gameState,
      perks: updatedPerks,
    }

    // Create an effect for this artifact
    if (perk.effects) {
      const artifactEffect = {
        name: perk.name,
        description: perk.description,
        source: "perk" as const,
        sourceId: perkId,
        duration: { type: "conditional" as const, condition: { flags: { artifactUnequipped: true } } },
        statModifiers: perk.effects.stats,
        skillModifiers: perk.effects.skills,
        flagModifiers: perk.effects.setFlags,
        icon: perk.icon,
        tags: ["artifact", perk.id],
      }

      // Add the effect to the game state
      updatedGameState = EffectsManager.addEffect(updatedGameState, artifactEffect)
    }

    return updatedGameState
  }

  static unequipArtifact(gameState: GameState, perkId: string): GameState {
    const playerPerks = gameState.perks || this.DEFAULT_PLAYER_PERKS

    // Check if artifact is equipped
    if (!playerPerks.equippedArtifacts.includes(perkId)) return gameState

    // Create updated perks object
    const updatedPerks: PlayerPerks = {
      ...playerPerks,
      equippedArtifacts: playerPerks.equippedArtifacts.filter((id) => id !== perkId),
    }

    // Remove artifact effects from game state
    let updatedGameState = {
      ...gameState,
      perks: updatedPerks,
      flags: {
        ...gameState.flags,
        artifactUnequipped: true, // This will trigger the removal of conditional effects
      },
    }

    // Find and remove any effects from this artifact
    if (gameState.effects) {
      const artifactEffects = gameState.effects.activeEffects.filter(
        (effect) => effect.source === "perk" && effect.sourceId === perkId,
      )

      artifactEffects.forEach((effect) => {
        updatedGameState = EffectsManager.removeEffect(updatedGameState, effect.id)
      })
    }

    // Remove the temporary flag
    updatedGameState = {
      ...updatedGameState,
      flags: {
        ...updatedGameState.flags,
        artifactUnequipped: undefined,
      },
    }

    return updatedGameState
  }

  static addPerkPoint(gameState: GameState, amount = 1): GameState {
    const playerPerks = gameState.perks || this.DEFAULT_PLAYER_PERKS

    return {
      ...gameState,
      perks: {
        ...playerPerks,
        perkPoints: playerPerks.perkPoints + amount,
      },
    }
  }

  static getPerkRankDescription(perk: Perk, rank: number): string {
    if (!perk.maxRank || perk.maxRank === 1) {
      return perk.description
    }

    // For multi-rank perks, you might want to customize the description based on rank
    return `${perk.description} (Rank ${rank}/${perk.maxRank})`
  }
}
