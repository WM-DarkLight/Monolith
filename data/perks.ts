import type { Perk } from "@/types/perks"

export const perks: Perk[] = [
  // COMBAT PERKS
  {
    id: "iron-fist",
    name: "Iron Fist",
    description: "Your unarmed attacks do 20% more damage.",
    category: "combat",
    rarity: "common",
    icon: "fist",
    effects: {
      combat: {
        damageBonus: 20,
      },
    },
    maxRank: 3,
  },
  {
    id: "gunslinger",
    name: "Gunslinger",
    description: "Your accuracy with pistols increases by 15%.",
    category: "combat",
    rarity: "common",
    icon: "pistol",
    effects: {
      skillChecks: {
        perception: 2,
      },
      combat: {
        criticalChance: 5,
      },
    },
    requirements: {
      skills: {
        perception: 6,
      },
    },
    maxRank: 3,
  },
  {
    id: "commando",
    name: "Commando",
    description: "Your automatic weapons do 10% more damage.",
    category: "combat",
    rarity: "uncommon",
    icon: "rifle",
    effects: {
      combat: {
        damageBonus: 10,
        armorPenetration: 5,
      },
    },
    requirements: {
      skills: {
        strength: 6,
      },
    },
    maxRank: 3,
  },
  {
    id: "sniper",
    name: "Sniper",
    description: "Your accuracy at long range increases significantly.",
    category: "combat",
    rarity: "uncommon",
    icon: "scope",
    effects: {
      skillChecks: {
        perception: 3,
      },
      combat: {
        criticalChance: 10,
      },
    },
    requirements: {
      skills: {
        perception: 7,
      },
    },
    maxRank: 2,
  },
  {
    id: "toughness",
    name: "Toughness",
    description: "You gain +10% damage resistance.",
    category: "combat",
    rarity: "common",
    icon: "shield",
    effects: {
      combat: {
        damageResistance: 10,
      },
      stats: {
        maxHealth: 10,
      },
    },
    maxRank: 3,
  },
  {
    id: "quick-hands",
    name: "Quick Hands",
    description: "You reload weapons 20% faster and gain +1 to Agility skill checks.",
    category: "combat",
    rarity: "uncommon",
    icon: "hand",
    effects: {
      skillChecks: {
        agility: 1,
      },
    },
    requirements: {
      skills: {
        agility: 6,
      },
    },
    maxRank: 2,
  },
  {
    id: "bloody-mess",
    name: "Bloody Mess",
    description: "For some reason, enemies die in more spectacular ways. You gain +5% damage with all weapons.",
    category: "combat",
    rarity: "uncommon",
    icon: "blood",
    effects: {
      combat: {
        damageBonus: 5,
        criticalDamage: 10,
      },
    },
    maxRank: 1,
  },
  {
    id: "ninja",
    name: "Ninja",
    description: "Your sneak attacks do 15% more damage.",
    category: "combat",
    rarity: "rare",
    icon: "dagger",
    effects: {
      skillChecks: {
        agility: 2,
      },
      combat: {
        criticalChance: 10,
        criticalDamage: 15,
      },
    },
    requirements: {
      skills: {
        agility: 7,
      },
    },
    maxRank: 3,
  },
  {
    id: "demolition-expert",
    name: "Demolition Expert",
    description: "You do 25% more damage with explosives.",
    category: "combat",
    rarity: "uncommon",
    icon: "explosion",
    effects: {
      combat: {
        damageBonus: 25,
      },
    },
    requirements: {
      skills: {
        intelligence: 6,
      },
    },
    maxRank: 2,
  },
  {
    id: "berserker",
    name: "Berserker",
    description: "The lower your health, the higher your damage output (up to +30%).",
    category: "combat",
    rarity: "rare",
    icon: "rage",
    effects: {
      combat: {
        damageBonus: 30,
        damageResistance: -10,
      },
    },
    requirements: {
      skills: {
        strength: 7,
      },
    },
    maxRank: 1,
  },

  // SURVIVAL PERKS
  {
    id: "lead-belly",
    name: "Lead Belly",
    description: "You take 50% less radiation from consuming food and water.",
    category: "survival",
    rarity: "common",
    icon: "stomach",
    effects: {
      stats: {
        radiationResistance: 50,
      },
    },
    maxRank: 2,
  },
  {
    id: "rad-resistant",
    name: "Rad Resistant",
    description: "You gain +25% radiation resistance.",
    category: "survival",
    rarity: "common",
    icon: "radiation",
    effects: {
      stats: {
        radiationResistance: 25,
      },
    },
    maxRank: 3,
  },
  {
    id: "chemist",
    name: "Chemist",
    description: "Chems last 50% longer when you use them.",
    category: "survival",
    rarity: "uncommon",
    icon: "syringe",
    effects: {
      setFlags: {
        "chem-duration-bonus": 50,
      },
    },
    requirements: {
      skills: {
        intelligence: 6,
      },
    },
    maxRank: 2,
  },
  {
    id: "cannibal",
    name: "Cannibal",
    description: "You can feed on humanoid corpses to regain Health.",
    category: "survival",
    rarity: "rare",
    icon: "teeth",
    effects: {
      setFlags: {
        cannibal: true,
      },
    },
    maxRank: 1,
  },
  {
    id: "aquaboy",
    name: "Aquaboy",
    description: "You no longer take radiation damage from swimming and can breathe underwater.",
    category: "survival",
    rarity: "uncommon",
    icon: "water",
    effects: {
      setFlags: {
        "water-breathing": true,
        "water-radiation-immune": true,
      },
    },
    maxRank: 1,
  },
  {
    id: "night-person",
    name: "Night Person",
    description: "You gain +2 to Intelligence and Perception between 6:00 PM and 6:00 AM.",
    category: "survival",
    rarity: "uncommon",
    icon: "moon",
    effects: {
      skills: {
        intelligence: 2,
        perception: 2,
      },
      setFlags: {
        "night-person": true,
      },
    },
    maxRank: 1,
  },
  {
    id: "solar-powered",
    name: "Solar Powered",
    description: "You gain +2 to Strength and Energy regeneration while in direct sunlight.",
    category: "survival",
    rarity: "uncommon",
    icon: "sun",
    effects: {
      skills: {
        strength: 2,
      },
      stats: {
        energyRegen: 5,
      },
      setFlags: {
        "solar-powered": true,
      },
    },
    maxRank: 1,
    requirements: {
      mutuallyExclusive: ["night-person"],
    },
  },
  {
    id: "life-giver",
    name: "Life Giver",
    description: "You gain +20 maximum Health.",
    category: "survival",
    rarity: "common",
    icon: "heart",
    effects: {
      stats: {
        maxHealth: 20,
        healthRegen: 1,
      },
    },
    maxRank: 3,
  },
  {
    id: "chem-resistant",
    name: "Chem Resistant",
    description: "You're 50% less likely to get addicted when consuming chems.",
    category: "survival",
    rarity: "uncommon",
    icon: "pill",
    effects: {
      setFlags: {
        "chem-addiction-resist": 50,
      },
    },
    maxRank: 2,
  },
  {
    id: "survivalist",
    name: "Survivalist",
    description: "You find 25% more ammunition in containers.",
    category: "survival",
    rarity: "common",
    icon: "backpack",
    effects: {
      setFlags: {
        "ammo-find-bonus": 25,
      },
    },
    maxRank: 3,
  },

  // EXPLORATION PERKS
  {
    id: "explorer",
    name: "Explorer",
    description: "All locations on the map are revealed.",
    category: "exploration",
    rarity: "rare",
    icon: "map",
    effects: {
      setFlags: {
        "all-locations-revealed": true,
      },
    },
    requirements: {
      level: 8,
    },
    maxRank: 1,
  },
  {
    id: "fortune-finder",
    name: "Fortune Finder",
    description: "You find 10% more bottle caps in containers.",
    category: "exploration",
    rarity: "common",
    icon: "coin",
    effects: {
      setFlags: {
        "caps-find-bonus": 10,
      },
    },
    maxRank: 3,
  },
  {
    id: "scrounger",
    name: "Scrounger",
    description: "You find 10% more ammunition in containers.",
    category: "exploration",
    rarity: "common",
    icon: "bullet",
    effects: {
      setFlags: {
        "ammo-find-bonus": 10,
      },
    },
    maxRank: 3,
  },
  {
    id: "strong-back",
    name: "Strong Back",
    description: "You can carry +25 more weight.",
    category: "exploration",
    rarity: "common",
    icon: "weight",
    effects: {
      stats: {
        carryWeight: 25,
      },
    },
    requirements: {
      skills: {
        strength: 5,
      },
    },
    maxRank: 4,
  },
  {
    id: "ranger",
    name: "Ranger",
    description: "You travel 25% faster when moving across the wasteland.",
    category: "exploration",
    rarity: "uncommon",
    icon: "boot",
    effects: {
      setFlags: {
        "travel-speed-bonus": 25,
      },
    },
    maxRank: 2,
  },
  {
    id: "pathfinder",
    name: "Pathfinder",
    description: "You can detect hidden paths and shortcuts.",
    category: "exploration",
    rarity: "uncommon",
    icon: "path",
    effects: {
      setFlags: {
        "detect-shortcuts": true,
      },
      skillChecks: {
        perception: 2,
      },
    },
    requirements: {
      skills: {
        perception: 6,
      },
    },
    maxRank: 1,
  },
  {
    id: "light-step",
    name: "Light Step",
    description: "You never set off traps.",
    category: "exploration",
    rarity: "rare",
    icon: "feather",
    effects: {
      setFlags: {
        "trap-immune": true,
      },
    },
    requirements: {
      skills: {
        agility: 8,
      },
    },
    maxRank: 1,
  },
  {
    id: "treasure-hunter",
    name: "Treasure Hunter",
    description: "You can find rare loot in unexpected places.",
    category: "exploration",
    rarity: "rare",
    icon: "chest",
    effects: {
      setFlags: {
        "rare-loot-chance": 15,
      },
    },
    requirements: {
      skills: {
        luck: 7,
      },
    },
    maxRank: 2,
  },
  {
    id: "scavenger",
    name: "Scavenger",
    description: "You can salvage more components from junk items.",
    category: "exploration",
    rarity: "common",
    icon: "recycle",
    effects: {
      setFlags: {
        "salvage-bonus": 25,
      },
    },
    maxRank: 3,
  },
  {
    id: "wasteland-whisperer",
    name: "Wasteland Whisperer",
    description: "You can pacify wasteland creatures, preventing them from attacking.",
    category: "exploration",
    rarity: "legendary",
    icon: "whisper",
    effects: {
      setFlags: {
        "pacify-creatures": true,
      },
    },
    requirements: {
      skills: {
        charisma: 8,
      },
    },
    maxRank: 1,
  },

  // SOCIAL PERKS
  {
    id: "black-widow",
    name: "Black Widow",
    description: "You do +15% damage against opposite-sex opponents and have unique dialogue options.",
    category: "social",
    rarity: "uncommon",
    icon: "spider",
    effects: {
      combat: {
        damageBonus: 15,
      },
      setFlags: {
        "black-widow-dialogue": true,
      },
    },
    maxRank: 1,
  },
  {
    id: "lady-killer",
    name: "Lady Killer",
    description: "You do +15% damage against opposite-sex opponents and have unique dialogue options.",
    category: "social",
    rarity: "uncommon",
    icon: "heart-break",
    effects: {
      combat: {
        damageBonus: 15,
      },
      setFlags: {
        "lady-killer-dialogue": true,
      },
    },
    maxRank: 1,
    requirements: {
      mutuallyExclusive: ["black-widow"],
    },
  },
  {
    id: "cap-collector",
    name: "Cap Collector",
    description: "Vendors offer you better prices for buying and selling.",
    category: "social",
    rarity: "common",
    icon: "bottle-cap",
    effects: {
      abilities: {
        itemDiscounts: 10,
      },
    },
    maxRank: 3,
  },
  {
    id: "inspirational",
    name: "Inspirational",
    description: "Your companions do 10% more damage in combat.",
    category: "social",
    rarity: "uncommon",
    icon: "star",
    effects: {
      setFlags: {
        "companion-damage-bonus": 10,
      },
    },
    maxRank: 3,
  },
  {
    id: "intimidation",
    name: "Intimidation",
    description: "You can pacify human opponents, preventing them from attacking.",
    category: "social",
    rarity: "rare",
    icon: "threat",
    effects: {
      setFlags: {
        "pacify-humans": true,
      },
      skillChecks: {
        charisma: 3,
      },
    },
    requirements: {
      skills: {
        charisma: 8,
      },
    },
    maxRank: 1,
  },
  {
    id: "local-leader",
    name: "Local Leader",
    description: "You can establish supply lines between settlements.",
    category: "social",
    rarity: "uncommon",
    icon: "network",
    effects: {
      setFlags: {
        "settlement-network": true,
      },
    },
    requirements: {
      skills: {
        charisma: 6,
      },
    },
    maxRank: 2,
  },
  {
    id: "mysterious-stranger",
    name: "Mysterious Stranger",
    description: "A mysterious stranger appears occasionally to help you in combat.",
    category: "social",
    rarity: "legendary",
    icon: "question",
    effects: {
      setFlags: {
        "mysterious-stranger": true,
      },
    },
    requirements: {
      skills: {
        luck: 8,
      },
    },
    maxRank: 1,
  },

  // ANOMALY PERKS (STALKER-inspired)
  {
    id: "crystal-heart",
    name: "Crystal Heart",
    description: "An anomalous artifact that enhances your vitality but makes you more vulnerable to radiation.",
    category: "anomaly",
    rarity: "rare",
    icon: "crystal",
    effects: {
      stats: {
        maxHealth: 30,
        healthRegen: 2,
      },
    },
    drawbacks: {
      stats: {
        radiationResistance: -20,
      },
    },
    isArtifact: true,
  },
  {
    id: "flash",
    name: "Flash",
    description: "An electrical artifact that enhances your energy but makes you more visible to enemies.",
    category: "anomaly",
    rarity: "rare",
    icon: "lightning",
    effects: {
      stats: {
        maxEnergy: 25,
        energyRegen: 3,
      },
      skills: {
        agility: 1,
      },
    },
    drawbacks: {
      skills: {
        perception: -1,
      },
    },
    isArtifact: true,
  },
  {
    id: "bubble",
    name: "Bubble",
    description: "A gravitational artifact that reduces fall damage but slows your movement.",
    category: "anomaly",
    rarity: "uncommon",
    icon: "bubble",
    effects: {
      setFlags: {
        "fall-damage-reduction": 75,
      },
    },
    drawbacks: {
      stats: {
        energy: -10,
      },
    },
    isArtifact: true,
  },
  {
    id: "moonlight",
    name: "Moonlight",
    description: "A mysterious artifact that enhances your perception at night but drains your energy during the day.",
    category: "anomaly",
    rarity: "rare",
    icon: "moon-star",
    effects: {
      skills: {
        perception: 2,
      },
      abilities: {
        nightVision: true,
      },
    },
    drawbacks: {
      stats: {
        energyRegen: -2,
      },
    },
    isArtifact: true,
  },
  {
    id: "fireball",
    name: "Fireball",
    description: "A thermal artifact that provides radiation resistance but makes you more vulnerable to damage.",
    category: "anomaly",
    rarity: "uncommon",
    icon: "fire",
    effects: {
      stats: {
        radiationResistance: 40,
      },
    },
    drawbacks: {
      combat: {
        damageResistance: -10,
      },
    },
    isArtifact: true,
  },

  // MUTATION PERKS (Metro-inspired)
  {
    id: "thick-skin",
    name: "Thick Skin",
    description: "Your skin has thickened due to radiation exposure, providing natural armor.",
    category: "mutation",
    rarity: "rare",
    icon: "skin",
    effects: {
      combat: {
        damageResistance: 15,
      },
    },
    drawbacks: {
      skills: {
        charisma: -1,
      },
    },
    requirements: {
      flags: {
        "radiation-exposure": true,
      },
    },
  },
  {
    id: "night-eyes",
    name: "Night Eyes",
    description: "Your eyes have adapted to darkness, allowing you to see in low light conditions.",
    category: "mutation",
    rarity: "rare",
    icon: "eye-night",
    effects: {
      abilities: {
        nightVision: true,
      },
      skillChecks: {
        perception: 2,
      },
    },
    drawbacks: {
      stats: {
        energyRegen: -1,
      },
    },
    requirements: {
      flags: {
        "darkness-exposure": true,
      },
    },
  },
  {
    id: "rad-eater",
    name: "Rad Eater",
    description: "Your body has adapted to convert radiation into energy.",
    category: "mutation",
    rarity: "legendary",
    icon: "atom",
    effects: {
      stats: {
        radiationResistance: 75,
      },
      setFlags: {
        "radiation-healing": true,
      },
    },
    drawbacks: {
      stats: {
        maxHealth: -15,
      },
    },
    requirements: {
      flags: {
        "severe-radiation-exposure": true,
      },
    },
  },

  // TECHNICAL PERKS
  {
    id: "gun-nut",
    name: "Gun Nut",
    description: "You can craft and modify more advanced weapons.",
    category: "technical",
    rarity: "common",
    icon: "wrench",
    effects: {
      setFlags: {
        "weapon-crafting-tier": 1,
      },
    },
    requirements: {
      skills: {
        intelligence: 5,
      },
    },
    maxRank: 4,
  },
  {
    id: "science",
    name: "Science!",
    description: "You can craft and modify energy weapons and high-tech equipment.",
    category: "technical",
    rarity: "uncommon",
    icon: "atom-alt",
    effects: {
      setFlags: {
        "energy-weapon-crafting": true,
      },
      skills: {
        intelligence: 1,
      },
    },
    requirements: {
      skills: {
        intelligence: 6,
      },
    },
    maxRank: 4,
  },
  {
    id: "hacker",
    name: "Hacker",
    description: "You can hack advanced terminals and security systems.",
    category: "technical",
    rarity: "uncommon",
    icon: "terminal",
    effects: {
      skillChecks: {
        intelligence: 3,
      },
      setFlags: {
        "hacking-tier": 1,
      },
    },
    requirements: {
      skills: {
        intelligence: 7,
      },
    },
    maxRank: 4,
  },
  {
    id: "armorer",
    name: "Armorer",
    description: "You can craft and modify more advanced armor.",
    category: "technical",
    rarity: "common",
    icon: "shield-alt",
    effects: {
      setFlags: {
        "armor-crafting-tier": 1,
      },
    },
    requirements: {
      skills: {
        intelligence: 5,
      },
    },
    maxRank: 4,
  },
  {
    id: "medic",
    name: "Medic",
    description: "Stimpaks restore 30% more health.",
    category: "technical",
    rarity: "common",
    icon: "medkit",
    effects: {
      setFlags: {
        "healing-bonus": 30,
      },
    },
    maxRank: 3,
  },
  {
    id: "robotics-expert",
    name: "Robotics Expert",
    description: "You can hack and control robots.",
    category: "technical",
    rarity: "rare",
    icon: "robot",
    effects: {
      setFlags: {
        "robot-hacking": true,
      },
      combat: {
        damageBonus: 25,
      },
    },
    requirements: {
      skills: {
        intelligence: 8,
      },
    },
    maxRank: 2,
  },
]
