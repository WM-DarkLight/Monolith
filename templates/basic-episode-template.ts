import type { Episode } from "@/types/episode"

/**
 * BASIC EPISODE TEMPLATE
 *
 * This template contains only the essential elements:
 * - Story text
 * - Simple options that lead to other episodes
 *
 * Use this for simple narrative sections without game mechanics.
 */
export const basicEpisodeTemplate: Episode = {
  id: "forest-clearing",
  title: "The Forest Clearing",
  description: "A peaceful clearing in the middle of the forest",

  // Main story text that the player reads
  text: `You emerge from the dense trees into a sunlit clearing. Wildflowers dot the grass, 
  and a gentle breeze carries the scent of pine. In the center of the clearing stands an 
  ancient stone well, its stones covered in moss.

  To the north, a narrow path continues deeper into the forest. To the east, you can see 
  what appears to be the ruins of a small structure.`,

  // Player choices - simple navigation without conditions
  options: [
    {
      id: "examine-well",
      text: "Examine the old well",
      nextEpisode: "old-well", // ID of the episode to load when selected
    },
    {
      id: "take-north-path",
      text: "Follow the path north deeper into the forest",
      nextEpisode: "deep-forest",
    },
    {
      id: "explore-ruins",
      text: "Investigate the ruins to the east",
      nextEpisode: "ancient-ruins",
    },
    {
      id: "return-to-trail",
      text: "Return to the main trail",
      nextEpisode: "forest-trail",
    },
  ],
}
