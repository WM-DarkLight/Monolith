import type { Condition } from "./episode"
import type { GameState } from "./game"

export interface DialogueNode {
  id: string
  text: string
  speakerName?: string
  speakerType?: "player" | "npc" | "narrator"
  responses: DialogueResponse[]
  onEnter?: (gameState: GameState) => GameState // Optional function to run when entering this node
}

export interface DialogueResponse {
  id: string
  text: string
  nextNodeId: string
  condition?: Condition
  setFlags?: Record<string, boolean | string | number>
  onSelect?: (gameState: GameState) => GameState // Optional function to run when selecting this response
}

export interface NPC {
  id: string
  name: string
  description: string
  initialDialogueId: string
  dialogues: Record<string, DialogueNode>
  memoryFlags?: string[] // Flags that this NPC will remember about interactions
}

export interface DialogueState {
  isActive: boolean
  currentNpcId: string | null
  currentNodeId: string | null
}
