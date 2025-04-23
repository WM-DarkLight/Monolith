import type { Episode } from "@/types/episode"

export const caveEntranceEpisode: Episode = {
  id: "cave-entrance",
  title: "The Cave Entrance",
  description: "The entrance to a mysterious cave system",
  initialScene: "entrance", // Set the initial scene
  scenes: {
    // Define the entrance scene
    entrance: {
      id: "entrance",
      title: "The Cave Entrance",
      text: `The cave entrance looms before you, a dark maw in the mountainside. Cool air flows outward, carrying the scent of damp stone and something else... something ancient.

Moss-covered rocks frame the entrance, and strange symbols are carved into the stone, worn by time but still visible. They seem to pulse with a faint golden light when you look at them directly.

The path ahead splits in two directions: a wider corridor that descends gently, and a narrow crevice that seems to lead deeper into the mountain.`,
      options: [
        {
          id: "take-wide-corridor",
          text: "Take the wider corridor",
          scene: "wide-corridor", // Navigate to another scene in this episode
        },
        {
          id: "squeeze-through-crevice",
          text: "Squeeze through the narrow crevice",
          modifyStats: { energy: -10 },
          nextEpisode: "ancient-chamber", // For backward compatibility
        },
        {
          id: "examine-symbols",
          text: "Examine the strange symbols more closely",
          setFlags: { "examined-symbols": true },
          scene: "symbols", // Navigate to the symbols scene
        },
        {
          id: "use-torch",
          text: "Light a torch to see better",
          condition: {
            hasItems: ["torch"],
          },
          removeItems: ["torch"],
          setFlags: { "has-light": true },
          scene: "entrance-lit", // Navigate to the lit entrance scene
        },
        {
          id: "return-outside",
          text: "Return to the outside",
          nextEpisode: "intro",
        },
      ],
    },
    // Define the symbols scene
    symbols: {
      id: "symbols",
      title: "Strange Symbols",
      text: `You examine the symbols more closely. They appear to be an ancient script, unlike anything you've seen before. As you trace your fingers over the carved lines, they pulse with a stronger golden light.

The symbols seem to tell a story, depicting figures gathered around a tall, rectangular object - perhaps the Monolith you've heard about in legends. There are scenes of transformation and power.

You feel a strange connection to these symbols, as if they're trying to communicate something important.`,
      options: [
        {
          id: "continue-examining",
          text: "Continue studying the symbols",
          setFlags: { "symbols-studied": true },
          scene: "symbols-revelation", // Navigate to the symbols revelation scene
        },
        {
          id: "return-to-entrance",
          text: "Return to the cave entrance",
          scene: "entrance", // Navigate back to the entrance scene
        },
      ],
    },
    // Define the symbols revelation scene
    "symbols-revelation": {
      id: "symbols-revelation",
      title: "Symbolic Revelation",
      text: `As you continue to study the symbols, patterns begin to emerge. You realize they're not just decorative - they're instructions. The symbols show a sequence of actions needed to interact with the Monolith safely.

According to the symbols, the Monolith possesses great power but also great danger. Those who approach it unprepared risk being consumed by its energy.

This knowledge might prove invaluable if you manage to find the Monolith.`,
      options: [
        {
          id: "memorize-sequence",
          text: "Memorize the sequence shown in the symbols",
          setFlags: { "monolith-sequence-known": true },
          scene: "entrance", // Return to the entrance
        },
        {
          id: "return-to-entrance",
          text: "Return to the cave entrance",
          scene: "entrance", // Navigate back to the entrance scene
        },
      ],
    },
    // Define the entrance-lit scene
    "entrance-lit": {
      id: "entrance-lit",
      title: "The Illuminated Entrance",
      text: `Your torch casts dancing shadows on the cave walls, revealing details that were hidden in the darkness. The symbols on the walls glow more intensely in response to your light, creating an ethereal atmosphere.

With better visibility, you notice a small alcove to the side that was previously hidden in shadow. Inside, there appears to be something glinting.

The two paths ahead - the wider corridor and the narrow crevice - are now more clearly visible.`,
      options: [
        {
          id: "investigate-alcove",
          text: "Investigate the hidden alcove",
          scene: "hidden-alcove", // Navigate to the hidden alcove scene
        },
        {
          id: "take-wide-corridor-lit",
          text: "Take the wider corridor",
          scene: "wide-corridor", // Navigate to the wide corridor scene
        },
        {
          id: "squeeze-through-crevice-lit",
          text: "Squeeze through the narrow crevice",
          modifyStats: { energy: -10 },
          nextEpisode: "ancient-chamber",
        },
        {
          id: "examine-symbols-lit",
          text: "Examine the strange symbols more closely",
          setFlags: { "examined-symbols": true },
          scene: "symbols", // Navigate to the symbols scene
        },
        {
          id: "return-outside-lit",
          text: "Return to the outside",
          nextEpisode: "intro",
        },
      ],
    },
    // Define the hidden alcove scene
    "hidden-alcove": {
      id: "hidden-alcove",
      title: "Hidden Alcove",
      text: `You approach the small alcove that was hidden in the shadows. Inside, you find a small stone pedestal with a curious object resting on it - a small crystal that pulses with the same golden light as the symbols.

The crystal seems to respond to your presence, its pulsing becoming more rapid as you reach toward it.`,
      options: [
        {
          id: "take-crystal",
          text: "Take the crystal",
          addItems: [
            {
              id: "golden-crystal",
              name: "Golden Crystal",
              description: "A small crystal that pulses with golden light",
              quantity: 1,
            },
          ],
          scene: "entrance-lit", // Return to the lit entrance
        },
        {
          id: "leave-crystal",
          text: "Leave the crystal alone",
          scene: "entrance-lit", // Return to the lit entrance
        },
      ],
    },
    // Define the wide corridor scene
    "wide-corridor": {
      id: "wide-corridor",
      title: "The Wide Corridor",
      text: `You choose the wider corridor, which descends gently into the earth. The ceiling is high enough that you don't need to duck, and the floor is relatively smooth.

As you proceed deeper, the air grows cooler and damper. Water drips from the ceiling, forming small puddles on the ground. The sound of your footsteps echoes slightly, creating an eerie atmosphere.

After walking for what feels like a considerable distance, you reach a junction.`,
      options: [
        {
          id: "continue-to-dark-corridor",
          text: "Continue deeper into the cave system",
          nextEpisode: "dark-corridor", // Navigate to the dark corridor episode
        },
        {
          id: "return-to-entrance-from-corridor",
          text: "Return to the cave entrance",
          scene: "entrance", // Return to the entrance scene
        },
      ],
    },
  },
  // Keep the original options for backward compatibility
  text: `The cave entrance looms before you, a dark maw in the mountainside. Cool air flows outward, carrying the scent of damp stone and something else... something ancient.

Moss-covered rocks frame the entrance, and strange symbols are carved into the stone, worn by time but still visible. They seem to pulse with a faint golden light when you look at them directly.

The path ahead splits in two directions: a wider corridor that descends gently, and a narrow crevice that seems to lead deeper into the mountain.`,
  options: [
    {
      id: "take-wide-corridor",
      text: "Take the wider corridor",
      nextEpisode: "dark-corridor",
    },
    {
      id: "squeeze-through-crevice",
      text: "Squeeze through the narrow crevice",
      modifyStats: { energy: -10 },
      nextEpisode: "ancient-chamber",
    },
    {
      id: "examine-symbols",
      text: "Examine the strange symbols more closely",
      setFlags: { "examined-symbols": true },
      nextEpisode: "cave-entrance",
    },
    {
      id: "use-torch",
      text: "Light a torch to see better",
      condition: {
        hasItems: ["torch"],
      },
      removeItems: ["torch"],
      setFlags: { "has-light": true },
      nextEpisode: "cave-entrance",
    },
    {
      id: "return-outside",
      text: "Return to the outside",
      nextEpisode: "intro",
    },
  ],
}
