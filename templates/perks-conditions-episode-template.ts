import type { Episode } from "@/types/episode"

/**
 * PERKS AND CONDITIONS EPISODE TEMPLATE
 *
 * This template demonstrates the most advanced features:
 * - Perk-based options and checks
 * - Complex conditions with multiple requirements
 * - Stat modifications
 * - Flag management
 * - Multiple success/failure paths
 *
 * Use this for complex scenarios with many variables.
 */
export const perksConditionsEpisodeTemplate: Episode = {
  id: "radiation-zone",
  title: "The Radiation Zone",
  description: "A highly irradiated area with valuable technology",

  text: `You stand at the edge of a shimmering field of radiation. Your Geiger counter clicks 
  frantically, warning of the danger ahead. Through the haze, you can see the outline of what 
  appears to be a pre-war research facility.

  The main entrance is blocked by debris, but there's a partially collapsed wall that might 
  provide an alternative way in. A hazard suit hangs on a nearby emergency station, though 
  it's damaged in several places.

  The radiation levels are high enough to cause significant harm to an unprotected person, 
  but the potential rewards inside the facility could be worth the risk.`,

  options: [
    {
      id: "use-rad-resistance",
      text: "Use your radiation resistance to enter the zone safely",
      // Requires the rad-resistant perk
      condition: {
        perks: {
          "rad-resistant": true,
        },
      },
      successText: "Your enhanced radiation resistance allows you to withstand the radiation.",
      nextEpisode: "research-facility",
      // Still take some radiation damage, but less than normal
      modifyStats: {
        health: -5,
      },
    },

    {
      id: "repair-hazard-suit",
      text: "Attempt to repair the damaged hazard suit",
      // Requires technical skill and repair kit
      condition: {
        skills: {
          intelligence: 6,
        },
        hasItems: ["repair-kit"],
      },
      // Intelligence skill check
      skillCheck: {
        skill: "intelligence",
        difficulty: 7,
      },
      successText: "You successfully repair the hazard suit enough to provide protection.",
      failureText: "Despite your efforts, the suit remains too damaged to offer adequate protection.",
      // Add the repaired suit to inventory on success
      addItems: [
        {
          id: "repaired-hazard-suit",
          name: "Repaired Hazard Suit",
          description: "A hazard suit that's been patched up. It should provide some protection.",
          quantity: 1,
        },
      ],
      // Remove repair kit
      removeItems: ["repair-kit"],
      nextEpisode: "radiation-zone", // Return to same episode
      // Set a flag to indicate the suit is repaired
      setFlags: {
        "hazard-suit-repaired": true,
      },
    },

    {
      id: "wear-hazard-suit",
      text: "Wear the repaired hazard suit and enter the facility",
      // Only available if the suit has been repaired
      condition: {
        flags: {
          "hazard-suit-repaired": true,
        },
        hasItems: ["repaired-hazard-suit"],
      },
      nextEpisode: "research-facility",
      // Take minimal radiation damage
      modifyStats: {
        health: -10,
      },
    },

    {
      id: "use-rad-x",
      text: "Take Rad-X medication and brave the radiation",
      // Requires Rad-X item
      condition: {
        hasItems: ["rad-x"],
      },
      // Remove the Rad-X
      removeItems: ["rad-x"],
      nextEpisode: "research-facility",
      // Take moderate radiation damage
      modifyStats: {
        health: -25,
      },
    },

    {
      id: "use-stealth-approach",
      text: "Use your stealth skills to find a safer path through the radiation",
      // Requires high agility and the 'night-person' perk for enhanced perception
      condition: {
        skills: {
          agility: 7,
        },
        perks: {
          "night-person": true,
        },
      },
      // Agility skill check
      skillCheck: {
        skill: "agility",
        difficulty: 8,
      },
      successText: "You navigate through areas with lower radiation, minimizing your exposure.",
      failureText: "Despite your caution, you can't find a safe path through the radiation.",
      nextEpisode: "research-facility-back-entrance",
      failureEpisode: "radiation-exposure",
      // Take minimal damage on success
      modifyStats: {
        energy: -15,
      },
      // Take significant damage on failure
      failureStats: {
        health: -40,
      },
    },

    {
      id: "use-anomaly-detector",
      text: "Use your anomaly detector to map safe passages",
      // Requires the 'anomaly-detector' item and 'crystal-heart' artifact perk
      condition: {
        hasItems: ["anomaly-detector"],
        perks: {
          "crystal-heart": true,
        },
      },
      // Perception skill check with bonus from the detector
      skillCheck: {
        skill: "perception",
        difficulty: 6,
        bonus: {
          itemId: "anomaly-detector",
          value: 2,
        },
      },
      successText: "The detector helps you map out a path with minimal radiation.",
      failureText: "The radiation interferes with the detector's readings.",
      nextEpisode: "research-facility-safe-route",
      // Set a flag for future reference
      setFlags: {
        "mapped-radiation-zone": true,
      },
    },

    {
      id: "brute-force",
      text: "Ignore the danger and rush through the radiation zone",
      // No conditions - always available as a last resort
      // But has serious consequences
      nextEpisode: "research-facility",
      // Take severe radiation damage
      modifyStats: {
        health: -50,
      },
      // Set a flag for radiation sickness
      setFlags: {
        "radiation-sickness": true,
      },
    },

    {
      id: "retreat",
      text: "Decide the risk isn't worth it and retreat",
      nextEpisode: "wasteland-outskirts",
    },
  ],
}
