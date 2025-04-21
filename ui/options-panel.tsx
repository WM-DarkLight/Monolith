"use client"
import { useState } from "react"
import type { Option } from "@/types/episode"
import type { GameState, SkillCheckResult } from "@/types/game"
import { checkOptionCondition, performSkillCheck } from "@/lib/condition-checker"
import { ChevronRight, Dices } from "lucide-react"
import { SkillCheckResultDisplay } from "@/ui/skill-check-result"
import { SkillManager } from "@/modules/skill-manager"

interface OptionsPanelProps {
  options: Option[]
  onSelect: (optionId: string, success?: boolean) => void
  gameState: GameState
}

export function OptionsPanel({ options, onSelect, gameState }: OptionsPanelProps) {
  const [skillCheckResult, setSkillCheckResult] = useState<SkillCheckResult | null>(null)
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null)

  // Filter options based on conditions
  const availableOptions = options.filter(
    (option) => !option.condition || checkOptionCondition(option.condition, gameState),
  )

  if (availableOptions.length === 0) {
    return <div className="text-gold italic text-center py-4">NO OPTIONS AVAILABLE...</div>
  }

  const handleOptionClick = (option: Option) => {
    // If the option has a skill check, perform it
    if (option.skillCheck) {
      const result = performSkillCheck(option.skillCheck, gameState)
      setSkillCheckResult(result)
      setPendingOptionId(option.id)
    } else {
      // Otherwise, just select the option
      onSelect(option.id)
    }
  }

  const handleSkillCheckClose = () => {
    if (pendingOptionId && skillCheckResult) {
      onSelect(pendingOptionId, skillCheckResult.success)
      setPendingOptionId(null)
    }
    setSkillCheckResult(null)
  }

  return (
    <div className="space-y-4">
      <h3 className="terminal-header text-xl text-center mb-4">WHAT WILL YOU DO?</h3>

      <div className="flex flex-col space-y-3">
        {availableOptions.map((option) => {
          // Determine if this option has a skill check
          const hasSkillCheck = !!option.skillCheck
          const skillName = option.skillCheck?.skill
          const skillValue = skillName ? gameState.skills[skillName] : 0
          const difficulty = option.skillCheck?.difficulty || 0

          // Calculate success probability
          const successProbability = hasSkillCheck ? SkillManager.getSkillCheckProbability(skillValue, difficulty) : 100

          // Determine difficulty category based on probability
          let difficultyCategory: string
          let colorClass: string

          if (successProbability >= 95) {
            difficultyCategory = "Likely to succeed"
            colorClass = "text-gold"
          } else if (successProbability >= 70) {
            difficultyCategory = "Favorable"
            colorClass = "text-gold-dark"
          } else if (successProbability >= 40) {
            difficultyCategory = "Challenging"
            colorClass = "text-gold-dark"
          } else if (successProbability > 0) {
            difficultyCategory = "Unlikely to succeed"
            colorClass = "text-rust"
          } else {
            difficultyCategory = "Impossible"
            colorClass = "text-rust/50"
          }

          // Determine button styling based on skill check difficulty
          let buttonClass = "wasteland-card p-3 text-left hover:border-gold transition-all duration-300 group"
          let textClass = "flex-grow terminal-text"

          if (hasSkillCheck) {
            if (successProbability === 0) {
              buttonClass += " opacity-50 cursor-not-allowed"
              textClass += " text-white/50"
            } else if (successProbability < 40) {
              buttonClass += " opacity-70"
              textClass += " text-white/70"
            }
          }

          return (
            <button
              key={option.id}
              className={buttonClass}
              onClick={() => handleOptionClick(option)}
              disabled={hasSkillCheck && successProbability === 0}
            >
              <div className="flex items-center">
                <span className={textClass}>{option.text}</span>
                {hasSkillCheck ? (
                  <div
                    className={`flex items-center bg-darker-gray px-2 py-1 border ${successProbability >= 70 ? "border-gold/30" : successProbability >= 40 ? "border-gold-dark/30" : "border-rust/30"} ml-2`}
                  >
                    <Dices
                      className={`w-4 h-4 ${successProbability >= 70 ? "text-gold" : successProbability >= 40 ? "text-gold-dark" : "text-rust"} mr-1`}
                    />
                    <span className={`text-xs ${SkillManager.getSkillColor(skillValue)}`}>
                      {skillName?.toUpperCase()} {skillValue}
                    </span>
                    <span
                      className={`text-xs ${successProbability >= 70 ? "text-gold" : successProbability >= 40 ? "text-gold-dark" : "text-rust"} ml-1`}
                    >
                      ({difficulty})
                    </span>
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gold/50 group-hover:text-gold transition-colors ml-2 opacity-0 group-hover:opacity-100" />
                )}
              </div>

              {hasSkillCheck && (
                <div className="mt-1 text-xs text-right flex justify-end items-center">
                  <span className={colorClass}>{difficultyCategory}</span>
                  {successProbability > 0 && successProbability < 100 && (
                    <span className="ml-2 bg-darker-gray px-1.5 py-0.5 text-xs text-white/70 border border-gold/20">
                      {successProbability}%
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {skillCheckResult && <SkillCheckResultDisplay result={skillCheckResult} onClose={handleSkillCheckClose} />}
    </div>
  )
}
