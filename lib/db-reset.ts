import { initializeDatabase } from "@/lib/db"
import { episodeRegistry } from "@/episodes"

/**
 * Resets the episodes in the database to match the current registry
 * This is useful during development or when new episodes are added
 */
export async function resetEpisodeDatabase(): Promise<void> {
  try {
    const db = await initializeDatabase()

    // Clear the episodes store
    const tx = db.transaction("episodes", "readwrite")
    await tx.objectStore("episodes").clear()
    await tx.done

    console.log("Episodes database cleared")

    // Add all episodes from registry
    const episodeSummaries = Object.entries(episodeRegistry).map(([id, episode]) => ({
      id,
      title: episode.title,
      description: episode.description || "",
      completed: false,
      started: false,
      allowCustomSkills: episode.allowCustomSkills || false,
    }))

    // Store the summaries in IndexedDB
    for (const summary of episodeSummaries) {
      await db.put("episodes", summary)
    }

    console.log(`Added ${episodeSummaries.length} episodes to database`)

    return
  } catch (error) {
    console.error("Failed to reset episode database:", error)
    throw error
  }
}

/**
 * Completely resets the entire database (all stores)
 * WARNING: This will delete all saved games and progress
 */
export async function resetEntireDatabase(): Promise<void> {
  try {
    // Delete the database entirely
    await window.indexedDB.deleteDatabase("monolith-db")
    console.log("Database deleted")

    // Reinitialize the database
    await initializeDatabase()
    console.log("Database reinitialized")

    return
  } catch (error) {
    console.error("Failed to reset database:", error)
    throw error
  }
}
