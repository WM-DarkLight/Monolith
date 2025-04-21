"use client"

import type { Skills } from "@/types/game"
import { SkillManager } from "@/modules/skill-manager"
import { Brain, Zap, Heart, Eye, Footprints, Sparkles } from "lucide-react"
import { useState } from "react"

interface SkillsDisplayProps {
  skills: Skills
}

export function SkillsDisplay({ skills }: SkillsDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getSkillIcon = (skillName: string) => {
    switch (skillName) {
      case "strength":
        return <Zap className="w-4 h-4 mr-1.5 text-gold" />
      case "intelligence":
        return <Brain className="w-4 h-4 mr-1.5 text-gold" />
      case "charisma":
        return <Heart className="w-4 h-4 mr-1.5 text-gold" />
      case "perception":
        return <Eye className="w-4 h-4 mr-1.5 text-gold" />
      case "agility":
        return <Footprints className="w-4 h-4 mr-1.5 text-gold" />
      case "luck":
        return <Sparkles className="w-4 h-4 mr-1.5 text-gold" />
      default:
        return <Zap className="w-4 h-4 mr-1.5 text-gold" />
    }
  }

  return (
    <div>
      <h3 className="terminal-header text-lg mb-3 flex items-center justify-between">
        <span>SKILLS</span>
        <button className="text-xs text-gold/70 hover:text-gold" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "HIDE" : "DETAILS"}
        </button>
      </h3>
      {/* Add this after the return statement, before the div with className="space-y-3" */}
      {/* Assuming gameState is available in this scope, otherwise it needs to be passed as a prop or accessed via context */}
      {/* For this example, I'm assuming it's available globally or via context */}
      <div className="space-y-3">
        {Object.entries(skills).map(([skillName, value]) => {
          const skillLevel = SkillManager.getSkillLevel(value)
          const skillColor = SkillManager.getSkillColor(value)
          // Assuming gameState is available in this scope
          const recentlyImproved = (window as any).gameState?.flags["skill_improved_recently"]

          return (
            <div key={skillName}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  {getSkillIcon(skillName)}
                  <span className="text-sm uppercase">
                    {skillName}
                    {recentlyImproved && <Sparkles className="inline-block w-3 h-3 ml-1 text-gold animate-pulse" />}
                  </span>
                </div>
                <span className={`text-sm ${skillColor}`}>{value}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill bg-gold" style={{ width: `${(value / 10) * 100}%` }}></div>
              </div>
              {showDetails && <div className="mt-1 text-xs text-white/70 text-right">{skillLevel}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
