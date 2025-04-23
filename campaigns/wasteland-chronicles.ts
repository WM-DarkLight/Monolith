import type { Campaign } from "@/types/campaign"

export const wastelandChronicles: Campaign = {
  id: "wasteland-chronicles",
  title: "Wasteland Chronicles",
  description: "A journey through the dangerous wasteland in search of the legendary Monolith.",
  persistentProgress: true,
  allowCustomSkills: true,
  skillPoints: 15,
  recommendedSkills: {
    perception: 7,
    agility: 6,
    charisma: 5,
  },
  episodes: [
    {
      id: "intro",
      title: "The Beginning",
      description: "Your journey begins at the edge of the wasteland.",
    },
    {
      id: "cave-entrance",
      title: "The Cave Entrance",
      description: "Discover the entrance to a mysterious cave system.",
      unlockConditions: {
        requiredEpisodes: ["intro"],
      },
    },
    {
      id: "dark-corridor",
      title: "The Dark Corridor",
      description: "Navigate through the dark corridors of the cave.",
      unlockConditions: {
        requiredEpisodes: ["cave-entrance"],
      },
    },
    {
      id: "ancient-chamber",
      title: "The Ancient Chamber",
      description: "Discover an ancient chamber with mysterious artifacts.",
      unlockConditions: {
        requiredEpisodes: ["dark-corridor"],
      },
    },
    {
      id: "monolith-room",
      title: "The Monolith",
      description: "Finally face the legendary Monolith.",
      unlockConditions: {
        requiredEpisodes: ["ancient-chamber"],
      },
    },
  ],
}
