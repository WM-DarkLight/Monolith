"use client"

import { motion } from "framer-motion"
import type { EpisodeSummary } from "@/types/episode"
import { CheckCircle, Clock, AlertTriangle, ChevronRight, Radiation, Skull, Shield, Sparkles } from "lucide-react"

interface EpisodeLibraryProps {
  episodes: EpisodeSummary[]
  onSelectEpisode: (saveId: undefined, episodeId: string) => void
  itemVariants?: any
}

export function EpisodeLibrary({ episodes, onSelectEpisode, itemVariants }: EpisodeLibraryProps) {
  // Default item variants if not provided
  const defaultItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const variants = itemVariants || defaultItemVariants

  if (episodes.length === 0) {
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
        <h3 className="text-lg font-medium text-gold mb-1">NO EPISODES FOUND</h3>
        <p className="text-white/60 max-w-md">
          There are no episodes matching your current filters. Try adjusting your search or filter settings.
        </p>
      </motion.div>
    )
  }

  // Assign difficulty and threat types to episodes
  const threatTypes = ["Radiation", "Bandits", "Mutants", "Starvation", "Unknown"]
  const difficulties = ["Easy", "Medium", "Hard", "Extreme"]

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
      {episodes.map((episode, index) => {
        // Assign pseudo-random but consistent values based on episode id
        const threatIndex = episode.id.charCodeAt(0) % threatTypes.length
        const difficultyIndex = episode.id.charCodeAt(episode.id.length - 1) % difficulties.length
        const threatType = threatTypes[threatIndex]
        const difficulty = difficulties[difficultyIndex]

        return (
          <motion.div
            key={episode.id}
            className="wasteland-card overflow-hidden animated-bg"
            variants={variants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px rgba(212, 175, 55, 0.2)",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="h-32 bg-dark-gray relative border-b border-gold-dark">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.2 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                >
                  {threatType === "Radiation" && <Radiation className="w-16 h-16 text-gold/20" />}
                  {threatType === "Bandits" && <Skull className="w-16 h-16 text-gold/20" />}
                  {threatType === "Mutants" && <AlertTriangle className="w-16 h-16 text-gold/20" />}
                  {threatType === "Starvation" && <Clock className="w-16 h-16 text-gold/20" />}
                  {threatType === "Unknown" && <Shield className="w-16 h-16 text-gold/20" />}
                </motion.div>
              </div>
              {episode.completed && (
                <motion.div
                  className="absolute top-2 right-2 bg-gold text-black text-xs px-2 py-1 border border-black"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  COMPLETED
                </motion.div>
              )}
              {episode.allowCustomSkills && (
                <motion.div
                  className="absolute top-2 left-2 bg-dark-gray text-gold text-xs px-2 py-1 border border-gold/30 flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  CUSTOM SKILLS
                </motion.div>
              )}
              <motion.div
                className="absolute bottom-2 left-2 text-xs text-white/70"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                THREAT TYPE: <span className="text-gold">{threatType}</span>
              </motion.div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <motion.h3
                  className="text-xl font-bold text-gold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {episode.title}
                </motion.h3>
                <motion.div
                  className="text-xs px-2 py-1 border border-gold/30 text-gold"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  {difficulty}
                </motion.div>
              </div>
              <motion.p
                className="text-sm text-white/80 mb-4 line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                {episode.description}
              </motion.p>

              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className="flex items-center"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
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
                </motion.div>

                <motion.div
                  className="text-xs text-white/50"
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  EST. SURVIVAL RATE: {70 - difficultyIndex * 15}%
                </motion.div>
              </div>

              <div className="flex items-center justify-between">
                <motion.div
                  className="text-xs text-white/50"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  REWARDS: HIGH
                </motion.div>
                <motion.button
                  className="wasteland-button flex items-center text-sm"
                  onClick={() => onSelectEpisode(undefined, episode.id)}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {episode.started ? "CONTINUE" : "START"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
