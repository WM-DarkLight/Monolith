import type { Episode } from "@/types/episode"

/**
 * SKILLS EPISODE TEMPLATE
 *
 * This template builds on previous templates by adding:
 * - Skill checks with success/failure paths
 * - Skill improvements
 * - Different outcomes based on skills
 *
 * Use this for episodes with challenges that test character abilities.
 */
export const skillsEpisodeTemplate: Episode = {
  id: "ancient-door",
  title: "The Ancient Door",
  description: "A massive stone door blocks your path forward",

  text: `You stand before an imposing stone door carved with strange symbols. The door appears 
  to be sealed shut, with no obvious handle or mechanism to open it.

  The symbols seem to form some kind of pattern or puzzle. To the right of the door is a small 
  alcove containing what looks like a control panel with various levers and buttons.

  The stone around the door frame shows signs of weakness in some places, and you notice a 
  narrow gap at the bottom that might be just large enough to see through.`,

  options: [
    {
      id: "decipher-symbols",
      text: "Attempt to decipher the symbols on the door",
      // Intelligence skill check
      skillCheck: {
        skill: "intelligence",
        difficulty: 7, // Moderately difficult
      },
      // Text shown on success
      successText: "You recognize patterns in the symbols and understand their meaning!",
      // Text shown on failure
      failureText: "The symbols remain incomprehensible to you.",
      // Episode to load on success
      nextEpisode: "door-puzzle-solved",
      // Improve intelligence skill on success
      modifySkills: {
        intelligence: 1,
      },
      // No failure episode specified, so player stays on current episode if failed
    },

    {
      id: "examine-control-panel",
      text: "Examine the control panel mechanisms",
      // Perception skill check
      skillCheck: {
        skill: "perception",
        difficulty: 6,
      },
      successText: "You notice that certain buttons correspond to the symbols on the door.",
      failureText: "The control panel is too complex to understand at a glance.",
      nextEpisode: "ancient-door", // Return to same episode
      // Set a flag on success that can be used for other options
      setFlags: {
        "noticed-button-pattern": true,
      },
    },

    {
      id: "operate-panel",
      text: "Try to operate the control panel",
      // Only available if player noticed the pattern
      condition: {
        flags: {
          "noticed-button-pattern": true,
        },
      },
      // Intelligence skill check
      skillCheck: {
        skill: "intelligence",
        difficulty: 5,
      },
      successText: "You press the buttons in the correct sequence!",
      failureText: "You press several buttons, but nothing happens.",
      nextEpisode: "door-opens",
      failureEpisode: "door-locked", // Different episode on failure
    },

    {
      id: "force-door",
      text: "Try to force the door open",
      // Strength skill check
      skillCheck: {
        skill: "strength",
        difficulty: 8, // Very difficult
      },
      successText: "With tremendous effort, you manage to force the door open!",
      failureText: "The door doesn't budge despite your best efforts.",
      nextEpisode: "door-forced-open",
      // Reduce energy on attempt
      modifyStats: {
        energy: -15,
      },
      // Reduce health on failure
      failureStats: {
        health: -10,
      },
    },

    {
      id: "look-under-door",
      text: "Peer through the gap under the door",
      // Perception skill check
      skillCheck: {
        skill: "perception",
        difficulty: 5,
      },
      successText: "You can make out a lever on the other side of the door!",
      failureText: "It's too dark to see anything clearly.",
      nextEpisode: "ancient-door", // Return to same episode
      // Set a flag on success
      setFlags: {
        "saw-lever": true,
      },
    },

    {
      id: "use-tool",
      text: "Use a thin tool to reach the lever under the door",
      // Only available if player saw the lever
      condition: {
        flags: {
          "saw-lever": true,
        },
        // Requires an item
        hasItems: ["thin-rod"],
      },
      // Agility skill check
      skillCheck: {
        skill: "agility",
        difficulty: 6,
      },
      successText: "You carefully maneuver the rod and manage to flip the lever!",
      failureText: "You can't quite reach the lever with your tool.",
      nextEpisode: "door-unlocked",
      // Improve agility on success
      modifySkills: {
        agility: 1,
      },
    },

    {
      id: "leave-door",
      text: "Leave and look for another way",
      nextEpisode: "corridor-junction",
    },
  ],
}
