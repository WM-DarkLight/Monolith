"use client"

import { useState, useEffect, useRef } from "react"
import type { GameState } from "@/types/game"
import { loadEpisode } from "@/core/episode-loader"
import { GameUI } from "@/ui/game-ui"
import { useGameState } from "@/core/use-game-state"
import type { Episode } from "@/types/episode"
import { loadSavedGame, saveGame, autoSaveGame, importSaveData, hasUnsavedChanges } from "@/lib/save-manager"
import { CharacterCreation } from "@/ui/character-creation"
import { SkillManager } from "@/modules/skill-manager"
import { PerkManager } from "@/modules/perk-manager"

interface GameEngineProps {
  onExit: () => void
  initialSaveId?: string
  initialEpisodeId?: string
}

export function GameEngine({ onExit, initialSaveId, initialEpisodeId = "intro" }: GameEngineProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const { gameState, updateGameState, resetGameState, unlockPerk, equipArtifact, unequipArtifact, addPerkPoint } =
    useGameState()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [currentSaveData, setCurrentSaveData] = useState<any>(null)
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<number>(0)
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const AUTO_SAVE_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds
  const [shouldPulseSaveIcon, setShouldPulseSaveIcon] = useState(false)
  const [lastSavedState, setLastSavedState] = useState<GameState | undefined>(undefined)
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false)
  const [showCharacterCreation, setShowCharacterCreation] = useState(false)

  // Set up auto-save
  useEffect(() => {
    // Start auto-save interval
    autoSaveIntervalRef.current = setInterval(() => {
      if (gameState.currentEpisodeId && Date.now() - lastAutoSaveTime > AUTO_SAVE_INTERVAL) {
        handleAutoSave()
      }
    }, 60000) // Check every minute

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }
    }
  }, [gameState, lastAutoSaveTime])

  useEffect(() => {
    // Initialize the game with the first episode or saved game
    const initGame = async () => {
      setIsLoading(true)
      try {
        if (initialSaveId) {
          // Load from saved game
          const savedGame = await loadSavedGame(initialSaveId)
          if (savedGame) {
            updateGameState(savedGame.gameState)
            const episode = await loadEpisode(savedGame.gameState.currentEpisodeId)
            setCurrentEpisode(episode)
            setCurrentSaveData(savedGame)
            setLastSavedState(savedGame.gameState)
          } else {
            // Fallback to new game if save not found
            await loadNewEpisode(initialEpisodeId)
          }
        } else {
          // Start new game with specified episode
          await loadNewEpisode(initialEpisodeId)
        }
      } catch (error) {
        console.error("Failed to load initial episode:", error)
        setSaveError("Failed to load game data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    initGame()
  }, [initialSaveId, initialEpisodeId, updateGameState, resetGameState])

  const loadNewEpisode = async (episodeId: string) => {
    try {
      const episode = await loadEpisode(episodeId)
      setCurrentEpisode(episode)

      // Check if this episode allows custom skills
      if (episode.allowCustomSkills) {
        setShowCharacterCreation(true)
      } else {
        // Use default skills
        resetGameState()
        updateGameState({
          currentEpisodeId: episodeId,
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
          perks: PerkManager.DEFAULT_PLAYER_PERKS,
          flags: {},
          history: [],
          level: 1,
        })

        // If this is the perk showcase episode, give the player some perk points
        if (episodeId === "perk-showcase") {
          addPerkPoint(10) // Give 10 perk points for the showcase
        }
      }
    } catch (error) {
      console.error(`Failed to load episode: ${episodeId}`, error)
      // If there's an error, fall back to the intro episode
      if (episodeId !== "intro") {
        await loadNewEpisode("intro")
      } else {
        throw error // Re-throw if we're already trying to load the intro
      }
    }
  }

  // Handle character creation completion
  const handleCharacterCreationComplete = (skills: typeof SkillManager.DEFAULT_SKILLS) => {
    if (!currentEpisode) return

    resetGameState()
    updateGameState({
      currentEpisodeId: currentEpisode.id,
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
      skills,
      perks: {
        ...PerkManager.DEFAULT_PLAYER_PERKS,
        perkPoints: 5, // Start with 5 perk points instead of 3
      },
      flags: {},
      history: [],
      level: 1,
    })

    setShowCharacterCreation(false)
  }

  // Check for unsaved changes
  useEffect(() => {
    if (lastSavedState) {
      const unsaved = hasUnsavedChanges(gameState, lastSavedState)
      setHasUnsavedProgress(unsaved)
      if (unsaved) {
        setShouldPulseSaveIcon(true)
      }
    }
  }, [gameState, lastSavedState])

  // Update the handleOptionSelect function to handle failure episodes
  const handleOptionSelect = async (optionId: string, skillCheckSuccess?: boolean) => {
    if (!currentEpisode) return

    const selectedOption = currentEpisode.options.find((opt) => opt.id === optionId)
    if (!selectedOption) return

    // If this was a skill check option and it failed, handle differently
    const hasSkillCheck = !!selectedOption.skillCheck
    const skillCheckFailed = hasSkillCheck && skillCheckSuccess === false

    // Record the choice in history with appropriate text based on skill check result
    let choiceText = selectedOption.text
    if (hasSkillCheck) {
      choiceText = skillCheckSuccess
        ? selectedOption.successText || selectedOption.text
        : selectedOption.failureText || `Failed: ${selectedOption.text}`
    }

    const updatedHistory = [
      ...gameState.history,
      {
        episodeId: gameState.currentEpisodeId,
        text: currentEpisode.text,
        choiceText,
        timestamp: new Date().toISOString(),
      },
    ]

    // Apply any state changes from the option
    const updatedState: GameState = {
      ...gameState,
      history: updatedHistory,
    }

    // Apply flag changes based on success/failure
    if (!skillCheckFailed && selectedOption.setFlags) {
      Object.entries(selectedOption.setFlags).forEach(([key, value]) => {
        updatedState.flags[key] = value
      })
    } else if (skillCheckFailed && selectedOption.failureFlags) {
      // Apply failure-specific flags if provided
      Object.entries(selectedOption.failureFlags).forEach(([key, value]) => {
        updatedState.flags[key] = value
      })
    }

    // Apply stat changes based on success/failure
    if (!skillCheckFailed && selectedOption.modifyStats) {
      Object.entries(selectedOption.modifyStats).forEach(([key, value]) => {
        if (updatedState.stats[key] !== undefined) {
          updatedState.stats[key] = (updatedState.stats[key] || 0) + value
        }
      })
    } else if (skillCheckFailed && selectedOption.failureStats) {
      // Apply failure-specific stat changes if provided
      Object.entries(selectedOption.failureStats).forEach(([key, value]) => {
        if (updatedState.stats[key] !== undefined) {
          updatedState.stats[key] = (updatedState.stats[key] || 0) + value
        }
      })
    }

    // Apply skill changes if not a failed skill check
    if (!skillCheckFailed && selectedOption.modifySkills) {
      let skillsImproved = false
      Object.entries(selectedOption.modifySkills).forEach(([key, value]) => {
        if (updatedState.skills[key] !== undefined && value > 0) {
          updatedState.skills[key] += value
          // Clamp between 1-10
          updatedState.skills[key] = Math.max(1, Math.min(10, updatedState.skills[key]))
          skillsImproved = true
        }
      })

      // Add a flag to indicate skill improvement for UI feedback
      if (skillsImproved) {
        updatedState.flags["skill_improved_recently"] = true

        // Clear this flag after 5 seconds
        setTimeout(() => {
          updateGameState({
            ...gameState,
            flags: {
              ...gameState.flags,
              skill_improved_recently: false,
            },
          })
        }, 5000)
      }
    }

    // Apply inventory changes if not a failed skill check
    if (!skillCheckFailed) {
      if (selectedOption.addItems) {
        updatedState.inventory = [...updatedState.inventory, ...selectedOption.addItems]
      }

      if (selectedOption.removeItems) {
        updatedState.inventory = updatedState.inventory.filter((item) => !selectedOption.removeItems?.includes(item.id))
      }
    }

    // Add perk point on significant progress (e.g., completing a major challenge)
    if (!skillCheckFailed && selectedOption.nextEpisode && Math.random() < 0.3) {
      // 30% chance to get a perk point when progressing to a new episode
      const updatedPerks = {
        ...updatedState.perks,
        perkPoints: (updatedState.perks?.perkPoints || 0) + 1,
      }
      updatedState.perks = updatedPerks

      // Add a notification flag
      updatedState.flags["perk_point_earned"] = true

      // Clear this flag after 5 seconds
      setTimeout(() => {
        updateGameState({
          ...gameState,
          flags: {
            ...gameState.flags,
            perk_point_earned: false,
          },
        })
      }, 5000)
    }

    updateGameState(updatedState)

    // Add this to the handleOptionSelect function, after updating the game state
    // This will make the save icon pulse when the player makes significant choices
    if (
      selectedOption.nextEpisode ||
      selectedOption.failureEpisode ||
      (selectedOption.modifyStats &&
        (Math.abs(selectedOption.modifyStats.health || 0) > 20 ||
          Math.abs(selectedOption.modifyStats.energy || 0) > 20)) ||
      selectedOption.addItems?.length > 0
    ) {
      setShouldPulseSaveIcon(true)
      // Reset the pulse after 10 seconds
      setTimeout(() => setShouldPulseSaveIcon(false), 10000)
    }

    // Determine which episode to load next
    let nextEpisodeId = null
    if (!skillCheckFailed && selectedOption.nextEpisode) {
      nextEpisodeId = selectedOption.nextEpisode
    } else if (skillCheckFailed && selectedOption.failureEpisode) {
      nextEpisodeId = selectedOption.failureEpisode
    }

    // Load the next episode if specified
    if (nextEpisodeId) {
      setIsLoading(true)
      try {
        const nextEpisode = await loadEpisode(nextEpisodeId)
        setCurrentEpisode(nextEpisode)
        const finalState = {
          ...updatedState,
          currentEpisodeId: nextEpisodeId,
        }
        updateGameState(finalState)

        // Auto-save when changing episodes
        handleAutoSave(finalState)
      } catch (error) {
        console.error(`Failed to load episode: ${nextEpisodeId}`, error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleExitWithConfirmation = () => {
    if (hasUnsavedProgress) {
      if (confirm("You have unsaved progress. Are you sure you want to return to the dashboard?")) {
        onExit()
      }
    } else {
      onExit()
    }
  }

  const handleSaveGame = async (saveName: string, slotId?: string) => {
    try {
      if (!currentEpisode) return

      const saveId = await saveGame({
        name: saveName,
        slotId,
        episodeId: gameState.currentEpisodeId,
        episodeTitle: currentEpisode.title,
        gameState,
        stats: gameState.stats,
      })

      // Update current save data reference
      const newSaveData = {
        id: saveId,
        name: saveName,
        slotId,
        episodeId: gameState.currentEpisodeId,
        episodeTitle: currentEpisode.title,
        timestamp: new Date().toISOString(),
        gameState,
        stats: gameState.stats,
        version: "1.0.0",
        thumbnail: "",
        compressed: false,
      }

      setCurrentSaveData(newSaveData)
      setSaveError(null)

      // Store the current state as the last saved state
      setLastSavedState({ ...gameState })
      setHasUnsavedProgress(false)

      // Turn off the save icon pulse
      setShouldPulseSaveIcon(false)

      return saveId
    } catch (error) {
      console.error("Failed to save game:", error)
      setSaveError("Failed to save game. Please try again.")
      throw error
    }
  }

  const handleAutoSave = async (stateToSave = gameState) => {
    try {
      if (!currentEpisode) return

      await autoSaveGame({
        name: "Auto Save",
        episodeId: stateToSave.currentEpisodeId,
        episodeTitle: currentEpisode.title,
        gameState: stateToSave,
        stats: stateToSave.stats,
      })

      setLastAutoSaveTime(Date.now())
    } catch (error) {
      console.error("Auto-save failed:", error)
      // Don't show error to user for auto-saves
    }
  }

  const handleImportSave = async (file: File) => {
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const jsonData = e.target?.result as string
          const saveId = await importSaveData(jsonData)

          // Load the imported save
          const savedGame = await loadSavedGame(saveId)
          if (savedGame) {
            updateGameState(savedGame.gameState)
            const episode = await loadEpisode(savedGame.gameState.currentEpisodeId)
            setCurrentEpisode(episode)
            setCurrentSaveData(savedGame)
            setLastSavedState(savedGame.gameState)
            setHasUnsavedProgress(false)
          }
        } catch (error) {
          console.error("Import failed:", error)
          setSaveError("Failed to import save. The file may be corrupted or incompatible.")
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error("File reading failed:", error)
      setSaveError("Failed to read the save file.")
    }
  }

  if (isLoading) {
    return (
      <div className="dashboard-background flex justify-center items-center h-screen">
        <div className="text-gold text-xl animate-pulse">Loading the adventure...</div>
      </div>
    )
  }

  if (showCharacterCreation && currentEpisode) {
    return (
      <CharacterCreation
        episode={currentEpisode}
        onComplete={handleCharacterCreationComplete}
        onCancel={() => onExit()}
      />
    )
  }

  return (
    <div className="relative">
      <GameUI
        episode={currentEpisode}
        gameState={gameState}
        onOptionSelect={handleOptionSelect}
        onSaveGame={handleSaveGame}
        onImportSave={handleImportSave}
        onUnlockPerk={unlockPerk}
        onEquipArtifact={equipArtifact}
        onUnequipArtifact={unequipArtifact}
        currentSaveData={currentSaveData}
        saveError={saveError}
        shouldPulseSaveIcon={shouldPulseSaveIcon}
        onExit={handleExitWithConfirmation}
      />
    </div>
  )
}
