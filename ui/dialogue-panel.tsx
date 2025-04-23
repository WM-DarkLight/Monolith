"use client"
import { useState, useEffect } from "react"
import type { DialogueNode, DialogueResponse, NPC } from "@/types/dialogue"
import type { GameState } from "@/types/game"
import { DialogueManager } from "@/modules/dialogue-manager"
import { ChevronRight } from "lucide-react"

interface DialoguePanelProps {
  npc: NPC
  gameState: GameState
  onSelectResponse: (responseId: string) => void
  onEndDialogue: () => void
}

export function DialoguePanel({ npc, gameState, onSelectResponse, onEndDialogue }: DialoguePanelProps) {
  const [currentNode, setCurrentNode] = useState<DialogueNode | null>(null)
  const [availableResponses, setAvailableResponses] = useState<DialogueResponse[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    // Update current dialogue node when gameState changes
    const node = DialogueManager.getCurrentDialogueNode(gameState, npc)
    setCurrentNode(node)

    if (node) {
      // Start typing effect
      setIsTyping(true)
      setDisplayedText("")

      let currentChar = 0
      const fullText = node.text

      const typingInterval = setInterval(() => {
        if (currentChar < fullText.length) {
          setDisplayedText(fullText.substring(0, currentChar + 1))
          currentChar++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
        }
      }, 20) // Adjust typing speed here

      return () => clearInterval(typingInterval)
    }
  }, [gameState, npc])

  useEffect(() => {
    // Update available responses when current node changes
    if (currentNode) {
      const responses = DialogueManager.getAvailableResponses(gameState, npc)
      setAvailableResponses(responses)
    }
  }, [currentNode, gameState, npc])

  const handleSkip = () => {
    if (isTyping && currentNode) {
      setIsTyping(false)
      setDisplayedText(currentNode.text)
    }
  }

  if (!currentNode) {
    return null
  }

  const speakerName = currentNode.speakerName || npc.name
  const speakerType = currentNode.speakerType || "npc"

  return (
    <div className="dialogue-panel wasteland-card p-4 mb-4">
      <div className="dialogue-header flex items-center mb-4">
        {speakerType === "npc" && <div className="speaker-name text-gold font-bold mr-2">{speakerName}:</div>}
        {speakerType === "player" && <div className="speaker-name text-blue-400 font-bold mr-2">You:</div>}
        {speakerType === "narrator" && <div className="speaker-name text-gray-400 italic mr-2">Narrator:</div>}
      </div>

      <div className="dialogue-content mb-4 relative" onClick={handleSkip}>
        <p className="terminal-text leading-relaxed">
          {displayedText}
          {isTyping && <span className="terminal-cursor"></span>}
        </p>

        {isTyping && (
          <div className="absolute bottom-0 right-0">
            <button
              className="text-xs text-gold/50 hover:text-gold bg-darker-gray px-2 py-1 border border-gold/30"
              onClick={handleSkip}
            >
              SKIP
            </button>
          </div>
        )}
      </div>

      {!isTyping && availableResponses.length > 0 && (
        <div className="dialogue-responses space-y-2 mt-4">
          {availableResponses.map((response) => (
            <button
              key={response.id}
              className="wasteland-card p-2 text-left hover:border-gold transition-all duration-300 w-full group"
              onClick={() => onSelectResponse(response.id)}
            >
              <div className="flex items-center">
                <span className="flex-grow terminal-text">{response.text}</span>
                <ChevronRight className="w-5 h-5 text-gold/50 group-hover:text-gold transition-colors ml-2 opacity-0 group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>
      )}

      {!isTyping && availableResponses.length === 0 && (
        <button
          className="wasteland-card p-2 text-center hover:border-gold transition-all duration-300 w-full"
          onClick={onEndDialogue}
        >
          End conversation
        </button>
      )}
    </div>
  )
}
