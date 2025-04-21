"use client"

import type { EpisodeSummary } from "@/types/episode"
import { CheckCircle, Clock, AlertTriangle, ChevronRight, Radiation, Skull, Shield, Sparkles } from "lucide-react"

interface EpisodeLibraryProps {
  episodes: EpisodeSummary[]
  onSelectEpisode: (saveId: undefined, episodeId: string) => void
}

export function EpisodeLibrary({ episodes, onSelectEpisode }: EpisodeLibraryProps) {
  if (episodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 rounded-full bg-dark-gray border-2 border-gold/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-gold/40" />
        </div>
        <h3 className="text-lg font-medium text-gold mb-1">NO EPISODES FOUND</h3>
        <p className="text-white/60 max-w-md">
          There are no episodes matching your current filters. Try adjusting your search or filter settings.
        </p>
      </div>
    )
  }

  // Assign difficulty and threat types to episodes
  const threatTypes = ["Radiation", "Bandits", "Mutants", "Starvation", "Unknown"]
  const difficulties = ["Easy", "Medium", "Hard", "Extreme"]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {episodes.map((episode, index) => {
        // Assign pseudo-random but consistent values based on episode id
        const threatIndex = episode.id.charCodeAt(0) % threatTypes.length
        const difficultyIndex = episode.id.charCodeAt(episode.id.length - 1) % difficulties.length
        const threatType = threatTypes[threatIndex]
        const difficulty = difficulties[difficultyIndex]

        return (
          <div key={episode.id} className="wasteland-card overflow-hidden">
            <div className="h-32 bg-dark-gray relative border-b border-gold-dark">
              <div className="absolute inset-0 flex items-center justify-center">
                {threatType === "Radiation" && <Radiation className="w-16 h-16 text-gold/20" />}
                {threatType === "Bandits" && <Skull className="w-16 h-16 text-gold/20" />}
                {threatType === "Mutants" && <AlertTriangle className="w-16 h-16 text-gold/20" />}
                {threatType === "Starvation" && <Clock className="w-16 h-16 text-gold/20" />}
                {threatType === "Unknown" && <Shield className="w-16 h-16 text-gold/20" />}
              </div>
              {episode.completed && (
                <div className="absolute top-2 right-2 bg-gold text-black text-xs px-2 py-1 border border-black">
                  COMPLETED
                </div>
              )}
              {episode.allowCustomSkills && (
                <div className="absolute top-2 left-2 bg-dark-gray text-gold text-xs px-2 py-1 border border-gold/30 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  CUSTOM SKILLS
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-xs text-white/70">
                THREAT TYPE: <span className="text-gold">{threatType}</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gold">{episode.title}</h3>
                <div className="text-xs px-2 py-1 border border-gold/30 text-gold">{difficulty}</div>
              </div>
              <p className="text-sm text-white/80 mb-4 line-clamp-2">{episode.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {episode.completed ? (
                    <CheckCircle className="w-4 h-4 text-gold mr-1.5" />
                  ) : episode.started ? (
                    <Clock className="w-4 h-4 text-rust mr-1.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-white/60 mr-1.5" />
                  )}
                  <span className="text-xs text-white/70">
                    {episode.completed ? "Completed" : episode.started ? "In Progress" : "Not Started"}
                  </span>
                </div>

                <div className="text-xs text-white/50">EST. SURVIVAL RATE: {70 - difficultyIndex * 15}%</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-white/50">REWARDS: HIGH</div>
                <button
                  className="wasteland-button flex items-center text-sm"
                  onClick={() => onSelectEpisode(undefined, episode.id)}
                >
                  {episode.started ? "CONTINUE" : "START"}
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
