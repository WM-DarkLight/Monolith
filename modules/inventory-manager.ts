import type { Item, GameState } from "@/types/game"

export class InventoryManager {
  static addItem(gameState: GameState, item: Item): GameState {
    const existingItemIndex = gameState.inventory.findIndex((i) => i.id === item.id)

    if (existingItemIndex >= 0) {
      // Item already exists, update quantity
      const updatedInventory = [...gameState.inventory]
      updatedInventory[existingItemIndex] = {
        ...updatedInventory[existingItemIndex],
        quantity: updatedInventory[existingItemIndex].quantity + item.quantity,
      }

      return {
        ...gameState,
        inventory: updatedInventory,
      }
    } else {
      // Add new item
      return {
        ...gameState,
        inventory: [...gameState.inventory, item],
      }
    }
  }

  static removeItem(gameState: GameState, itemId: string, quantity = 1): GameState {
    const existingItemIndex = gameState.inventory.findIndex((i) => i.id === itemId)

    if (existingItemIndex < 0) {
      // Item doesn't exist
      return gameState
    }

    const existingItem = gameState.inventory[existingItemIndex]

    if (existingItem.quantity <= quantity) {
      // Remove the item completely
      return {
        ...gameState,
        inventory: gameState.inventory.filter((i) => i.id !== itemId),
      }
    } else {
      // Reduce the quantity
      const updatedInventory = [...gameState.inventory]
      updatedInventory[existingItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity - quantity,
      }

      return {
        ...gameState,
        inventory: updatedInventory,
      }
    }
  }

  static hasItem(gameState: GameState, itemId: string): boolean {
    return gameState.inventory.some((item) => item.id === itemId)
  }

  static getItemQuantity(gameState: GameState, itemId: string): number {
    const item = gameState.inventory.find((i) => i.id === itemId)
    return item ? item.quantity : 0
  }
}
