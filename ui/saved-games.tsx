"use client"

import type { SavedGame } from "@/types/save"
import { formatDate } from "@/lib/utils"
import { deleteSavedGame } from "@/lib/save-manager"
import { useState } from "react"
import { Trash2, Play, AlertTriangle, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SavedGamesProps {
  saves: SavedGame[]
  onLoadSave: (saveId: string) => void
  onDeleteSave: (saveId: string) => void
  itemVariants?: any
}

export function SavedGames({ saves, onLoadSave, onDeleteSave, itemVariants }: SavedGamesProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Default item variants if not provided
  const defaultItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const variants = itemVariants || defaultItemVariants

  if (saves.length === 0) {
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
        <h3 className="text-lg font-medium text-gold mb-1">NO SAVED GAMES</h3>
        <p className="text-white/60 max-w-md">
          You haven't saved any games yet. Start a new adventure and save your progress to see it here.
        </p>
      </motion.div>
    )
  }

  const handleDelete = async (saveId: string) => {
    setDeletingId(saveId)
    try {
      await deleteSavedGame(saveId)
      onDeleteSave(saveId)
    } catch (error) {
      console.error("Failed to delete save:", error)
    } finally {
      setDeletingId(null)
    }
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
      <AnimatePresence>
        {saves.map((save, index) => (
          <motion.div
            key={save.id}
            className="wasteland-card overflow-hidden animated-bg"
            variants={variants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px rgba(212, 175, 55, 0.2)",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHoveredId(save.id)}
            onMouseLeave={() => setHoveredId(null)}
            layout
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          >
            <div className="p-3 border-b border-gold-dark flex items-center justify-between">
              <div>
                <motion.h3
                  className="text-lg font-bold text-gold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  {save.name}
                </motion.h3>
                <motion.p
                  className="text-xs text-white/60 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(save.timestamp)}
                </motion.p>
              </div>
              <motion.div
                className="bg-dark-gray text-gold text-xs px-2 py-1 border border-gold/30"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                {save.episodeTitle}
              </motion.div>
            </div>

            <div className="p-4">
              <motion.div
                className="space-y-3 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">Health</span>
                    <span className="text-rust">{save.stats.health}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-bar-fill progress-bar-health"
                      initial={{ width: "0%" }}
                      animate={{ width: `${save.stats.health}%` }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.8, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">Energy</span>
                    <span className="text-gold">{save.stats.energy}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-bar-fill progress-bar-energy"
                      initial={{ width: "0%" }}
                      animate={{ width: `${save.stats.energy}%` }}
                      transition={{ delay: 0.6 + index * 0.05, duration: 0.8, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
              >
                <motion.button
                  className="p-2 rounded hover:bg-dark-gray text-rust hover:text-rust transition-colors disabled:opacity-50"
                  onClick={() => handleDelete(save.id)}
                  disabled={deletingId === save.id}
                  title="Delete save"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={hoveredId === save.id ? { rotate: [0, -10, 0] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>

                <motion.button
                  className="wasteland-button flex items-center text-sm"
                  onClick={() => onLoadSave(save.id)}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "var(--gold)",
                    color: "var(--black)",
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4 mr-1" />
                  LOAD GAME
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
