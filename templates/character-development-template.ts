import type { Episode } from "@/types/episode"

/**
 * CHARACTER DEVELOPMENT TEMPLATE
 *
 * This template demonstrates how to create episodes that focus on
 * character development through choices, skill improvements, and
 * perk acquisition.
 */

export const characterDevelopmentEpisode: Episode = {
  id: "training-grounds",
  title: "The Training Grounds",
  description: "A place to hone your skills and abilities",

  text: `The training grounds are a series of obstacle courses, target ranges, and sparring 
  circles. Various instructors oversee different stations, each specializing in different skills.

  This is an opportunity to focus on developing your abilities. The skills you choose to 
  improve now will shape your capabilities in future challenges.`,

  options: [
    {
      id: "combat-training",
      text: "Train in combat techniques with the weapons master",
      // Improve strength and unlock combat perks
      modifySkills: {
        strength: 1,
      },
      // Set flags for perk eligibility
      setFlags: {
        "combat-trained": true,
        "eligible-perk": "iron-fist",
      },
      nextEpisode: "combat-lesson",
    },

    {
      id: "stealth-training",
      text: "Practice stealth and agility with the scout",
      // Improve agility and unlock stealth perks
      modifySkills: {
        agility: 1,
      },
      // Set flags for perk eligibility
      setFlags: {
        "stealth-trained": true,
        "eligible-perk": "ninja",
      },
      nextEpisode: "stealth-lesson",
    },

    {
      id: "technical-training",
      text: "Study technical skills with the engineer",
      // Improve intelligence and unlock technical perks
      modifySkills: {
        intelligence: 1,
      },
      // Set flags for perk eligibility
      setFlags: {
        "technical-trained": true,
        "eligible-perk": "hacker",
      },
      nextEpisode: "technical-lesson",
    },

    {
      id: "social-training",
      text: "Learn social techniques with the diplomat",
      // Improve charisma and unlock social perks
      modifySkills: {
        charisma: 1,
      },
      // Set flags for perk eligibility
      setFlags: {
        "social-trained": true,
        "eligible-perk": "inspirational",
      },
      nextEpisode: "social-lesson",
    },

    {
      id: "observation-training",
      text: "Enhance your observation skills with the tracker",
      // Improve perception and unlock exploration perks
      modifySkills: {
        perception: 1,
      },
      // Set flags for perk eligibility
      setFlags: {
        "observation-trained": true,
        "eligible-perk": "explorer",
      },
      nextEpisode: "observation-lesson",
    },
  ],
}

// Follow-up episode where player can choose a perk
export const perkSelectionEpisode: Episode = {
  id: "skill-mastery",
  title: "Skill Mastery",
  description: "Choose a specialization based on your training",

  text: `After completing your training, you've gained new insights into your abilities. 
  The instructors gather to evaluate your progress and offer specialized knowledge.

  "You've shown aptitude," the head instructor says. "Now it's time to choose a path of 
  specialization that will define your approach to challenges ahead."`,

  options: [
    {
      id: "select-combat-perk",
      text: "Specialize in combat techniques",
      // Only available if player completed combat training
      condition: {
        flags: {
          "combat-trained": true,
        },
      },
      // Add a perk point and set flag for specific perk
      setFlags: {
        "perk-selected": "combat",
        "perk-point-earned": true,
      },
      nextEpisode: "perk-acquired",
    },

    {
      id: "select-stealth-perk",
      text: "Specialize in stealth and agility",
      // Only available if player completed stealth training
      condition: {
        flags: {
          "stealth-trained": true,
        },
      },
      // Add a perk point and set flag for specific perk
      setFlags: {
        "perk-selected": "stealth",
        "perk-point-earned": true,
      },
      nextEpisode: "perk-acquired",
    },

    {
      id: "select-technical-perk",
      text: "Specialize in technical knowledge",
      // Only available if player completed technical training
      condition: {
        flags: {
          "technical-trained": true,
        },
      },
      // Add a perk point and set flag for specific perk
      setFlags: {
        "perk-selected": "technical",
        "perk-point-earned": true,
      },
      nextEpisode: "perk-acquired",
    },

    {
      id: "select-social-perk",
      text: "Specialize in social influence",
      // Only available if player completed social training
      condition: {
        flags: {
          "social-trained": true,
        },
      },
      // Add a perk point and set flag for specific perk
      setFlags: {
        "perk-selected": "social",
        "perk-point-earned": true,
      },
      nextEpisode: "perk-acquired",
    },

    {
      id: "select-observation-perk",
      text: "Specialize in observation and tracking",
      // Only available if player completed observation training
      condition: {
        flags: {
          "observation-trained": true,
        },
      },
      // Add a perk point and set flag for specific perk
      setFlags: {
        "perk-selected": "observation",
        "perk-point-earned": true,
      },
      nextEpisode: "perk-acquired",
    },

    {
      id: "decline-specialization",
      text: "Decline to specialize for now",
      nextEpisode: "training-complete",
    },
  ],
}

// Episode that confirms perk acquisition
export const perkAcquiredEpisode: Episode = {
  id: "perk-acquired",
  title: "New Ability Acquired",
  description: "You've learned a specialized skill",

  text: `The instructor nods approvingly as you demonstrate your new abilities. "You've taken 
  the first step on a specialized path," they say. "Continue to hone this skill, and you'll 
  discover even greater potential."

  You feel a new confidence in your abilities. This specialization will open up new options 
  in your journey ahead.`,

  options: [
    {
      id: "continue-journey",
      text: "Continue your journey with your new abilities",
      nextEpisode: "world-map",
    },

    {
      id: "test-abilities",
      text: "Test your new abilities in a controlled environment",
      nextEpisode: "ability-test",
    },
  ],
}
