import { campaignRegistry } from "@/campaigns"
import type { Campaign, CampaignProgress } from "@/types/campaign"

// Get all available campaigns
export async function getCampaignList(): Promise<Campaign[]> {
  try {
    // Get all campaigns from the registry
    return Object.values(campaignRegistry)
  } catch (error) {
    console.error("Failed to get campaign list:", error)
    return []
  }
}

// Get a specific campaign by ID
export async function getCampaign(campaignId: string): Promise<Campaign | undefined> {
  try {
    return campaignRegistry[campaignId]
  } catch (error) {
    console.error(`Failed to get campaign with ID ${campaignId}:`, error)
    return undefined
  }
}

// Get campaign progress for a specific campaign
export async function getCampaignProgress(campaignId: string): Promise<CampaignProgress | undefined> {
  try {
    const db = await getDatabase()
    return db.get("campaignProgress", campaignId)
  } catch (error) {
    console.error(`Failed to get campaign progress for ${campaignId}:`, error)
    return undefined
  }
}

// Get all campaign progress records
export async function getAllCampaignProgress(): Promise<CampaignProgress[]> {
  try {
    const db = await getDatabase()
    return db.getAll("campaignProgress")
  } catch (error) {
    console.error("Failed to get all campaign progress:", error)
    return []
  }
}

// Update campaign progress
export async function updateCampaignProgress(progress: CampaignProgress): Promise<void> {
  try {
    const db = await getDatabase()
    await db.put("campaignProgress", progress)
  } catch (error) {
    console.error(`Failed to update campaign progress for ${progress.campaignId}:`, error)
  }
}

// Start a new campaign
export async function startCampaign(campaignId: string): Promise<CampaignProgress> {
  try {
    const campaign = await getCampaign(campaignId)
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`)
    }

    // Check if there's existing progress to preserve the everCompleted flag
    const existingProgress = await getCampaignProgress(campaignId)
    const everCompleted = existingProgress?.everCompleted || false

    const progress: CampaignProgress = {
      campaignId,
      currentEpisodeIndex: 0,
      completedEpisodes: [],
      startedAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
      everCompleted, // Preserve the everCompleted flag
    }

    await updateCampaignProgress(progress)
    return progress
  } catch (error) {
    console.error(`Failed to start campaign ${campaignId}:`, error)
    throw error
  }
}

// Replay a campaign (reset progress but keep the original start date and everCompleted flag)
export async function replayCampaign(campaignId: string): Promise<CampaignProgress> {
  try {
    const existingProgress = await getCampaignProgress(campaignId)
    if (!existingProgress) {
      // If no existing progress, just start a new campaign
      return startCampaign(campaignId)
    }

    // Create updated progress with reset values but keep original start date and everCompleted flag
    const updatedProgress: CampaignProgress = {
      ...existingProgress,
      currentEpisodeIndex: 0,
      completedEpisodes: [], // Reset completed episodes
      lastPlayedAt: new Date().toISOString(),
      // Keep the everCompleted flag if it exists
      everCompleted: existingProgress.everCompleted,
    }

    await updateCampaignProgress(updatedProgress)
    return updatedProgress
  } catch (error) {
    console.error(`Failed to replay campaign ${campaignId}:`, error)
    throw error
  }
}

// Start a specific episode in a campaign
export async function startCampaignEpisode(campaignId: string, episodeId: string): Promise<CampaignProgress> {
  try {
    const campaign = await getCampaign(campaignId)
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`)
    }

    // Find the episode index
    const episodeIndex = campaign.episodes.findIndex((episode) => episode.id === episodeId)
    if (episodeIndex === -1) {
      throw new Error(`Episode with ID ${episodeId} not found in campaign ${campaignId}`)
    }

    // Get existing progress or create new
    let progress = await getCampaignProgress(campaignId)
    if (!progress) {
      progress = {
        campaignId,
        currentEpisodeIndex: episodeIndex,
        completedEpisodes: [],
        startedAt: new Date().toISOString(),
        lastPlayedAt: new Date().toISOString(),
        everCompleted: false,
      }
    } else {
      // Update the current episode index
      progress = {
        ...progress,
        currentEpisodeIndex: episodeIndex,
        lastPlayedAt: new Date().toISOString(),
      }
    }

    await updateCampaignProgress(progress)
    return progress
  } catch (error) {
    console.error(`Failed to start episode ${episodeId} in campaign ${campaignId}:`, error)
    throw error
  }
}

// Mark an episode as completed and advance to the next one
export async function completeEpisode(campaignId: string, episodeId: string): Promise<CampaignProgress> {
  try {
    const progress = await getCampaignProgress(campaignId)
    const campaign = await getCampaign(campaignId)

    if (!progress || !campaign) {
      throw new Error(`Campaign progress or campaign not found for ${campaignId}`)
    }

    // Add the episode to completed episodes if not already there
    if (!progress.completedEpisodes.includes(episodeId)) {
      progress.completedEpisodes.push(episodeId)
    }

    // Find the current episode index
    const currentIndex = campaign.episodes.findIndex((episode) => episode.id === episodeId)

    // If there's a next episode, advance to it
    if (currentIndex >= 0 && currentIndex < campaign.episodes.length - 1) {
      progress.currentEpisodeIndex = currentIndex + 1
    }

    // Check if all episodes are completed
    const allEpisodes = campaign.episodes.map((episode) => episode.id)
    const allCompleted = allEpisodes.every((id) => progress.completedEpisodes.includes(id))

    // If all episodes are completed, set the everCompleted flag
    if (allCompleted) {
      progress.everCompleted = true
    }

    progress.lastPlayedAt = new Date().toISOString()

    await updateCampaignProgress(progress)
    return progress
  } catch (error) {
    console.error(`Failed to complete episode ${episodeId} in campaign ${campaignId}:`, error)
    throw error
  }
}

// Helper function to get database instance
async function getDatabase() {
  const { getDatabase: getDB } = await import("@/lib/db")
  return getDB()
}
