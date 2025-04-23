import type { GameState, Item } from "@/types/game"
import { EffectsManager } from "@/modules/effects-manager"
import { InventoryManager } from "@/modules/inventory-manager"

export class ItemManager {
  // Use an item from inventory
  static useItem(gameState: GameState, itemId: string): GameState {
    // Find the item in inventory
    const item = gameState.inventory.find((i) => i.id === itemId)
    if (!item) return gameState

    // Check if item is usable (has onUse effects)
    if (!item.effects?.onUse || item.effects.onUse.length === 0) return gameState

    // Check if item is consumable and has charges
    if (item.effects.isConsumable) {
      // If it has charges, decrement them
      if (item.effects.charges !== undefined && item.effects.charges > 0) {
        gameState = {
          ...gameState,
          inventory: gameState.inventory.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  effects: {
                    ...i.effects,
                    charges: (i.effects?.charges || 1) - 1,
                  },
                }
              : i,
          ),
        }
      } else {
        // If it's consumable with no charges, remove one from inventory
        gameState = InventoryManager.removeItem(gameState, itemId, 1)
      }
    }

    // Apply each effect
    let updatedGameState = { ...gameState }

    // Create context for effect triggers
    const context = {
      type: "itemUse",
      itemId,
      item,
    }

    // Apply predefined effects
    if (item.effects?.onUse) {
      // For each effect ID, find the corresponding effect definition and apply it
      // This would require a predefined set of effects
      // For now, we'll just create some example effects based on the item

      const useEffect = {
        name: `${item.name} Effect`,
        description: `Effect from using ${item.name}`,
        source: "item" as const,
        sourceId: itemId,
        duration: { type: "temporary" as const, duration: 3 }, // Lasts for 3 scenes
        statModifiers: {
          // Example stat modifications
          health: item.id.includes("health") ? 20 : 0,
          energy: item.id.includes("energy") ? 15 : 0,
        },
        skillModifiers: {
          // Example skill modifications
          strength: item.id.includes("strength") ? 1 : 0,
          perception: item.id.includes("perception") ? 1 : 0,
        },
        tags: ["item_effect", itemId],
      }

      updatedGameState = EffectsManager.addEffect(updatedGameState, useEffect)
    }

    // Trigger any effects that should happen on item use
    if (updatedGameState.effects) {
      updatedGameState.effects.activeEffects.forEach((effect) => {
        if (effect.isActive && effect.onTrigger) {
          // Check if this effect should trigger on this item use
          const shouldTrigger = effect.applyCondition?.hasItems?.includes(itemId)
          if (shouldTrigger) {
            updatedGameState = EffectsManager.triggerEffect(updatedGameState, effect.id, context)
          }
        }
      })
    }

    return updatedGameState
  }

  // Equip an item
  static equipItem(gameState: GameState, itemId: string): GameState {
    // Find the item in inventory
    const item = gameState.inventory.find((i) => i.id === itemId)
    if (!item || !item.effects?.isEquippable) return gameState

    // Check if item is already equipped
    if (item.effects.isEquipped) return gameState

    // Unequip any other items of the same type (if needed)
    // This would require items to have a "slot" property
    // For now, we'll just allow multiple equipped items

    // Mark the item as equipped
    let updatedGameState = {
      ...gameState,
      inventory: gameState.inventory.map((i) =>
        i.id === itemId
          ? {
              ...i,
              effects: {
                ...i.effects,
                isEquipped: true,
              },
            }
          : i,
      ),
    }

    // Apply equip effects
    if (item.effects?.onEquip) {
      // For each effect ID, find the corresponding effect definition and apply it
      // This would require a predefined set of effects
      // For now, we'll just create an example effect

      const equipEffect = {
        name: `${item.name} (Equipped)`,
        description: `Effect from equipping ${item.name}`,
        source: "item" as const,
        sourceId: itemId,
        duration: { type: "conditional" as const, condition: { flags: { itemUnequipped: itemId } } },
        statModifiers: {
          // Example stat modifications
          maxHealth: item.id.includes("armor") ? 10 : 0,
          radiationResistance: item.id.includes("rad") ? 5 : 0,
        },
        skillModifiers: {
          // Example skill modifications
          perception: item.id.includes("helmet") ? 1 : 0,
          agility: item.id.includes("boots") ? 1 : 0,
        },
        tags: ["equipped_item", itemId],
      }

      updatedGameState = EffectsManager.addEffect(updatedGameState, equipEffect)
    }

    return updatedGameState
  }

  // Unequip an item
  static unequipItem(gameState: GameState, itemId: string): GameState {
    // Find the item in inventory
    const item = gameState.inventory.find((i) => i.id === itemId)
    if (!item || !item.effects?.isEquipped) return gameState

    // Mark the item as unequipped
    let updatedGameState = {
      ...gameState,
      inventory: gameState.inventory.map((i) =>
        i.id === itemId
          ? {
              ...i,
              effects: {
                ...i.effects,
                isEquipped: false,
              },
            }
          : i,
      ),
      flags: {
        ...gameState.flags,
        itemUnequipped: itemId, // This will trigger the removal of conditional effects
      },
    }

    // Find and remove any effects from this equipped item
    if (gameState.effects) {
      const itemEffects = gameState.effects.activeEffects.filter(
        (effect) => effect.source === "item" && effect.sourceId === itemId && effect.tags?.includes("equipped_item"),
      )

      itemEffects.forEach((effect) => {
        updatedGameState = EffectsManager.removeEffect(updatedGameState, effect.id)
      })
    }

    // Remove the temporary flag
    updatedGameState = {
      ...updatedGameState,
      flags: {
        ...updatedGameState.flags,
        itemUnequipped: undefined,
      },
    }

    return updatedGameState
  }

  // Get all equipped items
  static getEquippedItems(gameState: GameState): Item[] {
    return gameState.inventory.filter((item) => item.effects?.isEquipped)
  }
}
