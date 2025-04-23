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

    const progress: CampaignProgress = {
      campaignId,
      currentEpisodeIndex: 0,
      completedEpisodes: [],
      startedAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
    }

    await updateCampaignProgress(progress)
    return progress
  } catch (error) {
    console.error(`Failed to start campaign ${campaignId}:`, error)
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
