import type { Condition } from "@/types/episode"

// Basic flag condition
export const flagCondition: Condition = {
  flags: {
    "has-key": true, // Player must have this flag set to true
    "door-locked": false, // Player must have this flag set to false
    reputation: 5, // Player must have this flag set to exactly 5
  },
}

// Stat condition
export const statCondition: Condition = {
  stats: {
    health: { min: 50 }, // Player must have at least 50 health
    energy: { max: 80 }, // Player must have at most 80 energy
    radiation: 0, // Player must have exactly 0 radiation
  },
}

// Skill condition
export const skillCondition: Condition = {
  skills: {
    strength: 7, // Player must have at least 7 strength
    intelligence: { min: 6, max: 9 }, // Player must have between 6-9 intelligence
  },
}

// Inventory condition
export const inventoryCondition: Condition = {
  hasItems: ["key", "flashlight", "medkit"], // Player must have all these items
}

// Perk condition
export const perkCondition: Condition = {
  perks: {
    "night-person": true, // Player must have the night-person perk
    cannibal: false, // Player must NOT have the cannibal perk
  },
}

// Combined condition
export const combinedCondition: Condition = {
  flags: { "has-map": true },
  stats: { health: { min: 30 } },
  skills: { perception: 5 },
  hasItems: ["compass"],
  perks: { explorer: true },
}

// Example usage in an episode option:
/*
{
  id: "unlock-door",
  text: "Unlock the door with your key",
  condition: inventoryCondition,
  nextEpisode: "room-unlocked"
}
*/
