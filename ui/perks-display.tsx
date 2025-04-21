"use client"

import { useState } from "react"
import type { Perk } from "@/types/perks"
import type { GameState } from "@/types/game"
import { PerkManager } from "@/modules/perk-manager"
import { Zap, Shield, Heart, Brain, Radiation, Star, AlertTriangle, Info, Filter, Search } from "lucide-react"

interface PerksDisplayProps {
  gameState: GameState
  onUnlockPerk: (perkId: string) => void
  onEquipArtifact: (perkId: string) => void
  onUnequipArtifact: (perkId: string) => void
}

export function PerksDisplay({ gameState, onUnlockPerk, onEquipArtifact, onUnequipArtifact }: PerksDisplayProps) {
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const playerPerks = gameState.perks || PerkManager.DEFAULT_PLAYER_PERKS
  const availablePerks = PerkManager.getAvailablePerks(gameState)

  // Filter perks based on category and search query
  const filteredPerks = availablePerks.filter((perk) => {
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

  // Get icon for perk category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "combat":
        return <Zap className="w-4 h-4 text-rust" />
      case "survival":
        return <Heart className="w-4 h-4 text-gold" />
      case "exploration":
        return <Star className="w-4 h-4 text-gold" />
      case "social":
        return <Brain className="w-4 h-4 text-gold" />
      case "anomaly":
        return <Radiation className="w-4 h-4 text-rust" />
      case "mutation":
        return <AlertTriangle className="w-4 h-4 text-rust" />
      case "technical":
        return <Shield className="w-4 h-4 text-gold" />
      default:
        return <Info className="w-4 h-4 text-gold" />
    }
  }

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

  // Check if artifact is equipped
  const isArtifactEquipped = (perkId: string) => {
    return playerPerks.equippedArtifacts.includes(perkId)
  }

  // Get perk rank
  const getPerkRank = (perkId: string) => {
    return playerPerks.unlockedPerks[perkId] || 0
  }

  return (
    <div className="wasteland-container p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="terminal-header text-lg">PERKS</h3>
        <div className="text-gold text-sm">
          POINTS: <span className="font-bold">{playerPerks.perkPoints}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-grow">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
        {Object.entries(perksByCategory).map(([category, perks]) => (
          <div key={category} className="wasteland-card p-3">
            <div className="flex items-center mb-2">
              {getCategoryIcon(category)}
              <h4 className="text-gold ml-2 uppercase">{category}</h4>
            </div>

            <div className="space-y-2">
              {perks.map((perk) => {
                const isUnlocked = hasPerk(perk.id)
                const isEquipped = perk.isArtifact && isArtifactEquipped(perk.id)
                const rank = getPerkRank(perk.id)
                const maxRank = perk.maxRank || 1

                return (
                  <div
                    key={perk.id}
                    className={`p-2 border ${isUnlocked ? "border-gold" : "border-gold-dark"} ${isEquipped ? "bg-gold/10" : "bg-dark-gray"} cursor-pointer hover:bg-gold/5 transition-colors`}
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
                {selectedPerk.effects.combat &&
                  Object.entries(selectedPerk.effects.combat).map(([stat, value]) => (
                    <li key={stat} className="list-disc">
                      {stat.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:{" "}
                      {value > 0 ? "+" : ""}
                      {value}%
                    </li>
                  ))}
                {selectedPerk.effects.abilities &&
                  Object.entries(selectedPerk.effects.abilities)
                    .filter(([_, value]) => value === true)
                    .map(([ability]) => (
                      <li key={ability} className="list-disc">
                        {ability.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
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
                {selectedPerk.drawbacks.skills &&
                  Object.entries(selectedPerk.drawbacks.skills).map(([skill, value]) => (
                    <li key={skill} className="list-disc">
                      {skill.charAt(0).toUpperCase() + skill.slice(1)}: {value}
                    </li>
                  ))}
                {selectedPerk.drawbacks.combat &&
                  Object.entries(selectedPerk.drawbacks.combat).map(([stat, value]) => (
                    <li key={stat} className="list-disc">
                      {stat.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}: {value}%
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
                {selectedPerk.requirements.perks &&
                  selectedPerk.requirements.perks.map((perkId) => {
                    const requiredPerk = PerkManager.getPerk(perkId)
                    return (
                      <li key={perkId} className="list-disc">
                        {requiredPerk?.name || perkId}
                      </li>
                    )
                  })}
              </ul>
            </div>
          )}

          <div className="flex justify-end mt-4">
            {selectedPerk.isArtifact ? (
              isArtifactEquipped(selectedPerk.id) ? (
                <button className="wasteland-button bg-dark-gray" onClick={() => onUnequipArtifact(selectedPerk.id)}>
                  UNEQUIP
                </button>
              ) : hasPerk(selectedPerk.id) ? (
                <button
                  className="wasteland-button"
                  onClick={() => onEquipArtifact(selectedPerk.id)}
                  disabled={playerPerks.equippedArtifacts.length >= playerPerks.artifactSlots}
                >
                  EQUIP
                </button>
              ) : (
                <button
                  className="wasteland-button"
                  onClick={() => onUnlockPerk(selectedPerk.id)}
                  disabled={playerPerks.perkPoints <= 0}
                >
                  UNLOCK
                </button>
              )
            ) : hasPerk(selectedPerk.id) && (selectedPerk.maxRank || 1) > getPerkRank(selectedPerk.id) ? (
              <button
                className="wasteland-button"
                onClick={() => onUnlockPerk(selectedPerk.id)}
                disabled={playerPerks.perkPoints <= 0}
              >
                RANK UP
              </button>
            ) : !hasPerk(selectedPerk.id) ? (
              <button
                className="wasteland-button"
                onClick={() => onUnlockPerk(selectedPerk.id)}
                disabled={playerPerks.perkPoints <= 0}
              >
                UNLOCK
              </button>
            ) : (
              <div className="text-xs text-gold py-2">MAXED OUT</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
