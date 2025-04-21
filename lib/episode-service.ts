import { episodeRegistry } from "@/episodes"
import { getAll, put } from "@/lib/db"
import type { EpisodeSummary } from "@/types/episode"

export async function getEpisodeList(): Promise<EpisodeSummary[]> {
  try {
    // Try to get episode summaries from IndexedDB
    const storedEpisodes = await getAll("episodes")

    if (storedEpisodes.length > 0) {
      return storedEpisodes
    }

    // If no episodes in DB, create summaries from registry
    const episodeSummaries: EpisodeSummary[] = Object.entries(episodeRegistry).map(([id, episode]) => ({
      id,
      title: episode.title,
      description: episode.description || "",
      completed: false,
      started: false,
      allowCustomSkills: episode.allowCustomSkills || false,
    }))

    // Store the summaries in IndexedDB
    for (const summary of episodeSummaries) {
      await put("episodes", summary)
    }

    return episodeSummaries
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
