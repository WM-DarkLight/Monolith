"use client"

import { useState, useEffect } from "react"
import type { SkillCheckResult } from "@/types/game"
import { SkillManager } from "@/modules/skill-manager"
import { Check, X, Dices } from "lucide-react"

interface SkillCheckResultProps {
  result: SkillCheckResult
  onClose: () => void
}

export function SkillCheckResultDisplay({ result, onClose }: SkillCheckResultProps) {
  const [showResult, setShowResult] = useState(false)
  const [rolling, setRolling] = useState(true)
  const { success, skillName, playerValue, difficulty, bonusApplied, roll, luckBonus } = result

  // Simulate dice rolling animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setRolling(false)
      setShowResult(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Auto-close after showing result
  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showResult, onClose])

  const skillLevel = SkillManager.getSkillLevel(playerValue)
  const skillColor = SkillManager.getSkillColor(playerValue)

  // Calculate total score
  const totalScore = playerValue + (bonusApplied || 0) + (roll || 0) + (luckBonus || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="wasteland-container w-full max-w-md p-6 animate-fadeIn">
        <h2 className="terminal-header text-xl mb-4 text-center">SKILL CHECK</h2>

        <div className="flex items-center justify-center mb-6">
          <div className="text-lg uppercase mr-2">{skillName}:</div>
          <div className={`text-lg font-bold ${skillColor}`}>
            {playerValue} ({skillLevel})
          </div>
        </div>

        {rolling ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Dices className="w-16 h-16 text-gold animate-spin mb-4" />
            <div className="text-white/70">Rolling dice...</div>
          </div>
        ) : (
          <div className="text-center">
            <div className={`text-2xl font-bold mb-4 ${success ? "text-gold" : "text-rust"}`}>
              {success ? "SUCCESS!" : "FAILURE"}
            </div>

            <div className="flex items-center justify-center mb-6">
              {success ? (
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-gold" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-rust/20 flex items-center justify-center">
                  <X className="w-8 h-8 text-rust" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div className="text-right text-white/70">Base Skill:</div>
              <div className="text-left">{playerValue}</div>

              {roll !== undefined && (
                <>
                  <div className="text-right text-white/70">Dice Roll:</div>
                  <div className="text-left">+{roll}</div>
                </>
              )}

              {luckBonus !== undefined && luckBonus > 0 && (
                <>
                  <div className="text-right text-white/70">Luck Bonus:</div>
                  <div className="text-left">+{luckBonus}</div>
                </>
              )}

              {bonusApplied && (
                <>
                  <div className="text-right text-white/70">Item Bonus:</div>
                  <div className="text-left">+{bonusApplied}</div>
                </>
              )}

              <div className="text-right text-white/70 border-t border-gold/30 mt-1 pt-1">Total Score:</div>
              <div className="text-left border-t border-gold/30 mt-1 pt-1 font-bold">{totalScore}</div>

              <div className="text-right text-white/70">Difficulty:</div>
              <div className="text-left">{difficulty}</div>

              {success && result.skillName && (
                <>
                  <div className="text-right text-white/70 border-t border-gold/30 mt-3 pt-1 col-span-2"></div>
                  <div className="text-right text-gold col-span-2 mt-1">
                    <span className="animate-pulse">
                      ✨ {skillName.charAt(0).toUpperCase() + skillName.slice(1)} skill improved! ✨
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
