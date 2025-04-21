import type { SkillCheck } from "@/types/episode"

// Basic skill check
export const basicSkillCheck: SkillCheck = {
  skill: "perception", // The skill to check (strength, intelligence, charisma, perception, agility, luck)
  difficulty: 6, // Difficulty level from 1-10 (easy: 3-4, medium: 5-7, hard: 8-10)
}

// Skill check with bonus from item
export const itemBonusSkillCheck: SkillCheck = {
  skill: "perception",
  difficulty: 8,
  bonus: {
    itemId: "binoculars", // Item that provides a bonus
    value: 2, // Bonus value
  },
}

// Skill check with bonus from flag
export const flagBonusSkillCheck: SkillCheck = {
  skill: "agility",
  difficulty: 7,
  bonus: {
    flagName: "practiced-lockpicking", // Flag that provides a bonus
    value: 2, // Bonus value
  },
}

// Example usage in an episode option:
/*
{
  id: "pick-lock",
  text: "Try to pick the lock",
  skillCheck: basicSkillCheck,
  successText: "You successfully pick the lock.",
  failureText: "You fail to pick the lock.",
  nextEpisode: "room-unlocked",
  failureEpisode: "still-locked",
}
*/
