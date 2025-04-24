import type { Episode } from "@/types/episode"

export const monolithRoomEpisode: Episode = {
  id: "monolith-room",
  title: "The Monolith",
  text: `The massive stone door grinds open, revealing a perfectly circular chamber bathed in golden light. In the center stands the Monolith - a towering rectangular structure of obsidian black, its surface so smooth it seems to absorb the light around it.

Golden symbols float in the air around the Monolith, slowly orbiting it like celestial bodies. The air hums with energy, making your skin tingle and your hair stand on end.

As you approach, the symbols begin to move faster, and the Monolith's surface ripples like water. You feel a presence, ancient and powerful, reaching out to you from within the black stone.`,
  options: [
    {
      id: "touch-monolith",
      text: "Reach out and touch the Monolith",
      setFlags: { "touched-monolith": true },
      nextEpisode: "monolith-room",
    },
    {
      id: "study-symbols",
      text: "Try to decipher the floating symbols",
      condition: {
        flags: { "studied-carvings": true },
      },
      setFlags: { "deciphered-symbols": true },
      nextEpisode: "monolith-room",
    },
    {
      id: "use-artifact",
      text: "Use the ancient artifact to communicate with the Monolith",
      condition: {
        flags: { "deciphered-symbols": true, "touched-monolith": true },
      },
      scene: "monolith-finale", // Add a final scene
    },
    {
      id: "retreat",
      text: "Retreat from the chamber",
      nextEpisode: "ancient-chamber",
    },
  ],
  // Add scenes to this episode
  scenes: {
    "monolith-finale": {
      id: "monolith-finale",
      title: "The Monolith Awakens",
      text: `As you use the ancient artifact, the Monolith's surface begins to glow with an intense golden light. The floating symbols rush toward you, swirling around your body before being absorbed into your skin.

Knowledge floods your mind - images, concepts, and understanding beyond anything you've experienced before. You see the history of the world, the purpose of the Monolith, and glimpses of possible futures.

When the light fades, you find yourself changed. The Monolith has shared its secrets with you, and now you must decide what to do with this newfound knowledge and power.

THE END`,
      options: [
        {
          id: "continue",
          text: "Embrace your destiny",
          nextEpisode: "intro", // Return to the beginning for now
        },
      ],
      isFinal: true, // Mark this as a final scene
    },
  },
}
