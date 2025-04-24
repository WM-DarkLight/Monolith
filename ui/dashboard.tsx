"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { EpisodeLibrary } from "@/ui/episode-library"
import { SavedGames } from "@/ui/saved-games"
import { CampaignLibrary } from "@/ui/campaign-library"
import { FolderManagement } from "@/ui/folder-management"
import { PetrovAssistant } from "@/ui/petrov-assistant"
import { getEpisodeList } from "@/lib/episode-service"
import { getSavedGames } from "@/lib/save-manager"
import { getCampaignList, getAllCampaignProgress } from "@/lib/campaign-service"
import { getFoldersWithEpisodes, getUnorganizedEpisodes } from "@/lib/folder-service"
import type { EpisodeSummary } from "@/types/episode"
import type { SavedGame } from "@/types/save"
import type { Campaign, CampaignProgress } from "@/types/campaign"
import type { FolderWithEpisodes } from "@/types/folder"
import { DashboardSidebar } from "@/ui/dashboard-sidebar"
import { DashboardHeader } from "@/ui/dashboard-header"
import { Search, Filter, SortDesc, SortAsc } from "lucide-react"
import { resetEpisodeDatabase } from "@/lib/db-reset"
import { AnimatePresence, motion } from "framer-motion"

interface DashboardProps {
  onStartGame: (saveId?: string, episodeId?: string) => void
  onStartCampaign: (campaignId: string) => void
  onStartCampaignEpisode?: (campaignId: string, episodeId: string) => void
}

export function Dashboard({ onStartGame, onStartCampaign, onStartCampaignEpisode }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"episodes" | "campaigns" | "saves" | "folders">("campaigns")
  const [previousTab, setPreviousTab] = useState<"episodes" | "campaigns" | "saves" | "folders">("campaigns")
  const [episodes, setEpisodes] = useState<EpisodeSummary[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [campaignProgress, setCampaignProgress] = useState<Record<string, CampaignProgress>>({})
  const [savedGames, setSavedGames] = useState<SavedGame[]>([])
  const [folders, setFolders] = useState<FolderWithEpisodes[]>([])
  const [unorganizedEpisodes, setUnorganizedEpisodes] = useState<EpisodeSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "in-progress" | "not-started">("all")
  const [foldersRefreshTrigger, setFoldersRefreshTrigger] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  // Animation variants for tab transitions
  const tabVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  }

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  // Determine direction for animations
  const getTabIndex = (tab: string) => {
    const tabs = ["campaigns", "episodes", "folders", "saves"]
    return tabs.indexOf(tab)
  }

  const handleTabChange = (newTab: "episodes" | "campaigns" | "saves" | "folders") => {
    if (newTab === activeTab) return

    setPreviousTab(activeTab)
    setIsTransitioning(true)

    // Scroll to top when changing tabs
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Short delay to allow animation to complete
    setTimeout(() => {
      setActiveTab(newTab)
      setIsTransitioning(false)
    }, 300)
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const episodeList = await getEpisodeList()
        setEpisodes(episodeList)

        const campaignList = await getCampaignList()
        setCampaigns(campaignList)

        const progress = await getAllCampaignProgress()
        const progressMap: Record<string, CampaignProgress> = {}
        progress.forEach((p) => {
          progressMap[p.campaignId] = p
        })
        setCampaignProgress(progressMap)

        const saves = await getSavedGames()
        setSavedGames(saves)

        // Load folders
        const foldersList = await getFoldersWithEpisodes(episodeList)
        setFolders(foldersList)

        // Load unorganized episodes
        const unorganized = await getUnorganizedEpisodes(episodeList)
        setUnorganizedEpisodes(unorganized)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [foldersRefreshTrigger])

  const handleFoldersChange = () => {
    // Trigger a refresh of folders data
    setFoldersRefreshTrigger((prev) => prev + 1)
  }

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

  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(query) || campaign.description.toLowerCase().includes(query),
      )
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
  }, [campaigns, searchQuery, sortOrder])

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

  const handleResetEpisodes = async () => {
    if (
      confirm(
        "This will reset the episodes database to include any new episodes. Your save games will not be affected. Continue?",
      )
    ) {
      setIsLoading(true)
      try {
        await resetEpisodeDatabase()
        const episodeList = await getEpisodeList()
        setEpisodes(episodeList)
      } catch (error) {
        console.error("Failed to reset episodes:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Calculate direction for animation
  const direction = getTabIndex(activeTab) - getTabIndex(previousTab)

  return (
    <div className="wasteland-background">
      <div className="scan-line"></div>
      <div className="dashboard-grid">
        <DashboardHeader />

        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          episodeCount={episodes.length}
          campaignCount={campaigns.length}
          saveCount={savedGames.length}
        />

        <main className="dashboard-main p-6" ref={mainRef}>
          <motion.div
            className="mb-6 flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="terminal-header text-2xl">
              {activeTab === "episodes"
                ? "EPISODE LIBRARY"
                : activeTab === "campaigns"
                  ? "CAMPAIGN LIBRARY"
                  : activeTab === "folders"
                    ? "EPISODE FOLDERS"
                    : "SAVED GAMES"}
            </h2>

            <div className="flex items-center gap-4">
              {activeTab === "episodes" && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={handleResetEpisodes}
                  className="wasteland-button bg-dark-gray text-xs"
                  title="Reset Episodes Database"
                >
                  REFRESH EPISODES
                </motion.button>
              )}

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="wasteland-input pl-3 pr-9"
                  style={{ minWidth: "180px" }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold w-4 h-4 pointer-events-none" />
              </motion.div>

              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
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
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
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
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {isLoading ? (
            <motion.div
              className="flex items-center justify-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-t-gold border-r-gold/30 border-b-gold/10 border-l-gold/60 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gold text-xs">LOADING</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={activeTab}
                custom={direction}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                {activeTab === "episodes" && (
                  <motion.div variants={containerVariants} initial="hidden" animate="show">
                    <EpisodeLibrary
                      episodes={filteredEpisodes}
                      onSelectEpisode={onStartGame}
                      itemVariants={itemVariants}
                    />
                  </motion.div>
                )}
                {activeTab === "campaigns" && (
                  <motion.div variants={containerVariants} initial="hidden" animate="show">
                    <CampaignLibrary
                      campaigns={filteredCampaigns}
                      campaignProgress={campaignProgress}
                      onSelectCampaign={onStartCampaign}
                      onSelectEpisode={onStartCampaignEpisode}
                      itemVariants={itemVariants}
                    />
                  </motion.div>
                )}
                {activeTab === "saves" && (
                  <motion.div variants={containerVariants} initial="hidden" animate="show">
                    <SavedGames
                      saves={filteredSaves}
                      onLoadSave={onStartGame}
                      onDeleteSave={handleDeleteSave}
                      itemVariants={itemVariants}
                    />
                  </motion.div>
                )}
                {activeTab === "folders" && (
                  <motion.div variants={containerVariants} initial="hidden" animate="show">
                    <FolderManagement
                      folders={folders}
                      unorganizedEpisodes={unorganizedEpisodes}
                      onFoldersChange={handleFoldersChange}
                      onSelectEpisode={onStartGame}
                    />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Add Petrov Assistant */}
      <PetrovAssistant />
    </div>
  )
}
