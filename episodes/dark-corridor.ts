import type { Episode } from "@/types/episode"

export const darkCorridorEpisode: Episode = {
  id: "dark-corridor",
  title: "The Dark Corridor",
  text: `The wider corridor descends into darkness. Your footsteps echo against the stone walls, creating an eerie rhythm that seems to follow you.

Water drips from the ceiling, forming small puddles on the uneven floor. The air grows colder as you proceed, and you can see your breath forming misty clouds.

After walking for what feels like hours, you reach a junction. To your left, you hear the faint sound of rushing water. To your right, the corridor continues, but you notice a golden glow emanating from that direction.`,
  options: [
    {
      id: "follow-water-sound",
      text: "Follow the sound of rushing water",
      nextEpisode: "ancient-chamber",
    },
    {
      id: "follow-golden-glow",
      text: "Investigate the golden glow",
      nextEpisode: "monolith-room",
    },
    {
      id: "rest-a-moment",
      text: "Rest for a moment to regain your strength",
      modifyStats: { energy: 15, health: 5 },
      nextEpisode: "dark-corridor",
    },
    {
      id: "return-to-entrance",
      text: "Return to the cave entrance",
      nextEpisode: "cave-entrance",
    },
  ],
}
