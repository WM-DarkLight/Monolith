import type { Episode } from "@/types/episode"

export const perkShowcaseEpisode: Episode = {
  id: "perk-showcase",
  title: "Anomaly Encounter",
  description: "A demonstration of the perk system in a contained scenario",
  text: `You stumble upon a strange anomaly in the wasteland - a shimmering, translucent dome about ten meters across. Inside, you can see what appears to be pre-war technology and supplies, untouched by time.

The air around the dome crackles with energy, and your Geiger counter ticks ominously. A faint humming emanates from the center of the dome where a pulsing crystal hovers above a pedestal.

As you approach, you notice three possible ways to interact with this phenomenon.

[TUTORIAL: Click the Perks button (trophy icon) in the top right to select perks. Different perks will unlock different options for interacting with the anomaly.]`,
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
      nextEpisode: "perk-showcase",
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
      nextEpisode: "perk-showcase",
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
      nextEpisode: "perk-showcase",
      modifyStats: {
        energy: -20,
      },
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
      nextEpisode: "perk-showcase",
      modifyStats: {
        energy: -10,
      },
    },
    {
      id: "observe-safely",
      text: "Observe the anomaly from a safe distance",
      successText: "You take notes on the anomaly's behavior from a safe distance.",
      setFlags: { "observed-anomaly": true },
      nextEpisode: "perk-showcase-observed",
    },
  ],
}
