"use client"
import { useState } from "react"
import type { Episode } from "@/types/episode"
import type { GameState } from "@/types/game"
import type { Campaign, CampaignProgress } from "@/types/campaign"
import { OptionsPanel } from "@/ui/options-panel"
import { StatsDisplay } from "@/ui/stats-display"
import { InventoryDisplay } from "@/ui/inventory-display"
import { SkillsDisplay } from "@/ui/skills-display"
import { PerksDisplay } from "@/ui/perks-display"
import { ReputationDisplay } from "@/ui/reputation-display"
import { PerkSelectionScreen } from "@/ui/perk-selection-screen"
import { TextDisplay } from "@/ui/text-display"
import { SaveGameModal } from "@/ui/save-game-modal"
import { deleteSavedGame } from "@/lib/save-manager"
import { Save, Map, Book, Clock, Radio, Shield, ChevronLeft, Award, BookOpen, Users, Skull } from "lucide-react"
import { ReputationManager } from "@/modules/reputation-manager"
import { DialoguePanel } from "@/ui/dialogue-panel"
import { DialogueManager } from "@/modules/dialogue-manager"
import type { NPC } from "@/types/dialogue"

interface GameUIProps {
  episode: Episode | null
  gameState: GameState
  onOptionSelect: (optionId: string, success?: boolean) => void
  onSaveGame: (saveName: string, slotId?: string) => Promise<string>
  onImportSave: (file: File) => void
  onUnlockPerk: (perkId: string) => void
  onEquipArtifact: (perkId: string) => void
  onUnequipArtifact: (perkId: string) => void
  currentSaveData: any
  saveError: string | null
  shouldPulseSaveIcon?: boolean
  onExit: () => void
  campaign?: Campaign | null
  campaignProgress?: CampaignProgress | null
  onUpdateGameState: (gameState: GameState) => void
}

