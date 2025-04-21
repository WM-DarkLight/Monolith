import type { Episode } from "@/types/episode"

export const templateEpisode: Episode = {
  id: "template-episode",
  title: "Template Episode",
  description: "A template for creating new episodes",
  text: `
    Your main episode text goes here.
    
    This is what the player will read when they reach this episode.
    You can include multiple paragraphs and format the text as needed.
  `,
  options: [
    {
      id: "option-1",
      text: "First choice for the player",
      nextEpisode: "next-episode-id",
    },
    {
      id: "option-2",
      text: "Choice with a skill check",
      skillCheck: {
        skill: "intelligence",
        difficulty: 6,
      },
      successText: "You succeeded!",
      failureText: "You failed!",
      nextEpisode: "success-episode",
      failureEpisode: "failure-episode",
    },
    {
      id: "option-3",
      text: "Choice with a condition",
      condition: {
        hasItems: ["required-item"],
        flags: { "story-flag": true },
      },
      nextEpisode: "conditional-episode",
    },
    {
      id: "option-4",
      text: "Choice that gives rewards",
      addItems: [
        {
          id: "reward-item",
          name: "Reward Item",
          description: "A reward for the player",
          quantity: 1,
        },
      ],
      modifyStats: { health: 10, energy: 5 },
      modifySkills: { perception: 1 },
      nextEpisode: "reward-episode",
    },
  ],
}
