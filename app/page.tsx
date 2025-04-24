"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/ui/dashboard"
import { GameEngine } from "@/core/engine"
import { initializeDatabase } from "@/lib/db"
import { getEpisodeList } from "@/lib/episode-service"
import { getCampaign, startCampaign, getCampaignProgress, startCampaignEpisode } from "@/lib/campaign-service"

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dbInitialized, setDbInitialized] = useState(false)
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string | undefined>()
  const [currentSaveId, setCurrentSaveId] = useState<string | undefined>()
  const [currentCampaignId, setCurrentCampaignId] = useState<string | undefined>()

  useEffect(() => {
    const setupDb = async () => {
      try {
        await initializeDatabase()
        setDbInitialized(true)

        // Check for new episodes on startup
        await getEpisodeList()
      } catch (error) {
        console.error("Failed to initialize database:", error)
      } finally {
        setIsLoading(false)
      }
    }

    setupDb()
  }, [])

  const handleStartGame = (saveId?: string, episodeId?: string) => {
    setCurrentSaveId(saveId)
    setCurrentEpisodeId(episodeId)
    setCurrentCampaignId(undefined)
    setIsPlaying(true)
  }

  const handleStartCampaign = async (campaignId: string) => {
    setIsLoading(true)
    try {
      // Get the campaign
      const campaign = await getCampaign(campaignId)
      if (!campaign) {
        throw new Error(`Campaign with ID ${campaignId} not found`)
      }

      // Get or create campaign progress
      let progress = await getCampaignProgress(campaignId)
      if (!progress) {
        // Start a new campaign
        progress = await startCampaign(campaignId)
      }

      // Get the current episode ID from the campaign
      const currentEpisodeIndex = progress.currentEpisodeIndex
      const currentEpisodeId = campaign.episodes[currentEpisodeIndex]?.id

      if (!currentEpisodeId) {
        throw new Error(`Episode at index ${currentEpisodeIndex} not found in campaign ${campaignId}`)
      }

      // Start the game with the current episode
      setCurrentCampaignId(campaignId)
      setCurrentEpisodeId(currentEpisodeId)
      setCurrentSaveId(undefined)
      setIsPlaying(true)
    } catch (error) {
      console.error(`Failed to start campaign ${campaignId}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartCampaignEpisode = async (campaignId: string, episodeId: string) => {
    setIsLoading(true)
    try {
      // Update campaign progress to the selected episode
      await startCampaignEpisode(campaignId, episodeId)

      // Start the game with the selected episode
      setCurrentCampaignId(campaignId)
      setCurrentEpisodeId(episodeId)
      setCurrentSaveId(undefined)
      setIsPlaying(true)
    } catch (error) {
      console.error(`Failed to start episode ${episodeId} in campaign ${campaignId}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="text-2xl font-bold text-gold">Initializing The Monolith...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {isPlaying ? (
        <GameEngine
          onExit={() => setIsPlaying(false)}
          initialSaveId={currentSaveId}
          initialEpisodeId={currentEpisodeId}
          campaignId={currentCampaignId}
        />
      ) : (
        <Dashboard
          onStartGame={handleStartGame}
          onStartCampaign={handleStartCampaign}
          onStartCampaignEpisode={handleStartCampaignEpisode}
        />
      )}
    </main>
  )
}
