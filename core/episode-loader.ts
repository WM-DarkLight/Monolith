import type { Episode } from "@/types/episode"
import { episodeRegistry } from "@/episodes"

export async function loadEpisode(episodeId: string): Promise<Episode> {
  // Check if the episode exists in the registry
  if (!episodeRegistry[episodeId]) {
    throw new Error(`Episode with ID "${episodeId}" not found in registry`)
  }

  try {
    // Get the episode from the registry
    const episode = episodeRegistry[episodeId]

    // Process any dynamic content or conditions here
    return processEpisode(episode)
  } catch (error) {
    console.error(`Error loading episode ${episodeId}:`, error)
    throw error
  }
}

function processEpisode(episode: Episode): Episode {
  // This function can be expanded to handle dynamic content
  // For example, replacing placeholders with actual values
  // or filtering options based on game state

  return {
    ...episode,
    // Any processing logic here
  }
}