export function GameUI(props: GameUIProps) {
  const {
    episode,
    gameState,
    onOptionSelect,
    onSaveGame,
    onImportSave,
    onUnlockPerk,
    onEquipArtifact,
    onUnequipArtifact,
    currentSaveData,
    saveError,
    shouldPulseSaveIcon,
    onExit,
    campaign,
    campaignProgress,
    onUpdateGameState,
  } = props
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const [showJournal, setShowJournal] = useState(() => {
    // Check if we have a saved preference in localStorage
    const savedPreference = typeof window !== "undefined" ? localStorage.getItem("showJournal") : null
    return savedPreference === "true"
  })
  const [showMap, setShowMap] = useState(false)
  const [showSkills, setShowSkills] = useState(true)
  const [showPerks, setShowPerks] = useState(false)
  const [showReputation, setShowReputation] = useState(false)
  const [showPerkSelection, setShowPerkSelection] = useState(false)

  if (!episode) {
    return <div className="text-gold text-center p-8">No episode loaded</div>
  }

  const handleSaveGame = async (saveName: string, slotId?: string) => {
    setSaveStatus("saving")
    try {
      await onSaveGame(saveName, slotId)
      setSaveStatus("success")
      setTimeout(() => {
        setIsSaveModalOpen(false)
        setSaveStatus("idle")
      }, 1500)
    } catch (error) {
      console.error("Failed to save game:", error)
      setSaveStatus("error")
    }
  }

  const handleDeleteSave = async (slotId: string) => {
    try {
      await deleteSavedGame(slotId)
      // No need to close modal, the slot will be refreshed
    } catch (error) {
      console.error("Failed to delete save:", error)
    }
  }

  const toggleJournal = () => {
    const newState = !showJournal
    setShowJournal(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem("showJournal", String(newState))
    }
  }

  // Calculate campaign progress if available
  const campaignInfo =
    campaign && campaignProgress
      ? {
          currentEpisodeIndex: campaignProgress.currentEpisodeIndex,
          totalEpisodes: campaign.episodes.length,
          completedEpisodes: campaignProgress.completedEpisodes.length,
          progress: Math.round((campaignProgress.completedEpisodes.length / campaign.episodes.length) * 100),
          currentEpisodeTitle: episode.title,
          campaignTitle: campaign.title,
        }
      : null

  return (
    <div className="wasteland-background min-h-screen">
      <div className="scan-line"></div>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1
              className="terminal-header text-3xl group cursor-pointer flex items-center"
              onClick={onExit}
              title="Return to Dashboard"
            >
              <ChevronLeft className="w-5 h-5 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              {episode.title}
              {gameState.currentSceneId &&
                episode.scenes &&
                episode.scenes[gameState.currentSceneId] &&
                episode.scenes[gameState.currentSceneId].title !== episode.title && (
                  <span className="ml-2 text-xl text-gold-light">
                    - {episode.scenes[gameState.currentSceneId].title}
                  </span>
                )}
            </h1>
            {campaignInfo && (
              <div className="flex items-center mt-1 text-sm text-white/60">
                <BookOpen className="w-3 h-3 mr-1 text-gold" />
                <span className="text-gold">{campaignInfo.campaignTitle}</span>
                <span className="mx-2">•</span>
                <span>
                  Episode {campaignInfo.currentEpisodeIndex + 1} of {campaignInfo.totalEpisodes}
                </span>
                <span className="mx-2">•</span>
                <span>{campaignInfo.progress}% complete</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 border border-gold-dark hover:bg-dark-gray text-white/70 hover:text-gold transition-colors relative"
              onClick={toggleJournal}
              title="Journal"
            >
              <Book className="w-5 h-5" />
              {gameState.history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"></span>
              )}
            </button>
            <button
              className="p-2 border border-gold-dark hover:bg-dark-gray text-white/70 hover:text-gold transition-colors"
              onClick={() => setShowMap(!showMap)}
              title="Map"
            >
              <Map className="w-5 h-5" />
            </button>
            <button
              className="p-2 border border-gold-dark hover:bg-dark-gray text-white/70 hover:text-gold transition-colors relative"
              onClick={() => setShowPerkSelection(true)}
              title="Perks"
            >
              <Award className="w-5 h-5" />
              {(gameState.perks?.perkPoints || 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"></span>
              )}
            </button>
            <button
              className="p-2 border border-gold-dark hover:bg-dark-gray text-white/70 hover:text-gold transition-colors z-10 relative"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowReputation(!showReputation)
              }}
              title="Reputation"
              type="button"
              style={{ pointerEvents: "auto" }}
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              className={`p-2 border border-gold-dark hover:bg-dark-gray text-white/70 hover:text-gold transition-colors relative group ${
                props.shouldPulseSaveIcon ? "pulse-save border-gold" : ""
              }`}
              onClick={() => setIsSaveModalOpen(true)}
              title="Save Game"
            >
              <Save className={`w-5 h-5 ${props.shouldPulseSaveIcon ? "text-gold" : ""}`} />
              <div className="absolute -bottom-8 right-0 bg-darker-gray border border-gold-dark px-2 py-1 text-xs text-gold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {props.shouldPulseSaveIcon ? "Important progress! Save your game" : "Save Game"}
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="wasteland-container p-6 mb-6">
              <div className="flex items-center justify-between mb-4 text-xs text-white/50">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>SESSION TIME: 00:45:12</span>
                </div>
                <div className="flex items-center">
                  <Radio className="w-3 h-3 mr-1" />
                  <span>SIGNAL STRENGTH: WEAK</span>
                </div>
              </div>

              {showPerks ? (
                <PerksDisplay
                  gameState={gameState}
                  onUnlockPerk={onUnlockPerk}
                  onEquipArtifact={onEquipArtifact}
                  onUnequipArtifact={onUnequipArtifact}
                />
              ) : showReputation && gameState.reputation ? (
                <ReputationDisplay reputation={gameState.reputation} />
              ) : (
                <>
                  <TextDisplay text={episode.text} />

                  {gameState.dialogueState?.isActive && episode?.npcs && gameState.dialogueState.currentNpcId && (
                    <DialoguePanel
                      npc={episode.npcs[gameState.dialogueState.currentNpcId]}
                      gameState={gameState}
                      onSelectResponse={(responseId) => {
                        const npc = episode.npcs?.[gameState.dialogueState?.currentNpcId || ""]
                        if (npc) {
                          const updatedState = DialogueManager.selectDialogueResponse(gameState, npc, responseId)
                          onUpdateGameState(updatedState)
                        }
                      }}
                      onEndDialogue={() => {
                        const updatedState = DialogueManager.endDialogue(gameState)
                        onUpdateGameState(updatedState)
                      }}
                    />
                  )}

                  <div className="mt-8">
                    {!gameState.dialogueState?.isActive && episode && (
                      <OptionsPanel
                        options={episode.options}
                        onSelect={onOptionSelect}
                        gameState={gameState}
                        npcs={
                          episode.currentSceneId && episode.scenes?.[episode.currentSceneId]?.availableNpcs
                            ? (episode.scenes[episode.currentSceneId].availableNpcs
                                .map((id) => episode.npcs?.[id])
                                .filter(Boolean) as NPC[])
                            : []
                        }
                        onStartDialogue={(npcId) => {
                          if (episode.npcs?.[npcId]) {
                            const updatedState = DialogueManager.startDialogue(gameState, episode.npcs[npcId])
                            onUpdateGameState(updatedState)
                          }
                        }}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            {campaignInfo && (
              <div className="wasteland-container p-4">
                <h3 className="terminal-header text-lg mb-3">CAMPAIGN PROGRESS</h3>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">Progress</span>
                    <span className="text-gold">{campaignInfo.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill progress-bar-energy"
                      style={{ width: `${campaignInfo.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-white/70">
                  <div className="flex justify-between mb-1">
                    <span>Current Episode:</span>
                    <span className="text-gold">
                      {campaignInfo.currentEpisodeIndex + 1}/{campaignInfo.totalEpisodes}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Episodes Completed:</span>
                    <span className="text-gold">{campaignInfo.completedEpisodes}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="wasteland-container p-4">
              <StatsDisplay stats={gameState.stats} />
            </div>

            <div className="wasteland-container p-4">
              <SkillsDisplay skills={gameState.skills} />
            </div>

            {gameState.reputation && (
              <div className="wasteland-container p-4">
                <h3 className="terminal-header text-lg mb-3 flex items-center justify-between">
                  <span>REPUTATION</span>
                  <button
                    className="text-xs text-gold/70 hover:text-gold"
                    onClick={() => setShowReputation(!showReputation)}
                    type="button"
                  >
                    {showReputation ? "HIDE" : "DETAILS"}
                  </button>
                </h3>
                <div className="flex items-center mb-2">
                  {gameState.reputation.generalAlignment === "lawful" ? (
                    <Shield className="w-4 h-4 mr-1.5 text-gold" />
                  ) : gameState.reputation.generalAlignment === "chaotic" ? (
                    <Skull className="w-4 h-4 mr-1.5 text-rust" />
                  ) : (
                    <Shield className="w-4 h-4 mr-1.5 text-white/70" />
                  )}
                  <span className="text-sm">ALIGNMENT: {gameState.reputation.generalAlignment.toUpperCase()}</span>
                </div>
                <div className="text-xs text-white/70 mb-2">
                  {Object.values(gameState.reputation.factions)
                    .filter((f) => !f.hidden)
                    .slice(0, 3)
                    .map((faction) => (
                      <div key={faction.id} className="flex justify-between items-center mb-1">
                        <span>{faction.name}:</span>
                        <span className={ReputationManager.getReputationColor(faction.level)}>
                          {faction.level.charAt(0).toUpperCase() + faction.level.slice(1)}
                        </span>
                      </div>
                    ))}
                  {Object.values(gameState.reputation.factions).filter((f) => !f.hidden).length > 3 && (
                    <div className="text-center text-xs text-gold/50 mt-1">
                      + {Object.values(gameState.reputation.factions).filter((f) => !f.hidden).length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="wasteland-container p-4">
              <InventoryDisplay inventory={gameState.inventory} />
            </div>

            {showJournal && (
              <div className="wasteland-container p-4">
                <h3 className="terminal-header text-lg mb-3">JOURNAL</h3>
                <div className="max-h-48 overflow-y-auto pr-1 space-y-3">
                  {gameState.history
                    .slice()
                    .reverse()
                    .map((entry, index) => (
                      <div key={index} className="text-xs border-l-2 border-gold/30 pl-2">
                        <div className="text-white/80">{entry.choiceText}</div>
                        <div className="text-white/40">{entry.episodeId}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {showMap && (
              <div className="wasteland-container p-4">
                <h3 className="terminal-header text-lg mb-3">AREA MAP</h3>
                <div className="aspect-square bg-darker-gray border border-gold-dark flex flex-col items-center justify-center">
                  <Shield className="w-8 h-8 text-gold/30 mb-2" />
                  <div className="text-white/30 text-xs text-center">MAP DATA CORRUPTED</div>
                  <div className="text-white/30 text-xs text-center">SIGNAL REQUIRED</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showPerkSelection && (
          <PerkSelectionScreen
            gameState={gameState}
            onUnlockPerk={onUnlockPerk}
            onClose={() => setShowPerkSelection(false)}
          />
        )}

        {isSaveModalOpen && (
          <SaveGameModal
            onSave={handleSaveGame}
            onCancel={() => setIsSaveModalOpen(false)}
            status={saveStatus}
            errorMessage={saveError || "An error occurred while saving the game."}
            currentSaveData={currentSaveData}
            onImport={onImportSave}
            onDelete={handleDeleteSave}
          />
        )}
      </div>
    </div>
  )
}
