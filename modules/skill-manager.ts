import type { GameState, Skills, SkillCheckResult } from "@/types/game"
import type { SkillCheck } from "@/types/episode"

export class SkillManager {
  static readonly DEFAULT_SKILLS: Skills = {
    strength: 5,
    intelligence: 5,
    charisma: 5,
    perception: 5,
    agility: 5,
    luck: 5,
  }

  static modifySkill(gameState: GameState, skillName: keyof Skills, amount: number): GameState {
    if (gameState.skills[skillName] === undefined) {
      return gameState
    }

    // Create a new skills object with the updated value
    const updatedSkills = {
      ...gameState.skills,
      [skillName]: Math.max(1, Math.min(10, gameState.skills[skillName] + amount)), // Clamp between 1-10
    }

    return {
      ...gameState,
      skills: updatedSkills,
    }
  }

  static setSkill(gameState: GameState, skillName: keyof Skills, value: number): GameState {
    // Create a new skills object with the set value
    const updatedSkills = {
      ...gameState.skills,
      [skillName]: Math.max(1, Math.min(10, value)), // Clamp between 1-10
    }

    return {
      ...gameState,
      skills: updatedSkills,
    }
  }

  static performSkillCheck(gameState: GameState, skillCheck: SkillCheck): SkillCheckResult {
    const { skill, difficulty, bonus } = skillCheck

    // Get the player's skill value
    const playerSkillValue = gameState.skills[skill] || 1

    // Calculate any bonuses
    let bonusValue = 0

    if (bonus) {
      // Item-based bonus
      if (bonus.itemId && gameState.inventory.some((item) => item.id === bonus.itemId)) {
        bonusValue += bonus.value
      }

      // Flag-based bonus
      if (bonus.flagName && gameState.flags[bonus.flagName]) {
        bonusValue += bonus.value
      }
    }

    // Add a smaller randomness factor (1-5 roll instead of 1-10)
    // This makes skill values more important than luck
    const roll = Math.floor(Math.random() * 5) + 1

    // Add luck bonus (0-2 based on luck stat)
    const luckBonus = Math.floor((gameState.skills.luck || 5) / 5)

    // Calculate total score
    const totalScore = playerSkillValue + bonusValue + roll + luckBonus

    // Check if the skill check was successful
    const success = totalScore >= difficulty

    return {
      success,
      skillName: skill,
      playerValue: playerSkillValue,
      difficulty,
      bonusApplied: bonusValue > 0 ? bonusValue : undefined,
      roll: roll,
      luckBonus: luckBonus,
    }
  }

  static getSkillLevel(value: number): string {
    if (value <= 2) return "Novice"
    if (value <= 4) return "Apprentice"
    if (value <= 6) return "Adept"
    if (value <= 8) return "Expert"
    return "Master"
  }

  static getSkillColor(value: number): string {
    if (value <= 2) return "text-white/70"
    if (value <= 4) return "text-white"
    if (value <= 6) return "text-gold/70"
    if (value <= 8) return "text-gold"
    return "text-gold-light"
  }

  static canPassSkillCheck(skillValue: number, difficulty: number): boolean {
    // Maximum possible bonus: 5 (roll) + 2 (luck)
    const maxBonus = 7
    return skillValue + maxBonus >= difficulty
  }

  static getSkillCheckProbability(skillValue: number, difficulty: number): number {
    // Calculate actual probability based on dice roll and luck bonus
    if (skillValue + 1 >= difficulty) return 100 // Even minimum roll will succeed

    const gap = difficulty - skillValue

    if (gap > 7) return 0 // Impossible (beyond max roll + max luck bonus)

    // Calculate probability based on possible dice rolls and luck bonus
    let successCases = 0
    const totalCases = 5 * 3 // 5 possible dice rolls (1-5) * 3 possible luck bonuses (0-2)

    for (let roll = 1; roll <= 5; roll++) {
      for (let luck = 0; luck <= 2; luck++) {
        if (skillValue + roll + luck >= difficulty) {
          successCases++
        }
      }
    }

    return Math.round((successCases / totalCases) * 100)
  }
}
