import type { Episode } from "@/types/episode"

/**
 * INVENTORY EPISODE TEMPLATE
 *
 * This template builds on the basic template by adding:
 * - Items that can be added to inventory
 * - Items that can be removed from inventory
 * - Options that require specific items
 *
 * Use this for episodes involving item collection and usage.
 */
export const inventoryEpisodeTemplate: Episode = {
  id: "abandoned-cabin",
  title: "Abandoned Cabin",
  description: "An old cabin that seems to have been abandoned for years",

  text: `The cabin's wooden door creaks as you push it open. Dust motes dance in the beams 
  of sunlight that filter through the cracked windows. The interior is sparse: a small table, 
  a broken chair, and a fireplace with cold ashes.

  On the table, you notice an old leather-bound journal and a rusty key. A locked chest sits 
  in the corner of the room, partially hidden under a ragged blanket.`,

  options: [
    {
      id: "take-journal",
      text: "Take the journal from the table",
      // Add an item to the player's inventory
      addItems: [
        {
          id: "old-journal",
          name: "Old Leather Journal",
          description: "A weathered journal with faded writing",
          quantity: 1,
        },
      ],
      nextEpisode: "abandoned-cabin", // Return to the same episode
    },

    {
      id: "take-key",
      text: "Take the rusty key",
      // Add an item to the player's inventory
      addItems: [
        {
          id: "rusty-key",
          name: "Rusty Key",
          description: "An old key covered in rust",
          quantity: 1,
        },
      ],
      nextEpisode: "abandoned-cabin", // Return to the same episode
    },

    {
      id: "open-chest",
      text: "Try to open the chest with the rusty key",
      // This option only appears if the player has the key
      condition: {
        hasItems: ["rusty-key"],
      },
      // Remove the key from inventory (it breaks in the lock)
      removeItems: ["rusty-key"],
      // Add new items found in the chest
      addItems: [
        {
          id: "silver-locket",
          name: "Silver Locket",
          description: "A tarnished silver locket with an intricate design",
          quantity: 1,
        },
        {
          id: "gold-coins",
          name: "Gold Coins",
          description: "A small pouch containing old gold coins",
          quantity: 5,
        },
      ],
      nextEpisode: "chest-opened",
    },

    {
      id: "read-journal",
      text: "Read the journal",
      // This option only appears if the player has the journal
      condition: {
        hasItems: ["old-journal"],
      },
      nextEpisode: "journal-contents",
    },

    {
      id: "leave-cabin",
      text: "Leave the cabin",
      nextEpisode: "forest-clearing",
    },
  ],
}
