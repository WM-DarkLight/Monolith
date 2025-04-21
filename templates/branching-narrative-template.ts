import type { Episode } from "@/types/episode"

/**
 * BRANCHING NARRATIVE TEMPLATE
 *
 * This template demonstrates how to create a branching narrative structure
 * with multiple paths and endings based on player choices.
 *
 * It shows how to use flags to track player decisions across episodes.
 */

// Starting episode
export const startingEpisode: Episode = {
  id: "crossroads",
  title: "The Crossroads",
  description: "A decision that will shape your journey",

  text: `You stand at a crossroads, unsure which path to take. Each direction leads to a different 
  destination, and your choice now will determine the course of your journey.

  To the north lies a mountain pass, treacherous but direct. To the east, a dense forest with 
  unknown dangers. To the west, a small settlement where you might find help or trouble.`,

  options: [
    {
      id: "take-mountain-pass",
      text: "Take the mountain pass",
      nextEpisode: "mountain-pass",
      // Set a flag to remember this choice
      setFlags: {
        "path-chosen": "mountains",
      },
    },
    {
      id: "enter-forest",
      text: "Enter the forest",
      nextEpisode: "dark-forest",
      // Set a flag to remember this choice
      setFlags: {
        "path-chosen": "forest",
      },
    },
    {
      id: "visit-settlement",
      text: "Visit the settlement",
      nextEpisode: "small-settlement",
      // Set a flag to remember this choice
      setFlags: {
        "path-chosen": "settlement",
      },
    },
  ],
}

// Mountain path episode
export const mountainEpisode: Episode = {
  id: "mountain-pass",
  title: "The Mountain Pass",
  description: "A treacherous path through the mountains",

  text: `The mountain path is steep and narrow, with loose rocks that threaten to give way 
  beneath your feet. Cold wind whips around you as you climb higher.

  Halfway up the path, you encounter a rockslide blocking your way. There's a narrow ledge 
  you might be able to use to go around, or you could try to climb over the rocks directly.`,

  options: [
    {
      id: "use-ledge",
      text: "Try to navigate the narrow ledge",
      skillCheck: {
        skill: "agility",
        difficulty: 7,
      },
      successText: "You carefully make your way across the ledge.",
      failureText: "You slip on the ledge and fall, injuring yourself.",
      nextEpisode: "mountain-top",
      failureEpisode: "mountain-injury",
      // Set a flag to remember how you passed the obstacle
      setFlags: {
        "mountain-obstacle": "ledge",
      },
    },
    {
      id: "climb-rocks",
      text: "Climb over the rockslide",
      skillCheck: {
        skill: "strength",
        difficulty: 6,
      },
      successText: "You power your way over the rocks.",
      failureText: "The rocks shift as you climb, causing you to fall.",
      nextEpisode: "mountain-top",
      failureEpisode: "mountain-injury",
      // Set a flag to remember how you passed the obstacle
      setFlags: {
        "mountain-obstacle": "climb",
      },
    },
    {
      id: "return-crossroads",
      text: "This is too dangerous, return to the crossroads",
      nextEpisode: "crossroads",
      // Reset the path choice
      setFlags: {
        "path-chosen": null,
      },
    },
  ],
}

