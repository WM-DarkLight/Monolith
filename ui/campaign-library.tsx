"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Campaign, CampaignProgress } from "@/types/campaign"
import { AlertTriangle, ChevronDown, ChevronUp, ChevronRight, BookOpen, Award, Zap, Check, Lock } from "lucide-react"

interface CampaignLibraryProps {
  campaigns: Campaign[]
  campaignProgress: Record<string, CampaignProgress>
  onSelectCampaign: (campaignId: string) => void
  onSelectEpisode?: (campaignId: string, episodeId: string) => void
  itemVariants?: any
}

export function CampaignLibrary({
  campaigns,
  campaignProgress,
  onSelectCampaign,
  onSelectEpisode,
  itemVariants,
}: CampaignLibraryProps) {
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)

  // Default item variants if not provided
  const defaultItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const variants = itemVariants || defaultItemVariants

  if (campaigns.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-64 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-full bg-dark-gray border-2 border-gold/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-gold/40" />
        </div>
        <h3 className="text-lg font-medium text-gold mb-1">NO CAMPAIGNS FOUND</h3>
        <p className="text-white/60 max-w-md">
          There are no campaigns available. Please check back later or contact the administrator.
        </p>
      </motion.div>
    )
  }

  const toggleCampaignExpand = (campaignId: string) => {
    setExpandedCampaign(expandedCampaign === campaignId ? null : campaignId)
  }

  const handleEpisodeSelect = (campaignId: string, episodeId: string) => {
    if (onSelectEpisode) {
      onSelectEpisode(campaignId, episodeId)
    } else {
      // Fallback to selecting the whole campaign
      onSelectCampaign(campaignId)
    }
  }

  const isEpisodeUnlocked = (campaign: Campaign, episodeIndex: number, progress?: CampaignProgress) => {
    // First episode is always unlocked
    if (episodeIndex === 0) return true

    // If no progress, only first episode is unlocked
    if (!progress) return false

    // If campaign was ever completed, all episodes are unlocked
    if (progress.everCompleted) return true

    const episode = campaign.episodes[episodeIndex]

    // Check if previous episode is completed
    const previousEpisodeId = campaign.episodes[episodeIndex - 1]?.id
    if (previousEpisodeId && !progress.completedEpisodes.includes(previousEpisodeId)) {
      return false
    }

    // Check specific unlock conditions if they exist
    if (episode.unlockConditions) {
      // For now, we're just checking required episodes
      if (episode.unlockConditions.requiredEpisodes) {
        return episode.unlockConditions.requiredEpisodes.every((id) => progress.completedEpisodes.includes(id))
      }
    }

    return true
  }

  // Animation variants for episodes list
  const episodesListVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  const episodeItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  }

  // Animation for campaign cards
  const cardHoverAnimation = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(212, 175, 55, 0.2)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {campaigns.map((campaign, index) => {
        const progress = campaignProgress[campaign.id]
        const isStarted = !!progress
        const currentEpisodeIndex = progress?.currentEpisodeIndex || 0
        const completedCount = progress?.completedEpisodes.length || 0
        const totalEpisodes = campaign.episodes.length
        const completionPercentage = Math.min(100, Math.round((completedCount / totalEpisodes) * 100))
        const isExpanded = expandedCampaign === campaign.id
        const everCompleted = progress?.everCompleted || false

        return (
          <motion.div
            key={campaign.id}
            className="wasteland-card overflow-hidden animated-bg"
            variants={variants}
            whileHover={cardHoverAnimation.hover}
            whileTap={cardHoverAnimation.tap}
          >
            <motion.div
              className="h-32 bg-dark-gray relative border-b border-gold-dark cursor-pointer"
              onClick={() => toggleCampaignExpand(campaign.id)}
              whileHover={{ backgroundColor: "rgba(42, 42, 42, 0.8)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
              >
                <BookOpen className="w-16 h-16 text-gold/20" />
              </motion.div>

              {isStarted && (
                <motion.div
                  className="absolute top-2 right-2 bg-gold text-black text-xs px-2 py-1 border border-black"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {completedCount === totalEpisodes ? "COMPLETED" : everCompleted ? "MASTERED" : "IN PROGRESS"}
                </motion.div>
              )}

              {campaign.persistentProgress && (
                <motion.div
                  className="absolute top-2 left-2 bg-dark-gray text-gold text-xs px-2 py-1 border border-gold/30 flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Award className="w-3 h-3 mr-1" />
                  PERSISTENT PROGRESS
                </motion.div>
              )}

              <motion.div
                className="absolute bottom-2 left-2 text-xs text-white/70"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                EPISODES: <span className="text-gold">{totalEpisodes}</span>
              </motion.div>

              <motion.div
                className="absolute bottom-2 right-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gold" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gold" />
                )}
              </motion.div>
            </motion.div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <motion.h3
                  className="text-xl font-bold text-gold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {campaign.title}
                </motion.h3>

                {campaign.allowCustomSkills && (
                  <motion.div
                    className="text-xs px-2 py-1 border border-gold/30 text-gold flex items-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    CUSTOM SKILLS
                  </motion.div>
                )}
              </div>

              <motion.p
                className="text-sm text-white/80 mb-4 line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                {campaign.description}
              </motion.p>

              {isStarted && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">Progress</span>
                    <span className="text-gold">{completionPercentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-bar-fill progress-bar-energy"
                      initial={{ width: "0%" }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ delay: 0.7 + index * 0.05, duration: 0.8, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    Current Episode: {campaign.episodes[currentEpisodeIndex]?.title || "Unknown"}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between">
                <motion.div
                  className="text-xs text-white/50"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  {!isStarted
                    ? "Not started"
                    : completedCount === totalEpisodes
                      ? "COMPLETED"
                      : everCompleted
                        ? "ALL EPISODES UNLOCKED"
                        : `${completedCount}/${totalEpisodes} completed`}
                </motion.div>

                <motion.button
                  className="wasteland-button flex items-center text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    // If campaign is completed, call replayCampaign instead of onSelectCampaign directly
                    if (isStarted && completedCount === totalEpisodes) {
                      // We need to reset the campaign progress before starting it again
                      import("@/lib/campaign-service").then(({ replayCampaign }) => {
                        replayCampaign(campaign.id).then(() => {
                          onSelectCampaign(campaign.id)
                        })
                      })
                    } else {
                      onSelectCampaign(campaign.id)
                    }
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "var(--gold)",
                    color: "var(--black)",
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {!isStarted ? "START" : completedCount === totalEpisodes ? "REPLAY" : "CONTINUE"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>

              {/* Episode list when expanded */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="mt-4 border-t border-gold/20 pt-4"
                    variants={episodesListVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h4 className="text-sm text-gold mb-2">EPISODES</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      <AnimatePresence>
                        {campaign.episodes.map((episode, episodeIndex) => {
                          const isCompleted = progress?.completedEpisodes.includes(episode.id)
                          const isUnlocked = isEpisodeUnlocked(campaign, episodeIndex, progress)
                          const isCurrent = progress && progress.currentEpisodeIndex === episodeIndex

                          return (
                            <motion.div
                              key={episode.id}
                              className={`p-2 border ${
                                isCompleted
                                  ? "border-gold bg-gold/10"
                                  : isCurrent
                                    ? "border-gold-dark bg-gold/5"
                                    : "border-gold-dark/50 bg-dark-gray"
                              } ${!isUnlocked ? "opacity-60" : ""}`}
                              variants={episodeItemVariants}
                              whileHover={
                                isUnlocked
                                  ? {
                                      scale: 1.02,
                                      borderColor: "var(--gold)",
                                      backgroundColor: isCompleted
                                        ? "rgba(212, 175, 55, 0.15)"
                                        : "rgba(212, 175, 55, 0.05)",
                                    }
                                  : {}
                              }
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  {isCompleted ? (
                                    <Check className="w-4 h-4 text-gold mr-2" />
                                  ) : !isUnlocked ? (
                                    <Lock className="w-4 h-4 text-white/50 mr-2" />
                                  ) : (
                                    <div className="w-4 h-4 mr-2"></div>
                                  )}
                                  <span
                                    className={`text-sm ${isCompleted ? "text-gold" : !isUnlocked ? "text-white/50" : "text-white"}`}
                                  >
                                    {episodeIndex + 1}. {episode.title || `Episode ${episodeIndex + 1}`}
                                  </span>
                                </div>
                                {isUnlocked && (
                                  <motion.button
                                    className="text-xs px-2 py-1 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEpisodeSelect(campaign.id, episode.id)
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {isCompleted ? "REPLAY" : isCurrent ? "CONTINUE" : "PLAY"}
                                  </motion.button>
                                )}
                              </div>
                              {episode.description && (
                                <motion.p
                                  className="text-xs text-white/60 mt-1 ml-6"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  {episode.description}
                                </motion.p>
                              )}
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
