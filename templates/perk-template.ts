import type { Perk } from "@/types/perks"

export const templatePerk: Perk = {
  id: "template-perk",
  name: "Template Perk",
  description: "A template for creating new perks",
  category: "combat", // combat, survival, exploration, social, anomaly, mutation, technical
  rarity: "uncommon", // common, uncommon, rare, legendary
  icon: "star", // Icon identifier
  effects: {
    stats: {
      health: 10,
      energy: 5,
      maxHealth: 10,
      maxEnergy: 5,
      healthRegen: 1,
      energyRegen: 1,
      radiationResistance: 10,
      toxinResistance: 10,
      carryWeight: 10,
    },
    skills: {
      strength: 1,
      intelligence: 1,
      charisma: 1,
      perception: 1,
      agility: 1,
      luck: 1,
    },
    combat: {
      damageBonus: 10,
      criticalChance: 5,
      criticalDamage: 10,
      armorPenetration: 5,
      damageResistance: 10,
      staggerChance: 5,
    },
    abilities: {
      nightVision: true,
      anomalyDetection: true,
      extraInventorySlots: 5,
      autoHeal: true,
      extraDialogueOptions: true,
      itemDiscounts: 10,
      extraXP: 10,
      extraLoot: 10,
    },
    setFlags: {
      "perk-flag": true,
    },
  },
  drawbacks: {
    stats: {
      radiationResistance: -10,
    },
    skills: {
      charisma: -1,
    },
  },
  requirements: {
    level: 5,
    skills: {
      strength: 6,
      intelligence: 6,
    },
    perks: ["prerequisite-perk"],
    flags: {
      "story-milestone": true,
    },
    mutuallyExclusive: ["incompatible-perk"],
  },
  maxRank: 3,
  isArtifact: false,
}
