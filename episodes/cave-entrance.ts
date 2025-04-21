import type { Episode } from "@/types/episode"

export const caveEntranceEpisode: Episode = {
  id: "cave-entrance",
  title: "The Cave Entrance",
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
