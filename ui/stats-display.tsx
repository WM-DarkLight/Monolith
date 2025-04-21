"use client"

import type { Stats } from "@/types/game"
import { Heart, Zap, Shield, Radiation } from "lucide-react"
import { useState } from "react"

interface StatsDisplayProps {
  stats: Stats
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div>
      <h3 className="terminal-header text-lg mb-3 flex items-center justify-between">
        <span>VITAL SIGNS</span>
        <button className="text-xs text-gold/70 hover:text-gold" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "HIDE" : "DETAILS"}
        </button>
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1.5 text-rust" />
              <span className="text-sm">HEALTH</span>
            </div>
            <span className="text-rust text-sm">{stats.health}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill progress-bar-health" style={{ width: `${stats.health}%` }}></div>
          </div>
          {showDetails && (
            <div className="mt-1 grid grid-cols-3 gap-1 text-xs">
              <div className="flex flex-col items-center">
                <span className="text-white/50">WOUNDS</span>
                <span className="text-rust">MINOR</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white/50">INFECTION</span>
                <span className="text-gold">NONE</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white/50">PAIN</span>
                <span className="text-rust">LOW</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1.5 text-gold" />
              <span className="text-sm">ENERGY</span>
            </div>
            <span className="text-gold text-sm">{stats.energy}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill progress-bar-energy" style={{ width: `${stats.energy}%` }}></div>
          </div>
          {showDetails && (
            <div className="mt-1 grid grid-cols-3 gap-1 text-xs">
              <div className="flex flex-col items-center">
                <span className="text-white/50">HUNGER</span>
                <span className="text-gold">LOW</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white/50">THIRST</span>
                <span className="text-rust">HIGH</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white/50">FATIGUE</span>
                <span className="text-gold">MED</span>
              </div>
            </div>
          )}
        </div>

        {showDetails && (
          <>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1.5 text-white/70" />
                  <span className="text-sm">ARMOR</span>
                </div>
                <span className="text-white/70 text-sm">25%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill bg-white/50" style={{ width: `25%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Radiation className="w-4 h-4 mr-1.5 text-rust" />
                  <span className="text-sm">RADIATION</span>
                </div>
                <span className="text-rust text-sm">15%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill bg-rust" style={{ width: `15%` }}></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
