import type { Episode } from "@/types/episode"

export const perkShowcaseObservedEpisode: Episode = {
  id: "perk-showcase-observed",
  title: "Anomaly Encounter - Observed",
  description: "A closer look at the anomaly after initial observation",
  text: `You continue studying the strange anomaly in the wasteland. Your notes indicate that the shimmering dome's energy patterns shift every few minutes, and the crystal at its center pulses in rhythm with these shifts.

The Geiger counter readings suggest moderate radiation levels - not immediately dangerous from this distance, but prolonged exposure would be unwise. You notice that the dome occasionally flickers, revealing more of its contents momentarily.

With your observations in hand, you consider your next move carefully.`,
  options: [
    {
      id: "analyze-anomaly",
      text: "Use your scientific knowledge to analyze the anomaly",
      condition: {
        perks: { science: true },
      },
      successText: "Your scientific expertise allows you to understand the anomaly's patterns.",
      failureText: "The anomaly's properties elude your understanding.",
      setFlags: { "analyzed-anomaly": true },
      nextEpisode: "perk-showcase-observed",
      modifyStats: {
        energy: -5,
      },
    },
    {
      id: "radiation-resistance",
      text: "Enter the dome to retrieve the technology",
      condition: {
        perks: { "rad-resistant": true },
      },
      successText: "Your radiation resistance allows you to withstand the dome's emissions.",
      failureText: "The radiation is too intense for you to approach safely.",
      addItems: [
        {
          id: "advanced-tech",
          name: "Advanced Technology",
          description: "A piece of pre-war technology recovered from the anomaly",
          quantity: 1,
        },
      ],
      nextEpisode: "perk-showcase-observed",
      modifyStats: {
        health: -10,
        energy: -15,
      },
    },
    {
      id: "artifact-sense",
      text: "Attempt to extract the crystal using your anomaly expertise",
      condition: {
        perks: { "crystal-heart": true },
      },
      successText: "Your experience with artifacts helps you safely extract the crystal.",
      failureText: "The crystal's energy pattern is unfamiliar to you.",
      addItems: [
        {
          id: "pulsing-crystal",
          name: "Pulsing Crystal",
          description: "A strange crystal extracted from the anomaly that pulses with energy",
          quantity: 1,
        },
      ],
      nextEpisode: "perk-showcase-observed",
      modifyStats: {
        energy: -20,
      },
    },
    {
      id: "approach-carefully",
      text: "Approach the dome more carefully for a closer look",
      condition: {
        perks: { "night-eyes": true },
      },
      successText: "Your enhanced vision allows you to see patterns in the dome's energy fluctuations.",
      setFlags: { "noticed-pattern": true },
      nextEpisode: "perk-showcase-observed",
    },
    {
      id: "brute-force",
      text: "Use your strength to throw a heavy object into the dome",
      condition: {
        skills: { strength: 7 },
      },
      successText: "Your thrown object disrupts the anomaly, causing it to release some of its contents.",
      failureText: "Your throw isn't powerful enough to affect the anomaly.",
      addItems: [
        {
          id: "scattered-components",
          name: "Scattered Components",
          description: "Various technological components scattered from the disrupted anomaly",
          quantity: 3,
        },
      ],
      nextEpisode: "perk-showcase-observed",
      modifyStats: {
        energy: -10,
      },
    },
    {
      id: "leave-anomaly",
      text: "Leave the anomaly site and continue your journey",
      nextEpisode: "intro",
    },
  ],
}
