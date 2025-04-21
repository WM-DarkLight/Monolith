"use client"

import type { SavedGame } from "@/types/save"
import { formatDate } from "@/lib/utils"
import { deleteSavedGame } from "@/lib/save-manager"
import { useState } from "react"
import { Trash2, Play, AlertTriangle, Clock } from "lucide-react"

interface SavedGamesProps {
  saves: SavedGame[]
  onLoadSave: (saveId: string) => void
  onDeleteSave: (saveId: string) => void
}

export function SavedGames({ saves, onLoadSave, onDeleteSave }: SavedGamesProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (saves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 rounded-full bg-dark-gray border-2 border-gold/30 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-gold/40" />
        </div>
        <h3 className="text-lg font-medium text-gold mb-1">NO SAVED GAMES</h3>
        <p className="text-white/60 max-w-md">
          You haven't saved any games yet. Start a new adventure and save your progress to see it here.
        </p>
      </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {saves.map((save) => (
        <div key={save.id} className="wasteland-card overflow-hidden">
          <div className="p-3 border-b border-gold-dark flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gold">{save.name}</h3>
              <p className="text-xs text-white/60 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(save.timestamp)}
              </p>
            </div>
            <div className="bg-dark-gray text-gold text-xs px-2 py-1 border border-gold/30">{save.episodeTitle}</div>
          </div>

          <div className="p-4">
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/70">Health</span>
                  <span className="text-rust">{save.stats.health}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill progress-bar-health"
                    style={{ width: `${save.stats.health}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/70">Energy</span>
                  <span className="text-gold">{save.stats.energy}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill progress-bar-energy"
                    style={{ width: `${save.stats.energy}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                className="p-2 rounded hover:bg-dark-gray text-rust hover:text-rust transition-colors disabled:opacity-50"
                onClick={() => handleDelete(save.id)}
                disabled={deletingId === save.id}
                title="Delete save"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <button className="wasteland-button flex items-center text-sm" onClick={() => onLoadSave(save.id)}>
                <Play className="w-4 h-4 mr-1" />
                LOAD GAME
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
