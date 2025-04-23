"use client"

import { useState } from "react"
import type { ReputationData } from "@/types/reputation"
import { ReputationManager } from "@/modules/reputation-manager"
import { Users, ChevronDown, ChevronUp, Shield, Skull, Cpu, ShoppingBag, Radiation } from "lucide-react"

interface ReputationDisplayProps {
  reputation: ReputationData
}

export function ReputationDisplay({ reputation }: ReputationDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null)

  // Get visible factions (not hidden)
  const visibleFactions = Object.values(reputation.factions).filter((faction) => !faction.hidden)

  // Get faction icon component
  const getFactionIcon = (factionId: string) => {
    switch (factionId) {
      case "wasteland-survivors":
        return <Users className="w-4 h-4 mr-1.5 text-gold" />
      case "tech-brotherhood":
        return <Cpu className="w-4 h-4 mr-1.5 text-accent-blue" />
      case "raiders":
        return <Skull className="w-4 h-4 mr-1.5 text-rust" />
      case "mutants":
        return <Radiation className="w-4 h-4 mr-1.5 text-accent-purple" />
      case "merchants-guild":
        return <ShoppingBag className="w-4 h-4 mr-1.5 text-gold" />
      default:
        return <Shield className="w-4 h-4 mr-1.5 text-white/70" />
    }
  }

  // Get alignment icon
  const getAlignmentIcon = () => {
    switch (reputation.generalAlignment) {
      case "lawful":
        return <Shield className="w-4 h-4 mr-1.5 text-gold" />
      case "chaotic":
        return <Skull className="w-4 h-4 mr-1.5 text-rust" />
      default:
        return <Shield className="w-4 h-4 mr-1.5 text-white/70" />
    }
  }

  // Get alignment description
  const getAlignmentDescription = () => {
    switch (reputation.generalAlignment) {
      case "lawful":
        return "You are generally seen as a force for good in the wasteland."
      case "chaotic":
        return "You are feared and mistrusted by most civilized communities."
      default:
        return "Your actions have not yet defined your reputation in the wasteland."
    }
  }

  // Calculate progress percentage for reputation bar
  const getReputationProgress = (value: number): number => {
    // Convert the -100 to 100 range to a 0-100% scale for the progress bar
    return ((value + 100) / 200) * 100
  }

  return (
    <div>
      <h3 className="terminal-header text-lg mb-3 flex items-center justify-between">
        <span>REPUTATION</span>
        <button
          className="text-xs text-gold/70 hover:text-gold"
          onClick={() => setShowDetails(!showDetails)}
          type="button"
        >
          {showDetails ? "HIDE" : "DETAILS"}
        </button>
      </h3>

      {/* General Alignment */}
      <div className="mb-4">
        <div className="flex items-center mb-1">
          {getAlignmentIcon()}
          <span className="text-sm">ALIGNMENT: {reputation.generalAlignment.toUpperCase()}</span>
        </div>
        <div className="text-xs text-white/70 mb-2">{getAlignmentDescription()}</div>
      </div>

      {/* Faction List */}
      <div className="space-y-3">
        {visibleFactions.map((faction) => (
          <div key={faction.id} className="mb-2">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setSelectedFaction(selectedFaction === faction.id ? null : faction.id)}
            >
              <div className="flex items-center">
                {getFactionIcon(faction.id)}
                <span className="text-sm">{faction.name}</span>
              </div>
              <div className="flex items-center">
                <span className={`text-sm ${ReputationManager.getReputationColor(faction.level)}`}>
                  {faction.level.charAt(0).toUpperCase() + faction.level.slice(1)}
                </span>
                {selectedFaction === faction.id ? (
                  <ChevronUp className="w-4 h-4 ml-1 text-white/50" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1 text-white/50" />
                )}
              </div>
            </div>

            <div className="mt-1 relative">
              <div className="reputation-bar h-2 bg-darker-gray border border-gold-dark/50 rounded-full overflow-hidden">
                <div
                  className={`h-full ${faction.currentValue >= 0 ? "bg-gold" : "bg-rust"}`}
                  style={{ width: `${getReputationProgress(faction.currentValue)}%` }}
                ></div>
              </div>
              {/* Center marker for neutral (0) position */}
              <div className="absolute top-0 left-1/2 w-px h-2 bg-white/50 -translate-x-1/2"></div>
            </div>

            {selectedFaction === faction.id && (
              <div className="mt-2 p-2 bg-dark-gray border border-gold/20 text-xs">
                <p className="text-white/70 mb-2">{faction.description}</p>
                <p className={`${ReputationManager.getReputationColor(faction.level)} mb-2`}>
                  {ReputationManager.getReputationDescription(faction.level)}
                </p>
                <p className="text-white/70 mb-2">Current Value: {faction.currentValue}</p>

                {showDetails && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/50">Trade Prices:</span>
                      <span className={faction.effects.tradePriceModifier <= 0 ? "text-gold" : "text-rust"}>
                        {faction.effects.tradePriceModifier > 0 ? "+" : ""}
                        {faction.effects.tradePriceModifier}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Special Dialogue:</span>
                      <span className={faction.effects.dialogueOptions ? "text-gold" : "text-white/30"}>
                        {faction.effects.dialogueOptions ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Faction Quests:</span>
                      <span className={faction.effects.questAvailability ? "text-gold" : "text-white/30"}>
                        {faction.effects.questAvailability ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Safe Passage:</span>
                      <span className={faction.effects.safePassage ? "text-gold" : "text-rust"}>
                        {faction.effects.safePassage ? "Granted" : "Denied"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Companions:</span>
                      <span className={faction.effects.companions ? "text-gold" : "text-white/30"}>
                        {faction.effects.companions ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Reputation Changes */}
      {showDetails && reputation.reputationEvents.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm text-gold mb-2">RECENT EVENTS</h4>
          <div className="max-h-32 overflow-y-auto pr-1">
            {reputation.reputationEvents
              .slice()
              .reverse()
              .slice(0, 5)
              .map((event, index) => {
                const faction = reputation.factions[event.factionId]
                return (
                  <div key={index} className="text-xs mb-2 border-l-2 border-gold/30 pl-2">
                    <div className="flex justify-between">
                      <span className={faction?.color || "text-white"}>{faction?.name}</span>
                      <span className={event.change >= 0 ? "text-gold" : "text-rust"}>
                        {event.change > 0 ? "+" : ""}
                        {event.change}
                      </span>
                    </div>
                    <div className="text-white/50">{event.reason}</div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