// Forest episode
export const forestEpisode: Episode = {
  id: "dark-forest",
  title: "The Dark Forest",
  description: "A mysterious forest filled with strange sounds",

  text: `The forest is dense and dark, with towering trees blocking much of the sunlight. 
  Strange sounds echo through the woods, and you feel as if you're being watched.

  As you make your way deeper, you come across a small stream. The water looks clear, but 
  there's something unusual about it - it seems to glow faintly in the shadows.`,

  options: [
    {
      id: "drink-water",
      text: "Drink from the stream",
      nextEpisode: "forest-vision",
      // Set a flag to remember this choice
      setFlags: {
        "drank-stream": true,
      },
      // Modify stats - the water has unusual effects
      modifyStats: {
        health: 10,
        energy: -5,
      },
    },
    {
      id: "follow-stream",
      text: "Follow the stream deeper into the forest",
      nextEpisode: "forest-clearing",
      // Set a flag to remember this choice
      setFlags: {
        "forest-path": "stream",
      },
    },
    {
      id: "avoid-stream",
      text: "Avoid the stream and continue through the forest",
      nextEpisode: "forest-depths",
      // Set a flag to remember this choice
      setFlags: {
        "forest-path": "depths",
      },
    },
    {
      id: "return-crossroads",
      text: "This place feels wrong, return to the crossroads",
      nextEpisode: "crossroads",
      // Reset the path choice
      setFlags: {
        "path-chosen": null,
      },
    },
  ],
}

// Settlement episode
export const settlementEpisode: Episode = {
  id: "small-settlement",
  title: "The Settlement",
  description: "A small community of survivors",

  text: `The settlement consists of a handful of buildings surrounded by a makeshift wall. 
  Guards eye you suspiciously as you approach the gate.

  "State your business," one of them calls out. The people here seem wary of strangers, 
  but not immediately hostile.`,

  options: [
    {
      id: "request-entry",
      text: "Request permission to enter the settlement",
      skillCheck: {
        skill: "charisma",
        difficulty: 5,
      },
      successText: "The guards decide you don't seem threatening and let you in.",
      failureText: "The guards deny your request, not trusting your intentions.",
      nextEpisode: "settlement-interior",
      failureEpisode: "settlement-rejected",
      // Set a flag to remember how you entered
      setFlags: {
        "settlement-entry": "permission",
      },
    },
    {
      id: "offer-trade",
      text: "Offer to trade supplies for entry",
      // Only available if you have items to trade
      condition: {
        hasItems: ["medical-supplies"],
      },
      nextEpisode: "settlement-interior",
      // Remove the traded item
      removeItems: ["medical-supplies"],
      // Set a flag to remember how you entered
      setFlags: {
        "settlement-entry": "trade",
      },
    },
    {
      id: "find-another-way",
      text: "Look for another way into the settlement",
      skillCheck: {
        skill: "perception",
        difficulty: 6,
      },
      successText: "You notice a gap in the wall that you might be able to slip through.",
      failureText: "The settlement appears to be secure on all sides.",
      nextEpisode: "settlement-sneaking",
      failureEpisode: "settlement-exterior",
      // Set a flag to remember your approach
      setFlags: {
        "settlement-entry": "sneaking",
      },
    },
    {
      id: "return-crossroads",
      text: "Decide not to approach the settlement and return to the crossroads",
      nextEpisode: "crossroads",
      // Reset the path choice
      setFlags: {
        "path-chosen": null,
      },
    },
  ],
}

// Later episode that references previous choices
export const conclusionEpisode: Episode = {
  id: "journey-conclusion",
  title: "Journey's End",
  description: "The conclusion of your adventure",

  text: `After many challenges, you finally reach your destination. Looking back on your journey, 
  the path you chose has shaped who you've become.`,

  options: [
    {
      id: "mountain-conclusion",
      text: "Reflect on your mountain journey",
      // Only available if you took the mountain path
      condition: {
        flags: {
          "path-chosen": "mountains",
        },
      },
      nextEpisode: "mountain-epilogue",
    },
    {
      id: "forest-conclusion",
      text: "Reflect on your forest journey",
      // Only available if you took the forest path
      condition: {
        flags: {
          "path-chosen": "forest",
        },
      },
      // Different epilogues based on whether you drank from the stream
      nextEpisode: "forest-epilogue",
    },
    {
      id: "settlement-conclusion",
      text: "Reflect on your time in the settlement",
      // Only available if you visited the settlement
      condition: {
        flags: {
          "path-chosen": "settlement",
        },
      },
      // Different epilogues based on how you entered the settlement
      nextEpisode: "settlement-epilogue",
    },
  ],
}
