import type { GameState } from "@/types/game"
import type { DialogueNode, DialogueResponse, NPC } from "@/types/dialogue"
import { checkOptionCondition } from "@/lib/condition-checker"
import { FlagManager } from "@/modules/flag-manager"

export class DialogueManager {
  static startDialogue(gameState: GameState, npc: NPC): GameState {
    // Initialize dialogue state if it doesn't exist
    if (!gameState.dialogueState) {
      gameState = {
        ...gameState,
        dialogueState: {
          isActive: false,
          currentNpcId: null,
          currentNodeId: null,
        },
      }
    }

    // Initialize NPC interactions if they don't exist
    if (!gameState.npcInteractions) {
      gameState = {
        ...gameState,
        npcInteractions: {},
      }
    }

    // Initialize this NPC's interactions if first time meeting
    if (!gameState.npcInteractions[npc.id]) {
      gameState = {
        ...gameState,
        npcInteractions: {
          ...gameState.npcInteractions,
          [npc.id]: {
            met: true,
            lastInteraction: new Date().toISOString(),
          },
        },
      }
    } else {
      // Update last interaction time
      gameState = {
        ...gameState,
        npcInteractions: {
          ...gameState.npcInteractions,
          [npc.id]: {
            ...gameState.npcInteractions[npc.id],
            lastInteraction: new Date().toISOString(),
          },
        },
      }
    }

    // Set dialogue state to active with initial dialogue
    gameState = {
      ...gameState,
      dialogueState: {
        isActive: true,
        currentNpcId: npc.id,
        currentNodeId: npc.initialDialogueId,
      },
    }

    // Run onEnter function if it exists
    const initialNode = npc.dialogues[npc.initialDialogueId]
    if (initialNode && initialNode.onEnter) {
      gameState = initialNode.onEnter(gameState)
    }

    return gameState
  }

  static endDialogue(gameState: GameState): GameState {
    if (!gameState.dialogueState) return gameState

    return {
      ...gameState,
      dialogueState: {
        ...gameState.dialogueState,
        isActive: false,
      },
    }
  }

  static selectDialogueResponse(gameState: GameState, npc: NPC, responseId: string): GameState {
    if (!gameState.dialogueState || !gameState.dialogueState.isActive) return gameState

    const currentNodeId = gameState.dialogueState.currentNodeId
    if (!currentNodeId) return gameState

    const currentNode = npc.dialogues[currentNodeId]
    if (!currentNode) return gameState

    const selectedResponse = currentNode.responses.find((r) => r.id === responseId)
    if (!selectedResponse) return gameState

    // Apply flag changes if any
    if (selectedResponse.setFlags) {
      Object.entries(selectedResponse.setFlags).forEach(([key, value]) => {
        gameState = FlagManager.setFlag(gameState, key, value)

        // If this NPC remembers this flag, store it in their memory
        if (npc.memoryFlags && npc.memoryFlags.includes(key)) {
          gameState = {
            ...gameState,
            npcInteractions: {
              ...gameState.npcInteractions,
              [npc.id]: {
                ...gameState.npcInteractions?.[npc.id],
                [key]: value,
              },
            },
          }
        }
      })
    }

    // Run onSelect function if it exists
    if (selectedResponse.onSelect) {
      gameState = selectedResponse.onSelect(gameState)
    }

    // Move to the next dialogue node
    const nextNodeId = selectedResponse.nextNodeId

    // If nextNodeId is "EXIT", end the dialogue
    if (nextNodeId === "EXIT") {
      return DialogueManager.endDialogue(gameState)
    }

    const nextNode = npc.dialogues[nextNodeId]
    if (!nextNode) return DialogueManager.endDialogue(gameState)

    gameState = {
      ...gameState,
      dialogueState: {
        ...gameState.dialogueState,
        currentNodeId: nextNodeId,
      },
    }

    // Run onEnter function if it exists
    if (nextNode.onEnter) {
      gameState = nextNode.onEnter(gameState)
    }

    return gameState
  }

  static getCurrentDialogueNode(gameState: GameState, npc: NPC): DialogueNode | null {
    if (!gameState.dialogueState || !gameState.dialogueState.isActive) return null

    const currentNodeId = gameState.dialogueState.currentNodeId
    if (!currentNodeId) return null

    return npc.dialogues[currentNodeId] || null
  }

  static getAvailableResponses(gameState: GameState, npc: NPC): DialogueResponse[] {
    const currentNode = this.getCurrentDialogueNode(gameState, npc)
    if (!currentNode) return []

    // Filter responses based on conditions
    return currentNode.responses.filter(
      (response) => !response.condition || checkOptionCondition(response.condition, gameState),
    )
  }

  static hasMetNPC(gameState: GameState, npcId: string): boolean {
    return !!gameState.npcInteractions?.[npcId]?.met
  }

  static getNPCMemory(gameState: GameState, npcId: string, key: string): boolean | string | number | undefined {
    return gameState.npcInteractions?.[npcId]?.[key]
  }
}
