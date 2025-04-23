import type { Episode } from "@/types/episode"

export const abandonedBunkerEpisode: Episode = {
  id: "abandoned-bunker",
  title: "The Abandoned Bunker",
  description: "Explore a mysterious bunker hidden in the wasteland",

  // Set the initial scene
  initialScene: "bunker-entrance",

  // Define all scenes within this episode
  scenes: {
    // First scene: Bunker Entrance
    "bunker-entrance": {
      id: "bunker-entrance",
      title: "Bunker Entrance",
      text: `You've discovered a half-buried metal hatch in the wasteland. Years of sand and debris 
      have been recently cleared away, suggesting someone has been here before you.
      
      The heavy steel door stands ajar, revealing a dark stairwell descending into the earth. 
      A faint humming sound emanates from below, indicating that somehow, after all these years, 
      there might still be power.
      
      The air that wafts up from the opening is cool and stale.`,
      options: [
        {
          id: "enter-bunker",
          text: "Descend the stairs into the bunker",
          scene: "control-room", // Navigate to the control room scene
        },
        {
          id: "examine-surroundings",
          text: "Examine the area around the entrance",
          scene: "entrance-examination", // Navigate to a detail scene
        },
        {
          id: "leave-bunker",
          text: "Decide it's too dangerous and leave",
          scene: "ending-leave", // Navigate to an ending scene
        },
      ],
    },

    // Entrance examination scene
    "entrance-examination": {
      id: "entrance-examination",
      title: "Bunker Surroundings",
      text: `You carefully examine the area around the bunker entrance. You find several sets of 
      footprints leading both in and out of the bunker, suggesting multiple recent visitors.
      
      Near the entrance, you discover a dropped notebook. Most pages are water-damaged and illegible, 
      but one entry catches your eye:
      
      "...found the control room. Power still works somehow. The vault is sealed, but I think the 
      terminal can open it. Need to find the password..."
      
      The last entry is dated just three days ago.`,
      options: [
        {
          id: "enter-after-reading",
          text: "Descend into the bunker with this new information",
          scene: "control-room", // Navigate to the control room scene
          setFlags: { "found-notebook": true },
        },
        {
          id: "leave-bunker",
          text: "Decide it's too dangerous and leave",
          scene: "ending-leave", // Navigate to an ending scene
        },
      ],
    },

    // Control room scene
    "control-room": {
      id: "control-room",
      title: "Bunker Control Room",
      text: `At the bottom of the stairs, you find yourself in a control room filled with ancient 
      computer terminals and monitoring equipment. Surprisingly, some of the screens still flicker 
      with life, casting a pale green glow across the room.
      
      A large reinforced door on the far wall appears to be sealed shut. Next to it is a terminal 
      with a password prompt glowing on the screen.
      
      On a desk nearby, you notice a framed photograph of a family, a coffee mug with "DIRECTOR" 
      printed on it, and a calendar frozen in time from the day the bombs fell.`,
      options: [
        {
          id: "try-terminal",
          text: "Try to access the terminal",
          scene: "terminal-attempt", // Navigate to the terminal scene
        },
        {
          id: "examine-desk",
          text: "Examine the desk more carefully",
          scene: "desk-examination", // Navigate to the desk examination scene
        },
        {
          id: "return-to-surface",
          text: "Return to the surface",
          scene: "bunker-entrance", // Go back to the entrance scene
        },
      ],
    },

    // Desk examination scene
    "desk-examination": {
      id: "desk-examination",
      title: "Director's Desk",
      text: `You carefully examine the desk that must have belonged to the bunker's director. 
      The photograph shows a man with his wife and daughter, standing in front of what looks like 
      this very bunker when it was new.
      
      Turning over the frame, you find an inscription: "To Robert - Remember your password is 
      Emma's birthday - Love, Sarah"
      
      Looking at the calendar on the desk, you notice a date circled in red - July 16th - with 
      "Emma's Birthday!" written next to it.`,
      options: [
        {
          id: "try-password",
          text: "Try using the birthday as a password on the terminal",
          scene: "vault-entrance", // Navigate to the vault scene
          setFlags: { "found-password": true },
        },
        {
          id: "return-to-control-room",
          text: "Return to examining the control room",
          scene: "control-room", // Go back to the control room scene
        },
      ],
    },

    // Terminal attempt scene
    "terminal-attempt": {
      id: "terminal-attempt",
      title: "Terminal Access",
      text: `You sit down at the terminal and are faced with a password prompt. The screen reads:
      
      "VAULT ACCESS CONTROL SYSTEM"
      "ENTER DIRECTOR AUTHORIZATION CODE:"
      
      You try a few common passwords, but nothing works. The system doesn't appear to lock you out 
      after failed attempts, at least.`,
      options: [
        {
          id: "try-notebook-hint",
          text: "Try using information from the notebook you found",
          // Only available if you found the notebook
          condition: {
            flags: { "found-notebook": true },
          },
          scene: "terminal-attempt", // Stay in the same scene
          setFlags: { "tried-notebook": true },
        },
        {
          id: "return-to-control-room",
          text: "Step away from the terminal",
          scene: "control-room", // Go back to the control room scene
        },
      ],
    },

    // Vault entrance scene
    "vault-entrance": {
      id: "vault-entrance",
      title: "The Vault Opens",
      text: `You type "0716" into the terminal, and after a moment's processing, the screen flashes:
      
      "ACCESS GRANTED - WELCOME, DIRECTOR MITCHELL"
      
      With a loud hiss of hydraulics and the grinding of gears that haven't moved in decades, 
      the massive vault door slowly swings open. Stale air rushes out, and lights automatically 
      flicker on inside, revealing a chamber that has remained sealed since the war.
      
      Through the doorway, you can see shelves stocked with preserved supplies, medical equipment, 
      and what appears to be a collection of data storage devices.`,
      options: [
        {
          id: "enter-vault",
          text: "Enter the vault",
          scene: "ending-discovery", // Navigate to the discovery ending scene
        },
        {
          id: "leave-immediately",
          text: "Something feels wrong - leave immediately",
          scene: "ending-leave", // Navigate to the leaving ending scene
        },
      ],
    },

    // Ending scene - discovery
    "ending-discovery": {
      id: "ending-discovery",
      title: "A Valuable Discovery",
      text: `You step into the vault, amazed at the pristine condition of everything inside. This 
      bunker has protected its contents perfectly for over a century.
      
      Among the supplies, you find medicine that will save lives back at your settlement. The data 
      storage devices contain pre-war knowledge that has been lost for generations - agricultural 
      techniques, engineering plans, and historical records.
      
      Most valuable of all, you discover a sealed case containing seeds - hundreds of varieties 
      that could help restore plant life to the wasteland.
      
      As you carefully pack what you can carry, you realize you've found something beyond mere 
      treasure. You've discovered hope for the future.
      
      THE END`,
      options: [
        {
          id: "restart",
          text: "Return to the beginning",
          scene: "bunker-entrance", // Return to the start to play again
        },
      ],
    },

    // Ending scene - leave
    "ending-leave": {
      id: "ending-leave",
      title: "Better Safe Than Sorry",
      text: `You decide that exploring the mysterious bunker isn't worth the risk. Too many things 
      in the wasteland that seem like opportunities turn out to be deathtraps.
      
      As you walk away, you can't help but wonder what secrets the bunker might have held. But 
      you've survived this long by being cautious, and you'll live to explore another day.
      
      Sometimes, the wisest choice is to walk away.
      
      THE END`,
      options: [
        {
          id: "restart",
          text: "Return to the beginning",
          scene: "bunker-entrance", // Return to the start to play again
        },
      ],
    },
  },

  // For backward compatibility - these will be used if scenes aren't supported
  text: `You've discovered a half-buried metal hatch in the wasteland. Years of sand and debris 
  have been recently cleared away, suggesting someone has been here before you.
  
  The heavy steel door stands ajar, revealing a dark stairwell descending into the earth.`,
  options: [
    {
      id: "enter-bunker",
      text: "Descend the stairs into the bunker",
      nextEpisode: "abandoned-bunker",
    },
    {
      id: "leave-bunker",
      text: "Decide it's too dangerous and leave",
      nextEpisode: "abandoned-bunker",
    },
  ],
}
