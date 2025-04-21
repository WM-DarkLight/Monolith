import type { Episode } from "@/types/episode"

export const ancientChamberEpisode: Episode = {
  id: "ancient-chamber",
  title: "The Ancient Chamber",
  text: `You emerge into a vast chamber, its ceiling lost in darkness above. A small underground stream cuts across the floor, its waters crystal clear and somehow luminescent, casting a soft blue glow throughout the space.

The walls are covered in intricate carvings depicting figures gathered around a tall, rectangular object - the Monolith, you presume. The scenes show people approaching it, touching it, and then... transforming? The final images are unclear.

In the center of the chamber stands a stone pedestal with a golden key resting upon it. Beyond the pedestal, you can see a massive stone door with a keyhole at its center.`,
  options: [
    {
      id: "take-golden-key",
      text: "Take the golden key",
      addItems: [
        { id: "golden-key", name: "Golden Key", description: "An ornate key made of solid gold", quantity: 1 },
      ],
      setFlags: { "has-golden-key": true },
      nextEpisode: "ancient-chamber",
    },
    {
      id: "examine-carvings",
      text: "Study the wall carvings more carefully",
      setFlags: { "studied-carvings": true },
      nextEpisode: "ancient-chamber",
    },
    {
      id: "drink-from-stream",
      text: "Drink from the luminescent stream",
      modifyStats: { health: 20 },
      setFlags: { "drank-from-stream": true },
      nextEpisode: "ancient-chamber",
    },
    {
      id: "use-key-on-door",
      text: "Use the golden key on the stone door",
      condition: {
        hasItems: ["golden-key"],
      },
      nextEpisode: "monolith-room",
    },
    {
      id: "return-to-corridor",
      text: "Return to the dark corridor",
      nextEpisode: "dark-corridor",
    },
  ],
}
