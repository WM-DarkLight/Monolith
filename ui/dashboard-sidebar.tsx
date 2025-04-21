"use client"

import { Book, Save, Info, LogOut, Map, Radio, Shield, Zap } from "lucide-react"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: "episodes" | "saves") => void
  episodeCount: number
  saveCount: number
}

export function DashboardSidebar({ activeTab, setActiveTab, episodeCount, saveCount }: DashboardSidebarProps) {
  return (
    <aside className="dashboard-sidebar border-r border-gold-dark bg-darker-gray">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-gold mb-3 px-3 flex items-center">
            <span className="mr-2">Navigation</span>
            <div className="h-px flex-grow bg-gold/30"></div>
          </h2>
          <nav>
            <ul className="space-y-1">
              <li>
                <button
                  className={`flex items-center w-full px-3 py-2 ${
                    activeTab === "episodes"
                      ? "bg-gold/20 text-gold border-l-2 border-gold"
                      : "text-white/70 hover:bg-dark-gray hover:text-white border-l-2 border-transparent"
                  } transition-colors`}
                  onClick={() => setActiveTab("episodes")}
                >
                  <Book className="w-5 h-5 mr-3" />
                  <span>Episodes</span>
                  <span className="ml-auto bg-dark-gray text-gold text-xs px-2 py-0.5 border border-gold/30">
                    {episodeCount}
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`flex items-center w-full px-3 py-2 ${
                    activeTab === "saves"
                      ? "bg-gold/20 text-gold border-l-2 border-gold"
                      : "text-white/70 hover:bg-dark-gray hover:text-white border-l-2 border-transparent"
                  } transition-colors`}
                  onClick={() => setActiveTab("saves")}
                >
                  <Save className="w-5 h-5 mr-3" />
                  <span>Saved Games</span>
                  <span className="ml-auto bg-dark-gray text-gold text-xs px-2 py-0.5 border border-gold/30">
                    {saveCount}
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-gold mb-3 px-3 flex items-center">
            <span className="mr-2">Survival Tools</span>
            <div className="h-px flex-grow bg-gold/30"></div>
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button className="wasteland-button py-2 text-sm flex flex-col items-center justify-center">
              <Map className="w-4 h-4 mb-1" />
              <span>Map</span>
            </button>
            <button className="wasteland-button py-2 text-sm flex flex-col items-center justify-center">
              <Radio className="w-4 h-4 mb-1" />
              <span>Radio</span>
            </button>
            <button className="wasteland-button py-2 text-sm flex flex-col items-center justify-center">
              <Shield className="w-4 h-4 mb-1" />
              <span>Defense</span>
            </button>
            <button className="wasteland-button py-2 text-sm flex flex-col items-center justify-center">
              <Zap className="w-4 h-4 mb-1" />
              <span>Power</span>
            </button>
          </div>
        </div>

        <div className="mt-auto">
          <div className="wasteland-container p-4 mb-4">
            <h3 className="text-sm font-medium text-gold mb-2 flex items-center">
              <span className="mr-2">SURVIVAL STATS</span>
              <div className="h-px flex-grow bg-gold/30"></div>
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white/70">Missions Completed:</span>
                  <span className="text-gold">2/5</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill progress-bar-energy" style={{ width: "40%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white/70">Supplies:</span>
                  <span className="text-rust">Low</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill progress-bar-health" style={{ width: "20%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white/70">Reputation:</span>
                  <span className="text-gold">Neutral</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill progress-bar-energy" style={{ width: "50%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gold-dark p-4">
        <div className="flex items-center justify-between">
          <button className="text-white/70 hover:text-gold flex items-center text-sm">
            <Info className="w-4 h-4 mr-2" />
            <span>Help</span>
          </button>
          <button className="text-white/70 hover:text-gold flex items-center text-sm">
            <LogOut className="w-4 h-4 mr-2" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
