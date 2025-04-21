"use client"

import { useState, useEffect } from "react"
import type { Skills } from "@/types/game"
import type { Episode } from "@/types/episode"
import { SkillManager } from "@/modules/skill-manager"
import { Brain, Zap, Heart, Eye, Footprints, Sparkles, Info, Save, RotateCcw } from "lucide-react"

interface CharacterCreationProps {
  episode: Episode
  onComplete: (skills: Skills) => void
  onCancel: () => void
}

export function CharacterCreation({ episode, onComplete, onCancel }: CharacterCreationProps) {
  const DEFAULT_SKILLS = SkillManager.DEFAULT_SKILLS
  const [skills, setSkills] = useState<Skills>({ ...DEFAULT_SKILLS })
  const [remainingPoints, setRemainingPoints] = useState(episode.skillPoints || 10)
  const [initialPoints] = useState(episode.skillPoints || 10)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  // Initialize with recommended skills if provided
  useEffect(() => {
    if (episode.recommendedSkills) {
      const recommendedBuild = {
        ...DEFAULT_SKILLS,
        ...episode.recommendedSkills,
      }
      setSkills(recommendedBuild)

      // Calculate remaining points
      const usedPoints = Object.values(recommendedBuild).reduce((sum, value) => sum + (value - 5), 0)
      setRemainingPoints(initialPoints - usedPoints)
    }
  }, [episode.recommendedSkills, initialPoints])

  const handleSkillChange = (skillName: keyof Skills, increment: boolean) => {
    const currentValue = skills[skillName]

    if (increment) {
      // Cannot increase if at max or no points remaining
      if (currentValue >= 10 || remainingPoints <= 0) return

      setSkills({
        ...skills,
        [skillName]: currentValue + 1,
      })
      setRemainingPoints(remainingPoints - 1)
    } else {
      // Cannot decrease below 1
      if (currentValue <= 1) return

      setSkills({
        ...skills,
        [skillName]: currentValue - 1,
      })
      setRemainingPoints(remainingPoints + 1)
    }
  }

  const resetSkills = () => {
    setSkills({ ...DEFAULT_SKILLS })
    setRemainingPoints(initialPoints)
    setSelectedPreset(null)
  }

  const getSkillIcon = (skillName: string) => {
    switch (skillName) {
      case "strength":
        return <Zap className="w-5 h-5 text-gold" />
      case "intelligence":
        return <Brain className="w-5 h-5 text-gold" />
      case "charisma":
        return <Heart className="w-5 h-5 text-gold" />
      case "perception":
        return <Eye className="w-5 h-5 text-gold" />
      case "agility":
        return <Footprints className="w-5 h-5 text-gold" />
      case "luck":
        return <Sparkles className="w-5 h-5 text-gold" />
      default:
        return <Zap className="w-5 h-5 text-gold" />
    }
  }

  const getSkillDescription = (skillName: string) => {
    switch (skillName) {
      case "strength":
        return "Physical power. Affects combat, intimidation, and carrying capacity."
      case "intelligence":
        return "Mental acuity. Affects hacking, science, and problem-solving."
      case "charisma":
        return "Social influence. Affects persuasion, bartering, and leadership."
      case "perception":
        return "Environmental awareness. Affects detection, accuracy, and finding hidden items."
      case "agility":
        return "Physical dexterity. Affects stealth, lockpicking, and reflexes."
      case "luck":
        return "Fortune and chance. Affects critical successes, rare finds, and random events."
      default:
        return "Unknown skill."
    }
  }

  // Character build presets
  const presets = [
    {
      id: "survivor",
      name: "Survivor",
      description: "Balanced skills with focus on perception and agility",
      skills: {
        strength: 5,
        intelligence: 4,
        charisma: 3,
        perception: 7,
        agility: 7,
        luck: 4,
      },
    },
    {
      id: "scholar",
      name: "Scholar",
      description: "High intelligence and perception, low physical attributes",
      skills: {
        strength: 3,
        intelligence: 9,
        charisma: 6,
        perception: 7,
        agility: 2,
        luck: 3,
      },
    },
    {
      id: "brute",
      name: "Brute",
      description: "High strength and endurance, low social skills",
      skills: {
        strength: 9,
        intelligence: 3,
        charisma: 2,
        perception: 4,
        agility: 6,
        luck: 6,
      },
    },
    {
      id: "diplomat",
      name: "Diplomat",
      description: "High charisma and intelligence, average physical skills",
      skills: {
        strength: 4,
        intelligence: 7,
        charisma: 9,
        perception: 5,
        agility: 3,
        luck: 2,
      },
    },
  ]

  const applyPreset = (preset: (typeof presets)[0]) => {
    setSkills({ ...preset.skills })
    setSelectedPreset(preset.id)

    // Calculate remaining points
    const usedPoints = Object.values(preset.skills).reduce((sum, value) => sum + (value - 5), 0)
    setRemainingPoints(initialPoints - usedPoints)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-auto">
      <div className="wasteland-container w-full p-0 overflow-hidden animate-fadeIn">
        <div className="bg-gold p-4 flex items-center justify-between">
          <h2 className="text-black font-bold flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            CHARACTER CREATION
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHelp(!showHelp)} className="text-black/70 hover:text-black p-1" title="Help">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="terminal-header text-xl mb-2">{episode.title}</h3>
            <p className="text-white/70 mb-4">{episode.description}</p>

            {showHelp && (
              <div className="wasteland-card p-4 mb-4 bg-darker-gray">
                <h4 className="text-gold mb-2">SKILL INFORMATION</h4>
                <p className="text-white/70 text-sm mb-3">
                  Customize your character by allocating skill points. Each skill affects different aspects of gameplay
                  and unlocks unique options.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-gold">Strength:</span> Physical power for combat and intimidation
                  </li>
                  <li>
                    <span className="text-gold">Intelligence:</span> Mental acuity for problem-solving and technology
                  </li>
                  <li>
                    <span className="text-gold">Charisma:</span> Social influence for persuasion and leadership
                  </li>
                  <li>
                    <span className="text-gold">Perception:</span> Awareness for finding hidden items and details
                  </li>
                  <li>
                    <span className="text-gold">Agility:</span> Dexterity for stealth and reflexes
                  </li>
                  <li>
                    <span className="text-gold">Luck:</span> Fortune for critical successes and rare finds
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="wasteland-container p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="terminal-header text-lg">SKILLS</h3>
                  <div className="text-gold text-sm">
                    POINTS REMAINING: <span className="font-bold">{remainingPoints}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(skills).map(([skillName, value]) => {
                    const skillLevel = SkillManager.getSkillLevel(value)
                    const skillColor = SkillManager.getSkillColor(value)

                    return (
                      <div key={skillName} className="wasteland-card p-3 bg-dark-gray">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {getSkillIcon(skillName)}
                            <span className="ml-2 uppercase">{skillName}</span>
                          </div>
                          <div className="flex items-center">
                            <button
                              className="w-6 h-6 flex items-center justify-center border border-gold/30 text-gold hover:bg-gold hover:text-black disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gold"
                              onClick={() => handleSkillChange(skillName as keyof Skills, false)}
                              disabled={value <= 1}
                            >
                              -
                            </button>
                            <span className={`mx-3 font-bold ${skillColor}`}>{value}</span>
                            <button
                              className="w-6 h-6 flex items-center justify-center border border-gold/30 text-gold hover:bg-gold hover:text-black disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gold"
                              onClick={() => handleSkillChange(skillName as keyof Skills, true)}
                              disabled={value >= 10 || remainingPoints <= 0}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill bg-gold" style={{ width: `${(value / 10) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-white/50">{getSkillDescription(skillName)}</span>
                          <span className="text-xs text-gold/70">{skillLevel}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="wasteland-container p-4 mb-6">
                <h3 className="terminal-header text-lg mb-4">PRESETS</h3>
                <div className="space-y-3">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      className={`wasteland-card p-3 text-left w-full transition-all ${selectedPreset === preset.id ? "border-gold" : "border-gold-dark"}`}
                      onClick={() => applyPreset(preset)}
                    >
                      <div className="text-gold font-bold">{preset.name}</div>
                      <div className="text-xs text-white/70 mt-1">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {episode.recommendedSkills && (
                <div className="wasteland-container p-4 mb-6">
                  <h3 className="terminal-header text-lg mb-2">EPISODE RECOMMENDATION</h3>
                  <p className="text-xs text-white/70 mb-3">
                    This episode recommends specific skills for optimal gameplay experience.
                  </p>
                  <button
                    className="wasteland-button w-full"
                    onClick={() => {
                      setSkills({
                        ...DEFAULT_SKILLS,
                        ...episode.recommendedSkills,
                      })
                      setSelectedPreset(null)

                      // Calculate remaining points
                      const recommendedBuild = {
                        ...DEFAULT_SKILLS,
                        ...episode.recommendedSkills,
                      }
                      const usedPoints = Object.values(recommendedBuild).reduce((sum, value) => sum + (value - 5), 0)
                      setRemainingPoints(initialPoints - usedPoints)
                    }}
                  >
                    USE RECOMMENDED
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6 mb-4 px-2">
            <button className="wasteland-button bg-dark-gray flex items-center" onClick={resetSkills}>
              <RotateCcw className="w-4 h-4 mr-2" />
              RESET
            </button>

            <div className="flex gap-3">
              <button className="wasteland-button bg-dark-gray" onClick={onCancel}>
                CANCEL
              </button>
              <button className="wasteland-button flex items-center" onClick={() => onComplete(skills)}>
                <Save className="w-4 h-4 mr-2" />
                CONFIRM CHARACTER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
