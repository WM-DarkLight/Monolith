"use client"

import { useState, useCallback } from "react"
import type { GameState } from "@/types/game"
import { SkillManager } from "@/modules/skill-manager"
import { PerkManager } from "@/modules/perk-manager"

const initialState: GameState = {
  currentEpisodeId: "",
  inventory: [],
  stats: {
    health: 100,
    energy: 100,
    maxHealth: 100,
    maxEnergy: 100,
    healthRegen: 1,
    energyRegen: 1,
    radiationResistance: 0,
    toxinResistance: 0,
    carryWeight: 100,
  },
  skills: SkillManager.DEFAULT_SKILLS,
  flags: {},
  history: [],
  perks: PerkManager.DEFAULT_PLAYER_PERKS,
  level: 1,
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialState)

  const updateGameState = useCallback((newState: Partial<GameState>) => {
    setGameState((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }, [])

  const resetGameState = useCallback(() => {
    setGameState(initialState)
  }, [])

  const unlockPerk = useCallback((perkId: string) => {
    setGameState((prevState) => PerkManager.unlockPerk(prevState, perkId))
  }, [])

  const equipArtifact = useCallback((perkId: string) => {
    setGameState((prevState) => PerkManager.equipArtifact(prevState, perkId))
  }, [])

  const unequipArtifact = useCallback((perkId: string) => {
    setGameState((prevState) => PerkManager.unequipArtifact(prevState, perkId))
  }, [])

  const addPerkPoint = useCallback((amount = 1) => {
    setGameState((prevState) => PerkManager.addPerkPoint(prevState, amount))
  }, [])

  return {
    gameState,
    updateGameState,
    resetGameState,
    unlockPerk,
    equipArtifact,
    unequipArtifact,
    addPerkPoint,
  }
}
