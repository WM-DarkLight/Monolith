import type { Episode, Scene } from "@/types/episode"
import { episodeRegistry } from "@/episodes"

export async function loadEpisode(episodeId: string, sceneId?: string): Promise<Episode> {
  // Check if the episode exists in the registry
  if (!episodeRegistry[episodeId]) {
    throw new Error(`Episode with ID "${episodeId}" not found in registry`)
  }

  try {
    // Get the episode from the registry
    const episode = episodeRegistry[episodeId]

    // Process any dynamic content or conditions here
    const processedEpisode = processEpisode(episode)

    // If a scene ID is provided and the episode has scenes, set the current scene
    if (sceneId && processedEpisode.scenes && processedEpisode.scenes[sceneId]) {
      // Create a new episode object with the scene content
      const scene = processedEpisode.scenes[sceneId]
      return {
        ...processedEpisode,
        title: scene.title || processedEpisode.title,
        text: scene.text,
        options: scene.options,
        currentSceneId: sceneId,
      }
    }

    // If no scene ID is provided but the episode has an initial scene, use that
    if (!sceneId && processedEpisode.scenes && processedEpisode.initialScene) {
      const initialScene = processedEpisode.scenes[processedEpisode.initialScene]
      return {
        ...processedEpisode,
        title: initialScene.title || processedEpisode.title,
        text: initialScene.text,
        options: initialScene.options,
        currentSceneId: processedEpisode.initialScene,
      }
    }

    // Otherwise, return the episode as is (backward compatibility)
    return {
      ...processedEpisode,
      currentSceneId: null,
    }
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

// New function to load a specific scene from an episode
export async function loadScene(episodeId: string, sceneId: string): Promise<Scene> {
  const episode = await loadEpisode(episodeId)

  if (!episode.scenes || !episode.scenes[sceneId]) {
    throw new Error(`Scene with ID "${sceneId}" not found in episode "${episodeId}"`)
  }

  return episode.scenes[sceneId]
}
