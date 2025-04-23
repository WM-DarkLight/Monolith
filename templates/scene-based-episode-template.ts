import type { Episode } from "@/types/episode"

/**
 * BASIC SCENE-BASED EPISODE TEMPLATE
 *
 * This template demonstrates how to structure an episode with multiple scenes:
 * - Define scenes within the episode
 * - Set an initial scene
 * - Navigate between scenes using scene IDs
 *
 * Use this for creating rich, multi-scene episodes without needing to create separate episode files.
 */
export const sceneBasedEpisodeTemplate: Episode = {
  id: "abandoned-mansion",
  title: "The Abandoned Mansion",
  description: "Explore a mysterious mansion with many rooms",

  // Set the initial scene that will be displayed first
  initialScene: "mansion-exterior",

  // Define all scenes within this episode
  scenes: {
    // First scene: Mansion Exterior
    "mansion-exterior": {
      id: "mansion-exterior",
      title: "Mansion Exterior",
      text: `You stand before an imposing Victorian mansion, its once-grand facade now weathered 
      and crumbling. Vines crawl up the walls, and many of the windows are broken or boarded up.
      
      The front door is partially ajar, and a path leads around to what might be a garden at the back.
      The sun is setting, casting long shadows across the overgrown lawn.`,
      options: [
        {
          id: "enter-front-door",
          text: "Enter through the front door",
          scene: "main-hall", // Navigate to another scene in this episode
        },
        {
          id: "check-windows",
          text: "Look through the windows",
          scene: "window-view", // Navigate to another scene in this episode
        },
        {
          id: "go-around-back",
          text: "Go around to the back garden",
          scene: "back-garden", // Navigate to another scene in this episode
        },
        {
          id: "leave-mansion",
          text: "Leave the mansion grounds",
          nextEpisode: "forest-path", // Navigate to a different episode
        },
      ],
    },

    // Second scene: Main Hall
    "main-hall": {
      id: "main-hall",
      title: "The Main Hall",
      text: `The mansion's main hall is grand but decrepit. A once-elegant chandelier hangs 
      precariously from the ceiling, and a wide staircase leads to the upper floor.
      
      Doorways lead off to various rooms, and a thick layer of dust covers everything. Your 
      footprints are clearly visible on the floor behind you.`,
      options: [
        {
          id: "climb-stairs",
          text: "Climb the staircase to the upper floor",
          scene: "upper-landing", // Navigate to another scene in this episode
        },
        {
          id: "enter-dining-room",
          text: "Enter the dining room",
          scene: "dining-room", // Navigate to another scene in this episode
        },
        {
          id: "enter-library",
          text: "Enter the library",
          scene: "library", // Navigate to another scene in this episode
        },
        {
          id: "return-outside",
          text: "Return outside",
          scene: "mansion-exterior", // Go back to the exterior scene
        },
      ],
    },

    // Third scene: Window View
    "window-view": {
      id: "window-view",
      title: "Through the Window",
      text: `You peer through one of the less dirty windows into what appears to be a library. 
      Bookshelves line the walls, many of them collapsed or with books strewn across the floor.
      
      You can make out a desk in the center of the room with something glinting on its surface.`,
      options: [
        {
          id: "enter-front-door",
          text: "Go to the front door and enter",
          scene: "main-hall", // Navigate to the main hall scene
        },
        {
          id: "return-to-front",
          text: "Step back from the window",
          scene: "mansion-exterior", // Go back to the exterior scene
        },
      ],
    },

    // Fourth scene: Back Garden
    "back-garden": {
      id: "back-garden",
      title: "The Back Garden",
      text: `The back garden is overgrown with weeds and strange plants you don't recognize. 
      A stone path, now cracked and uneven, leads to a small greenhouse with broken glass panels.
      
      The back door to the mansion is locked, but there's a cellar entrance nearby, its doors 
      hanging open like a gaping mouth.`,
      options: [
        {
          id: "enter-greenhouse",
          text: "Explore the greenhouse",
          scene: "greenhouse", // Navigate to another scene in this episode
        },
        {
          id: "enter-cellar",
          text: "Descend into the cellar",
          scene: "cellar", // Navigate to another scene in this episode
        },
        {
          id: "return-to-front",
          text: "Return to the front of the mansion",
          scene: "mansion-exterior", // Go back to the exterior scene
        },
      ],
    },

    // Additional scenes would be defined here...
    "upper-landing": {
      id: "upper-landing",
      title: "Upper Floor Landing",
      text: `The upper landing is dimly lit by moonlight streaming through a large window. 
      Several doors lead off to what you assume are bedrooms and other chambers.`,
      options: [
        {
          id: "return-downstairs",
          text: "Return downstairs",
          scene: "main-hall", // Go back to the main hall
        },
        // More options would be added here...
      ],
    },

    "dining-room": {
      id: "dining-room",
      title: "The Dining Room",
      text: `A long table dominates this room, set with moldering plates and tarnished silverware 
      as if for a dinner party that never happened.`,
      options: [
        {
          id: "return-to-hall",
          text: "Return to the main hall",
          scene: "main-hall", // Go back to the main hall
        },
        // More options would be added here...
      ],
    },

    // More scenes would be defined here...
  },

  // For backward compatibility - these will be used if scenes aren't supported
  text: `You stand before an imposing Victorian mansion, its once-grand facade now weathered 
  and crumbling. Vines crawl up the walls, and many of the windows are broken or boarded up.`,
  options: [
    {
      id: "enter-mansion",
      text: "Enter the mansion",
      nextEpisode: "mansion-interior",
    },
    {
      id: "leave-mansion",
      text: "Leave the mansion grounds",
      nextEpisode: "forest-path",
    },
  ],
}
