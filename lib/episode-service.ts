import { episodeRegistry } from "@/episodes"
import { getAll, put } from "@/lib/db"
import type { EpisodeSummary } from "@/types/episode"

// Update the getEpisodeList function to check for new episodes
export async function getEpisodeList(): Promise<EpisodeSummary[]> {
  try {
    // Try to get episode summaries from IndexedDB
    const storedEpisodes = await getAll("episodes")

    // Get all episodes from the registry
    const registryEpisodeIds = Object.keys(episodeRegistry)

    // Check if there are new episodes in the registry that aren't in the database
    const storedEpisodeIds = storedEpisodes.map((episode) => episode.id)
    const newEpisodeIds = registryEpisodeIds.filter((id) => !storedEpisodeIds.includes(id))

    // If there are new episodes or no episodes in DB, update the database
    if (newEpisodeIds.length > 0 || storedEpisodes.length === 0) {
      console.log("New episodes found, updating database...")

      // Create summaries for new episodes
      const newEpisodeSummaries: EpisodeSummary[] = newEpisodeIds.map((id) => ({
        id,
        title: episodeRegistry[id].title,
        description: episodeRegistry[id].description || "",
        completed: false,
        started: false,
        allowCustomSkills: episodeRegistry[id].allowCustomSkills || false,
      }))

      // Store the new summaries in IndexedDB
      for (const summary of newEpisodeSummaries) {
        await put("episodes", summary)
      }

      // Return all episodes (stored + new)
      return [...storedEpisodes, ...newEpisodeSummaries]
    }

    return storedEpisodes
  } catch (error) {
    console.error("Failed to get episode list:", error)

    // Fallback to registry if DB fails
    return Object.entries(episodeRegistry).map(([id, episode]) => ({
      id,
      title: episode.title,
      description: episode.description || "",
      completed: false,
      started: false,
      allowCustomSkills: episode.allowCustomSkills || false,
    }))
  }
}

export async function updateEpisodeProgress(
  episodeId: string,
  updates: { started?: boolean; completed?: boolean },
): Promise<void> {
  try {
    const episode = await get("episodes", episodeId)

    if (episode) {
      await put("episodes", {
        ...episode,
        ...updates,
      })
    }
  } catch (error) {
    console.error(`Failed to update episode progress for ${episodeId}:`, error)
  }
}

// Helper function to get a single episode summary
async function get(storeName: "episodes", id: string): Promise<EpisodeSummary | undefined> {
  try {
    const db = await getDatabase()
    return db.get(storeName, id)
  } catch (error) {
    console.error(`Failed to get ${storeName} with ID ${id}:`, error)
    return undefined
  }
}

// Helper function to get database instance
async function getDatabase() {
  const { getDatabase: getDB } = await import("@/lib/db")
  return getDB()
}
