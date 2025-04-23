import type { Campaign } from "@/types/campaign"

export const factionWars: Campaign = {
  id: "faction-wars",
  title: "Faction Wars",
  description: "Navigate the complex politics of wasteland factions and determine the future of the region.",
  persistentProgress: true,
  allowCustomSkills: true,
  skillPoints: 15,
  recommendedSkills: {
    charisma: 7,
    perception: 6,
    intelligence: 5,
  },
  episodes: [
    {
      id: "intro",
      title: "The Beginning",
      description: "Your journey begins at the edge of the wasteland.",
    },
    {
      id: "faction-outpost",
      title: "The Outpost",
      description: "Encounter the Tech Brotherhood at their outpost.",
      unlockConditions: {
        requiredEpisodes: ["intro"],
      },
    },
    {
      id: "abandoned-bunker",
      title: "The Abandoned Bunker",
      description: "Discover a hidden bunker that might contain valuable technology.",
      unlockConditions: {
        requiredEpisodes: ["faction-outpost"],
      },
    },
    {
      id: "skill-test",
      title: "Skill Challenge",
      description: "Face challenges that will test your skills and abilities.",
      unlockConditions: {
        requiredEpisodes: ["abandoned-bunker"],
      },
    },
  ],
}
