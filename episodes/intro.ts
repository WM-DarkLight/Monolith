import type { Episode } from "@/types/episode"

export const introEpisode: Episode = {
  id: "intro",
  title: "The Beginning",
  allowCustomSkills: true,
  skillPoints: 10,
  text: `The legends spoke of an ancient artifact of immense power, hidden deep within the mountains. For centuries, adventurers sought it, but none returned.

Now, standing at the foot of the imposing mountain range, you feel a strange pull. The locals call this place "The Monolith" - a name that sends shivers down your spine.

The morning sun casts long shadows across the rocky terrain. Your supplies are limited, but your determination is not. This is your chance to uncover the truth behind the legends.`,
  options: [
    {
      id: "enter-cave",
      text: "Enter the cave entrance you spotted in the mountainside",
      nextEpisode: "cave-entrance",
    },
    {
      id: "check-supplies",
      text: "Check your supplies before proceeding",
      setFlags: { "checked-supplies": true },
      addItems: [
        { id: "torch", name: "Torch", description: "A simple wooden torch", quantity: 3 },
        { id: "water-flask", name: "Water Flask", description: "A leather flask filled with water", quantity: 1 },
        { id: "rope", name: "Rope", description: "A coil of sturdy rope", quantity: 1 },
      ],
      nextEpisode: "intro",
    },
    {
      id: "talk-to-locals",
      text: "Return to the village to gather more information",
      condition: {
        flags: { "checked-supplies": true },
      },
      setFlags: { "talked-to-locals": true },
      nextEpisode: "intro",
    },
    {
      id: "proceed-to-cave",
      text: "Proceed to the cave with confidence",
      condition: {
        flags: { "talked-to-locals": true, "checked-supplies": true },
      },
      nextEpisode: "cave-entrance",
    },
  ],
}
