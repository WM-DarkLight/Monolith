"use client"

import type { Campaign, CampaignProgress } from "@/types/campaign"
import { AlertTriangle, ChevronRight, BookOpen, Award, Zap } from "lucide-react"

interface CampaignLibraryProps {
  campaigns: Campaign[]
  campaignProgress: Record<string, CampaignProgress>
  onSelectCampaign: (campaignId: string) => void
}

export function CampaignLibrary({ campaigns, campaignProgress, onSelectCampaign }: CampaignLibraryProps) {
  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 rounded-full bg-dark-gray border-2 border-gold/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-gold/40" />
        </div>
        <h3 className="text-lg font-medium text-gold mb-1">NO CAMPAIGNS FOUND</h3>
        <p className="text-white/60 max-w-md">
          There are no campaigns available. Please check back later or contact the administrator.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => {
        const progress = campaignProgress[campaign.id]
        const isStarted = !!progress
        const currentEpisodeIndex = progress?.currentEpisodeIndex || 0
        const completedCount = progress?.completedEpisodes.length || 0
        const totalEpisodes = campaign.episodes.length
        const completionPercentage = Math.round((completedCount / totalEpisodes) * 100)

        return (
          <div key={campaign.id} className="wasteland-card overflow-hidden">
            <div className="h-32 bg-dark-gray relative border-b border-gold-dark">
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-gold/20" />
              </div>
              {isStarted && (
                <div className="absolute top-2 right-2 bg-gold text-black text-xs px-2 py-1 border border-black">
                  IN PROGRESS
                </div>
              )}
              {campaign.persistentProgress && (
                <div className="absolute top-2 left-2 bg-dark-gray text-gold text-xs px-2 py-1 border border-gold/30 flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  PERSISTENT PROGRESS
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-xs text-white/70">
                EPISODES: <span className="text-gold">{totalEpisodes}</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gold">{campaign.title}</h3>
                {campaign.allowCustomSkills && (
                  <div className="text-xs px-2 py-1 border border-gold/30 text-gold flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    CUSTOM SKILLS
                  </div>
                )}
              </div>
              <p className="text-sm text-white/80 mb-4 line-clamp-2">{campaign.description}</p>

              {isStarted && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">Progress</span>
                    <span className="text-gold">{completionPercentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill progress-bar-energy"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    Current Episode: {campaign.episodes[currentEpisodeIndex]?.title || "Unknown"}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-white/50">
                  {isStarted ? `${completedCount}/${totalEpisodes} completed` : "Not started"}
                </div>
                <button
                  className="wasteland-button flex items-center text-sm"
                  onClick={() => onSelectCampaign(campaign.id)}
                >
                  {isStarted ? "CONTINUE" : "START"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
