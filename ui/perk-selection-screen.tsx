"use client"

import { useState } from "react"
import type { Perk } from "@/types/perks"
import type { GameState } from "@/types/game"
import { PerkManager } from "@/modules/perk-manager"
import { X, Search, Filter, Info } from "lucide-react"

interface PerkSelectionScreenProps {
  gameState: GameState
  onUnlockPerk: (perkId: string) => void
  onClose: () => void
}

export function PerkSelectionScreen({ gameState, onUnlockPerk, onClose }: PerkSelectionScreenProps) {
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showHelp, setShowHelp] = useState(false)

  const playerPerks = gameState.perks || PerkManager.DEFAULT_PLAYER_PERKS
  const allPerks = PerkManager.getAllPerks()
  const availablePerks = PerkManager.getAvailablePerks(gameState)

  // Filter perks based on category and search query
  const filteredPerks = allPerks.filter((perk) => {
    // Apply category filter
    if (categoryFilter && perk.category !== categoryFilter) {
      return false
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return perk.name.toLowerCase().includes(query) || perk.description.toLowerCase().includes(query)
    }

    return true
  })

  // Group perks by category
  const perksByCategory: Record<string, Perk[]> = {}
  filteredPerks.forEach((perk) => {
    if (!perksByCategory[perk.category]) {
      perksByCategory[perk.category] = []
    }
    perksByCategory[perk.category].push(perk)
  })

  // Get color class for perk rarity
  const getRarityColorClass = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-white"
      case "uncommon":
        return "text-gold"
      case "rare":
        return "text-accent-blue"
      case "legendary":
        return "text-accent-purple"
      default:
        return "text-white"
    }
  }

  // Check if player has unlocked a perk
  const hasPerk = (perkId: string) => {
    return !!playerPerks.unlockedPerks[perkId]
  }

  // Get perk rank
  const getPerkRank = (perkId: string) => {
    return playerPerks.unlockedPerks[perkId] || 0
  }

  // Check if perk is available to unlock
  const isPerkAvailable = (perkId: string) => {
    return availablePerks.some((p) => p.id === perkId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-auto">
      <div className="wasteland-container w-full max-w-4xl p-0 overflow-hidden animate-fadeIn m-4">
        <div className="bg-gold p-4 flex items-center justify-between relative z-10">
          <h2 className="text-black font-bold flex items-center">PERK SELECTION</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHelp(!showHelp)} className="text-black/70 hover:text-black p-1" title="Help">
              <Info className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-black/70 hover:text-black p-1 cursor-pointer" title="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {showHelp && (
            <div className="wasteland-card p-4 mb-4 bg-darker-gray">
              <h4 className="text-gold mb-2">PERK SYSTEM HELP</h4>
              <p className="text-white/70 text-sm mb-3">
                Perks are special abilities that provide unique bonuses and gameplay options. Unlock perks using perk
                points earned through gameplay.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-gold">Common Perks:</span> Basic abilities that enhance your character
                </li>
                <li>
                  <span className="text-gold">Uncommon Perks:</span> Specialized abilities with stronger effects
                </li>
                <li>
                  <span className="text-gold">Rare Perks:</span> Powerful abilities that can significantly change
                  gameplay
                </li>
                <li>
                  <span className="text-gold">Legendary Perks:</span> Extraordinary abilities with unique effects
                </li>
                <li>
                  <span className="text-rust">Artifacts:</span> Special items that provide bonuses but may have
                  drawbacks
                </li>
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="text-gold text-lg">
              Available Points: <span className="font-bold">{playerPerks.perkPoints}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search perks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="wasteland-input pl-3 pr-9 w-full"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={categoryFilter || ""}
                  onChange={(e) => setCategoryFilter(e.target.value || null)}
                  className="wasteland-input appearance-none pr-10"
                  style={{ minWidth: "140px", paddingRight: "2.5rem" }}
                >
                  <option value="">All Categories</option>
                  <option value="combat">Combat</option>
                  <option value="survival">Survival</option>
                  <option value="exploration">Exploration</option>
                  <option value="social">Social</option>
                  <option value="anomaly">Anomaly</option>
                  <option value="mutation">Mutation</option>
                  <option value="technical">Technical</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
            {Object.entries(perksByCategory).map(([category, perks]) => (
              <div key={category} className="wasteland-card p-3">
                <h4 className="text-gold uppercase mb-2">{category}</h4>

                <div className="space-y-2">
                  {perks.map((perk) => {
                    const isUnlocked = hasPerk(perk.id)
                    const isAvailable = isPerkAvailable(perk.id)
                    const rank = getPerkRank(perk.id)
                    const maxRank = perk.maxRank || 1

                    return (
                      <div
                        key={perk.id}
                        className={`p-2 border ${isUnlocked ? "border-gold" : isAvailable ? "border-gold-dark" : "border-gold-dark/50"} 
                        ${isUnlocked ? "bg-gold/10" : isAvailable ? "bg-dark-gray" : "bg-dark-gray/50"} 
                        cursor-pointer hover:bg-gold/5 transition-colors ${!isAvailable && !isUnlocked ? "opacity-60" : ""}`}
                        onClick={() => setSelectedPerk(perk)}
                      >
                        <div className="flex justify-between items-center">
                          <div className={`font-medium ${getRarityColorClass(perk.rarity)}`}>
                            {perk.name}
                            {perk.maxRank && perk.maxRank > 1 && (
                              <span className="text-white/50 ml-1">
                                {rank}/{maxRank}
                              </span>
                            )}
                          </div>
                          {perk.isArtifact && (
                            <div className="text-xs px-2 py-0.5 bg-darker-gray border border-rust/30 text-rust">
                              ARTIFACT
                            </div>
                          )}
                          {isUnlocked && (
                            <div className="text-xs px-2 py-0.5 bg-darker-gray border border-gold/30 text-gold">
                              UNLOCKED
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-white/70 mt-1 line-clamp-2">{perk.description}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedPerk && (
            <div className="mt-4 p-4 bg-dark-gray border border-gold/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`${getRarityColorClass(selectedPerk.rarity)} font-medium`}>{selectedPerk.name}</h4>
                <div className="text-xs px-2 py-0.5 bg-darker-gray border border-gold/30 uppercase">
                  {selectedPerk.category}
                </div>
              </div>

              <p className="text-sm text-white/80 mb-3">{selectedPerk.description}</p>

              {selectedPerk.effects && (
                <div className="mb-3">
                  <div className="text-xs text-gold mb-1">EFFECTS:</div>
                  <ul className="text-xs text-white/70 space-y-1 pl-4">
                    {selectedPerk.effects.stats &&
                      Object.entries(selectedPerk.effects.stats).map(([stat, value]) => (
                        <li key={stat} className="list-disc">
                          {stat.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:{" "}
                          {value > 0 ? "+" : ""}
                          {value}
                        </li>
                      ))}
                    {selectedPerk.effects.skills &&
                      Object.entries(selectedPerk.effects.skills).map(([skill, value]) => (
                        <li key={skill} className="list-disc">
                          {skill.charAt(0).toUpperCase() + skill.slice(1)}: {value > 0 ? "+" : ""}
                          {value}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {selectedPerk.drawbacks && (
                <div className="mb-3">
                  <div className="text-xs text-rust mb-1">DRAWBACKS:</div>
                  <ul className="text-xs text-white/70 space-y-1 pl-4">
                    {selectedPerk.drawbacks.stats &&
                      Object.entries(selectedPerk.drawbacks.stats).map(([stat, value]) => (
                        <li key={stat} className="list-disc">
                          {stat.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}: {value}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {selectedPerk.requirements && (
                <div className="mb-3">
                  <div className="text-xs text-white/50 mb-1">REQUIREMENTS:</div>
                  <ul className="text-xs text-white/70 space-y-1 pl-4">
                    {selectedPerk.requirements.level && (
                      <li className="list-disc">Level {selectedPerk.requirements.level}</li>
                    )}
                    {selectedPerk.requirements.skills &&
                      Object.entries(selectedPerk.requirements.skills).map(([skill, value]) => (
                        <li key={skill} className="list-disc">
                          {skill.charAt(0).toUpperCase() + skill.slice(1)} {value}+
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end mt-4">
                {hasPerk(selectedPerk.id) ? (
                  <div className="text-xs text-gold py-2">ALREADY UNLOCKED</div>
                ) : isPerkAvailable(selectedPerk.id) ? (
                  <button
                    className="wasteland-button"
                    onClick={() => onUnlockPerk(selectedPerk.id)}
                    disabled={playerPerks.perkPoints <= 0}
                  >
                    {playerPerks.perkPoints <= 0 ? "NO PERK POINTS" : "UNLOCK PERK"}
                  </button>
                ) : (
                  <div className="text-xs text-rust py-2">REQUIREMENTS NOT MET</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
