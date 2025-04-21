# Monolith Adventure Engine - Developer Documentation

This document provides detailed information for developers who want to extend the Monolith Adventure Engine with custom episodes, perks, skills, and other features.

## Table of Contents

- [Engine Architecture](#engine-architecture)
- [Creating Episodes](#creating-episodes)
  - [Episode Structure](#episode-structure)
  - [Episode Options](#episode-options)
  - [Skill Checks](#skill-checks)
  - [Conditions](#conditions)
  - [Episode Registry](#episode-registry)
- [Skills System](#skills-system)
  - [Default Skills](#default-skills)
  - [Skill Checks](#implementing-skill-checks)
  - [Skill Improvement](#skill-improvement)
- [Perks System](#perks-system)
  - [Perk Structure](#perk-structure)
  - [Perk Categories](#perk-categories)
  - [Perk Requirements](#perk-requirements)
  - [Artifacts](#artifacts)
- [Save System](#save-system)
- [Templates](#templates)
  - [Episode Template](#episode-template)
  - [Perk Template](#perk-template)
- [Best Practices](#best-practices)

## Engine Architecture

The Monolith Adventure Engine is built with a modular architecture:

- **Core**: Contains the game engine and state management
- **Types**: TypeScript interfaces for game objects
- **Modules**: Specialized managers for different game systems
- **UI**: React components for the user interface
- **Episodes**: Individual story segments
- **Data**: Game data like perks and items

Key files and their purposes:

- `core/engine.tsx`: Main game loop and state management
- `core/episode-loader.ts`: Loads episodes and processes content
- `modules/skill-manager.ts`: Handles skill checks and skill-related logic
- `modules/perk-manager.ts`: Manages perks and their effects
- `lib/save-manager.ts`: Handles saving and loading games
- `types/*.ts`: TypeScript interfaces for game objects

## Creating Episodes

Episodes are the building blocks of your adventure. Each episode represents a scene or situation in your story.

### Episode Structure

Create a new file in the `episodes` directory with the following structure:

\`\`\`typescript
import type { Episode } from "@/types/episode"

export const myNewEpisode: Episode = {
  id: "unique-episode-id",
  title: "Episode Title",
  description: "Optional description for the episode selection screen",
  text: `
    This is the main text of the episode that will be displayed to the player.
    You can use multiple paragraphs and include narrative, descriptions, and dialogue.
  `,
  options: [
    // Options will go here (see below)
  ],
  // Optional fields
  allowCustomSkills: false, // Set to true to enable character creation
  skillPoints: 10, // Number of skill points if allowCustomSkills is true
  recommendedSkills: { // Recommended skill distribution
    perception: 7,
    agility: 6,
    charisma: 6,
  },
}
\`\`\`

### Episode Options

Options define the choices available to the player:

\`\`\`typescript
options: [
  {
    id: "option-1",
    text: "This is what the player sees as a choice",
    nextEpisode: "next-episode-id", // ID of the episode to load when selected
    
    // Optional fields
    condition: {}, // Conditions that must be met for this option to appear
    skillCheck: {}, // Skill check required to succeed
    setFlags: { "flag-name": true }, // Flags to set when chosen
    modifyStats: { health: -10, energy: -5 }, // Stats to modify
    modifySkills: { perception: 1 }, // Skills to improve
    addItems: [ // Items to add to inventory
      { 
        id: "item-id", 
        name: "Item Name", 
        description: "Item description", 
        quantity: 1 
      }
    ],
    removeItems: ["item-id"], // Items to remove from inventory
    successText: "Text shown on successful skill check",
    failureText: "Text shown on failed skill check",
    failureEpisode: "failure-episode-id", // Episode to load on failure
    failureStats: { health: -20 }, // Stats to modify on failure
    failureFlags: { "failed-attempt": true }, // Flags to set on failure
  },
  // More options...
]
\`\`\`

### Skill Checks

Skill checks add an element of chance based on the player's skills:

\`\`\`typescript
skillCheck: {
  skill: "perception", // The skill to check
  difficulty: 7, // The difficulty level (1-10)
  bonus: { // Optional bonus
    itemId: "binoculars", // Item that provides a bonus
    flagName: "practiced", // Flag that provides a bonus
    value: 2 // Bonus value
  }
}
\`\`\`

### Conditions

Conditions determine whether an option is available:

\`\`\`typescript
condition: {
  flags: { "has-key": true }, // Required flags
  stats: { 
    health: { min: 50 }, // Minimum health
    energy: { max: 80 } // Maximum energy
  },
  skills: { strength: 6 }, // Minimum skill level
  hasItems: ["torch", "rope"], // Required items
  perks: { "night-person": true } // Required perks
}
\`\`\`

### Episode Registry

After creating your episode, register it in `episodes/index.ts`:

\`\`\`typescript
import { myNewEpisode } from "./my-new-episode"

export const episodeRegistry: EpisodeRegistry = {
  // Existing episodes...
  "my-new-episode-id": myNewEpisode,
}
\`\`\`

## Skills System

The skills system defines character attributes that affect gameplay options and outcomes.

### Default Skills

The engine comes with six default skills:

- **Strength**: Physical power for combat and intimidation
- **Intelligence**: Mental acuity for problem-solving and technology
- **Charisma**: Social influence for persuasion and leadership
- **Perception**: Awareness for finding hidden items and details
- **Agility**: Dexterity for stealth and reflexes
- **Luck**: Fortune for critical successes and rare finds

Skills are rated from 1 (very poor) to 10 (exceptional).

### Implementing Skill Checks

Skill checks determine success based on:
- Base skill value
- Random dice roll (1-5)
- Luck bonus (0-2 based on luck stat)
- Item or flag bonuses

The total is compared to the difficulty level to determine success.

### Skill Improvement

Skills can improve through gameplay:

\`\`\`typescript
modifySkills: {
  perception: 1, // Improve perception by 1
}
\`\`\`

## Perks System

Perks are special abilities that provide unique bonuses and gameplay options.

### Perk Structure

Create perks in `data/perks.ts`:

\`\`\`typescript
{
  id: "perk-id",
  name: "Perk Name",
  description: "Description of what the perk does",
  category: "combat", // Category (see below)
  rarity: "uncommon", // common, uncommon, rare, or legendary
  icon: "icon-name", // Icon identifier
  effects: { // Effects the perk provides
    stats: { health: 20 }, // Stat bonuses
    skills: { perception: 1 }, // Skill bonuses
    combat: { damageBonus: 10 }, // Combat bonuses
    abilities: { nightVision: true }, // Special abilities
    setFlags: { "perk-flag": true } // Flags to set
  },
  drawbacks: {}, // Optional drawbacks (same structure as effects)
  requirements: {}, // Requirements to unlock (see below)
  maxRank: 3, // Maximum rank for multi-level perks
  isArtifact: false // Whether this is an artifact (special item)
}
\`\`\`

### Perk Categories

Available categories:
- `combat`: Combat-related perks
- `survival`: Survival and resistance perks
- `exploration`: Travel and discovery perks
- `social`: Interaction and dialogue perks
- `anomaly`: Special environmental perks
- `mutation`: Character mutation perks
- `technical`: Crafting and technology perks

### Perk Requirements

Requirements to unlock a perk:

\`\`\`typescript
requirements: {
  level: 5, // Minimum player level
  skills: { intelligence: 7 }, // Required skill levels
  perks: ["prerequisite-perk"], // Required perks
  flags: { "story-milestone": true }, // Required flags
  mutuallyExclusive: ["incompatible-perk"] // Perks that cannot be taken with this one
}
\`\`\`

### Artifacts

Artifacts are special perks that can be equipped/unequipped:

\`\`\`typescript
{
  id: "crystal-heart",
  name: "Crystal Heart",
  description: "An anomalous artifact that enhances vitality",
  category: "anomaly",
  rarity: "rare",
  icon: "crystal",
  effects: {
    stats: { maxHealth: 30, healthRegen: 2 }
  },
  drawbacks: {
    stats: { radiationResistance: -20 }
  },
  isArtifact: true
}
\`\`\`

## Save System

The save system uses IndexedDB to store game state. Key features:

- Multiple save slots
- Auto-save functionality
- Save data compression
- Save import/export

To trigger a save:

\`\`\`typescript
import { saveGame } from "@/lib/save-manager"

const saveId = await saveGame({
  name: "My Save",
  episodeId: gameState.currentEpisodeId,
  episodeTitle: currentEpisode.title,
  gameState,
  stats: gameState.stats,
})
\`\`\`

## Templates

### Episode Template

\`\`\`typescript
import type { Episode } from "@/types/episode"

export const templateEpisode: Episode = {
  id: "template-episode",
  title: "Template Episode",
  description: "A template for creating new episodes",
  text: `
    Your main episode text goes here.
    
    This is what the player will read when they reach this episode.
    You can include multiple paragraphs and format the text as needed.
  `,
  options: [
    {
      id: "option-1",
      text: "First choice for the player",
      nextEpisode: "next-episode-id",
    },
    {
      id: "option-2",
      text: "Choice with a skill check",
      skillCheck: {
        skill: "intelligence",
        difficulty: 6,
      },
      successText: "You succeeded!",
      failureText: "You failed!",
      nextEpisode: "success-episode",
      failureEpisode: "failure-episode",
    },
    {
      id: "option-3",
      text: "Choice with a condition",
      condition: {
        hasItems: ["required-item"],
        flags: { "story-flag": true },
      },
      nextEpisode: "conditional-episode",
    },
    {
      id: "option-4",
      text: "Choice that gives rewards",
      addItems: [
        { 
          id: "reward-item", 
          name: "Reward Item", 
          description: "A reward for the player", 
          quantity: 1 
        }
      ],
      modifyStats: { health: 10, energy: 5 },
      modifySkills: { perception: 1 },
      nextEpisode: "reward-episode",
    },
  ],
}
\`\`\`

### Perk Template

\`\`\`typescript
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
\`\`\`

## Best Practices

1. **Episode Design**:
   - Keep episode text concise but descriptive
   - Provide 3-5 meaningful choices per episode
   - Balance skill checks across different skills
   - Create a mix of conditional and unconditional options

2. **Skill Checks**:
   - Use a range of difficulties (easy: 3-4, medium: 5-7, hard: 8-10)
   - Provide alternative paths for failed skill checks
   - Consider adding bonuses for items or previous actions

3. **Perk Design**:
   - Balance benefits with requirements
   - Create synergies between related perks
   - Consider progression paths through perk requirements
   - For powerful perks, add meaningful drawbacks

4. **Story Structure**:
   - Create a main storyline with optional side branches
   - Use flags to track important story decisions
   - Consider creating hub episodes that players return to
   - Design meaningful consequences for player choices

5. **Testing**:
   - Test all paths through your episodes
   - Verify skill checks work as expected
   - Test with different character builds
   - Check that perks provide their intended benefits

6. **Performance**:
   - Keep episode text and options reasonably sized
   - Avoid creating circular references between episodes
   - Use compression for large save files
   - Consider breaking very large adventures into multiple modules
