import type { Campaign } from "@/types/campaign"

export const abandonedFacilities: Campaign = {
  id: "abandoned-facilities",
  title: "Abandoned Facilities",
  description: "Explore mysterious pre-war facilities and uncover their secrets.",
  persistentProgress: true,
  allowCustomSkills: true,
  skillPoints: 12,
  recommendedSkills: {
    intelligence: 7,
    perception: 6,
    strength: 5,
  },
  episodes: [
    {
      id: "abandoned-bunker",
      title: "The Abandoned Bunker",
      description: "Discover a hidden bunker in the wasteland.",
    },
    {
      id: "perk-showcase",
      title: "Anomaly Encounter",
      description: "Encounter a strange anomaly with valuable technology.",
      unlockConditions: {
        requiredEpisodes: ["abandoned-bunker"],
      },
    },
    {
      id: "skill-test",
      title: "Skill Challenge",
      description: "Face challenges that will test your skills and abilities.",
      unlockConditions: {
        requiredEpisodes: ["perk-showcase"],
      },
    },
  ],
}
