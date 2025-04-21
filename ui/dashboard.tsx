"use client"

import { useState, useEffect, useMemo } from "react"
import { EpisodeLibrary } from "@/ui/episode-library"
import { SavedGames } from "@/ui/saved-games"
import { getEpisodeList } from "@/lib/episode-service"
import { getSavedGames } from "@/lib/save-manager"
import type { EpisodeSummary } from "@/types/episode"
import type { SavedGame } from "@/types/save"
import { DashboardSidebar } from "@/ui/dashboard-sidebar"
import { DashboardHeader } from "@/ui/dashboard-header"
import { Search, Filter, SortDesc, SortAsc } from "lucide-react"

interface DashboardProps {
  onStartGame: (saveId?: string, episodeId?: string) => void
}

export function Dashboard({ onStartGame }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"episodes" | "saves">("episodes")
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([])
  const [savedGames, setSavedGames] = useState<SavedGame[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "in-progress" | "not-started">("all")

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const episodeList = await getEpisodeList()
        setEpisodes(episodeList)

        const saves = await getSavedGames()
        setSavedGames(saves)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredEpisodes = useMemo(() => {
    let result = [...episodes]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (episode) => episode.title.toLowerCase().includes(query) || episode.description.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((episode) => {
        if (filterStatus === "completed") return episode.completed
        if (filterStatus === "in-progress") return episode.started && !episode.completed
        if (filterStatus === "not-started") return !episode.started
        return true
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title)
      } else {
        return b.title.localeCompare(a.title)
      }
    })

    return result
  }, [episodes, searchQuery, filterStatus, sortOrder])

  const filteredSaves = useMemo(() => {
    let result = [...savedGames]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (save) => save.name.toLowerCase().includes(query) || save.episodeTitle.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      } else {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
    })

    return result
  }, [savedGames, searchQuery, sortOrder])

  const handleDeleteSave = (id: string) => {
    setSavedGames(savedGames.filter((save) => save.id !== id))
  }

  return (
    <div className="wasteland-background">
      <div className="scan-line"></div>
      <div className="dashboard-grid">
        <DashboardHeader />

        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          episodeCount={episodes.length}
          saveCount={savedGames.length}
        />

        <main className="dashboard-main p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="terminal-header text-2xl">{activeTab === "episodes" ? "EPISODE LIBRARY" : "SAVED GAMES"}</h2>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="wasteland-input pl-3 pr-9"
                  style={{ minWidth: "180px" }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold w-4 h-4 pointer-events-none" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-2 rounded hover:bg-dark-gray transition-colors"
                  title={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-5 h-5 text-gold" />
                  ) : (
                    <SortDesc className="w-5 h-5 text-gold" />
                  )}
                </button>

                {activeTab === "episodes" && (
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="wasteland-input appearance-none pr-10"
                      style={{ minWidth: "140px", paddingRight: "2.5rem" }}
                    >
                      <option value="all">All Episodes</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="not-started">Not Started</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold w-4 h-4 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-t-gold border-r-gold/30 border-b-gold/10 border-l-gold/60 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gold text-xs">LOADING</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {activeTab === "episodes" && <EpisodeLibrary episodes={filteredEpisodes} onSelectEpisode={onStartGame} />}
              {activeTab === "saves" && (
                <SavedGames saves={filteredSaves} onLoadSave={onStartGame} onDeleteSave={handleDeleteSave} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
