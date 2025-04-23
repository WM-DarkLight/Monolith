import type { Episode } from "@/types/episode"

export const introEpisode: Episode = {
  id: "intro",
  title: "The Beginning",
  description: "The start of your adventure",
  allowCustomSkills: true,
  skillPoints: 10,
  initialScene: "start", // Set the initial scene
  scenes: {
    // Define the start scene
    start: {
      id: "start",
      title: "The Beginning",
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
          scene: "supplies", // Navigate to the supplies scene
        },
        {
          id: "talk-to-locals",
          text: "Return to the village to gather more information",
          condition: {
            flags: { "checked-supplies": true },
          },
          scene: "village", // Navigate to the village scene
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
    },
    // Define the supplies scene
    supplies: {
      id: "supplies",
      title: "Checking Supplies",
      text: `You take a moment to inventory your supplies. In your backpack, you find:

- A few torches, useful for illuminating dark places
- A water flask, filled with clean water
- A coil of sturdy rope
- Some basic rations

These supplies might not be enough for an extended expedition, but they should suffice for initial exploration. You carefully organize everything for easy access.`,
      options: [
        {
          id: "take-supplies",
          text: "Pack everything carefully and continue",
          addItems: [
            { id: "torch", name: "Torch", description: "A simple wooden torch", quantity: 3 },
            { id: "water-flask", name: "Water Flask", description: "A leather flask filled with water", quantity: 1 },
            { id: "rope", name: "Rope", description: "A coil of sturdy rope", quantity: 1 },
          ],
          scene: "start", // Return to the start scene
        },
      ],
    },
    // Define the village scene
    village: {
      id: "village",
      title: "The Village",
      text: `You return to the small village nestled at the base of the mountains. The locals eye you with a mixture of curiosity and concern.

An elderly villager approaches you. "Seeking the Monolith, are you?" he asks, his voice weathered by age. "Many have tried, few have returned. Those who did were... changed."

He tells you tales of strange energies, of people who gained unusual abilities after encountering the Monolith, and of others who were driven mad by its power.

"If you must go," he says finally, "be wary of the symbols. They are a language of sorts, a key to understanding the Monolith's nature."`,
      options: [
        {
          id: "ask-about-symbols",
          text: "Ask more about the symbols",
          scene: "symbols-info", // Navigate to the symbols info scene
        },
        {
          id: "thank-elder",
          text: "Thank the elder and return to your journey",
          setFlags: { "talked-to-locals": true },
          scene: "start", // Return to the start scene
        },
      ],
    },
    // Define the symbols info scene
    "symbols-info": {
      id: "symbols-info",
      title: "Information About the Symbols",
      text: `The elder's eyes light up at your interest. "The symbols," he says, "are said to be the language of those who created the Monolith. They tell a story, but also serve as warnings and instructions."

He sketches a few symbols in the dirt with a stick. "These represent transformation, power, and danger," he explains. "If you find these in the cave, pay close attention. They might save your life."

He also mentions that the symbols sometimes glow in response to certain actions or the presence of certain objects. "The glow is a sign of activation," he says. "What exactly is being activated, I cannot say."`,
      options: [
        {
          id: "thank-for-info",
          text: "Thank him for the information",
          setFlags: { "symbol-knowledge": true, "talked-to-locals": true },
          scene: "start", // Return to the start scene
        },
      ],
    },
  },
  // Keep the original text and options for backward compatibility
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
