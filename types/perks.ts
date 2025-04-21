import type { Skills } from "./game"

export type PerkCategory = "combat" | "survival" | "exploration" | "social" | "anomaly" | "mutation" | "technical"

export type PerkRarity = "common" | "uncommon" | "rare" | "legendary"

export type PerkEffect = {
  // Stat modifiers
  stats?: {
    health?: number
    energy?: number
    maxHealth?: number
    maxEnergy?: number
    healthRegen?: number
    energyRegen?: number
    radiationResistance?: number
    toxinResistance?: number
    carryWeight?: number
  }
  // Skill modifiers (permanent)
  skills?: Partial<Skills>
  // Skill check bonuses (situational)
  skillChecks?: {
    [K in keyof Skills]?: number
  }
  // Combat modifiers
  combat?: {
    damageBonus?: number
    criticalChance?: number
    criticalDamage?: number
    armorPenetration?: number
    damageResistance?: number
    staggerChance?: number
  }
  // Special abilities
  abilities?: {
    nightVision?: boolean
    anomalyDetection?: boolean
    extraInventorySlots?: number
    autoHeal?: boolean
    extraDialogueOptions?: boolean
    itemDiscounts?: number // percentage
    extraXP?: number // percentage
    extraLoot?: number // percentage
  }
  // Flags to set
  setFlags?: Record<string, boolean | string | number>
}

export type PerkRequirement = {
  level?: number
  skills?: Partial<Skills>
  perks?: string[]
  flags?: Record<string, boolean | string | number>
  mutuallyExclusive?: string[] // Perks that cannot be taken with this one
}

export type PerkDrawback = {
  stats?: {
    health?: number
    energy?: number
    maxHealth?: number
    maxEnergy?: number
    healthRegen?: number
    energyRegen?: number
    radiationResistance?: number
    toxinResistance?: number
    carryWeight?: number
  }
  skills?: Partial<Skills>
  combat?: {
    damageBonus?: number
    criticalChance?: number
    criticalDamage?: number
    armorPenetration?: number
    damageResistance?: number
    staggerChance?: number
  }
}

export interface Perk {
  id: string
  name: string
  description: string
  category: PerkCategory
  rarity: PerkRarity
  icon: string // Icon identifier
  effects: PerkEffect
  drawbacks?: PerkDrawback
  requirements?: PerkRequirement
  maxRank?: number // For perks with multiple ranks
  isArtifact?: boolean // Special perks found in anomalies (STALKER-inspired)
}

export interface PlayerPerks {
  unlockedPerks: {
    [perkId: string]: number // Perk ID -> rank
  }
  perkPoints: number
  artifactSlots: number
  equippedArtifacts: string[] // IDs of equipped artifact perks
}
