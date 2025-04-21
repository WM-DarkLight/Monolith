"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/ui/dashboard"
import { GameEngine } from "@/core/engine"
import { initializeDatabase } from "@/lib/db"

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dbInitialized, setDbInitialized] = useState(false)
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string | undefined>()
  const [currentSaveId, setCurrentSaveId] = useState<string | undefined>()

  useEffect(() => {
    const setupDb = async () => {
      try {
        await initializeDatabase()
        setDbInitialized(true)
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
    setIsPlaying(true)
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
        />
      ) : (
        <Dashboard onStartGame={handleStartGame} />
      )}
    </main>
  )
}
