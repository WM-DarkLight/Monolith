import type { Episode } from "@/types/episode"

/**
 * SCENE-BASED INVENTORY EPISODE TEMPLATE
 *
 * This template builds on the basic scene-based template by adding:
 * - Items that can be added to inventory
 * - Items that can be removed from inventory
 * - Options that require specific items
 * - Scene transitions based on inventory
 *
 * Use this for episodes involving item collection and usage across multiple scenes.
 */
export const sceneBasedInventoryTemplate: Episode = {
  id: "abandoned-laboratory",
  title: "The Abandoned Laboratory",
  description: "Explore a mysterious laboratory and collect useful items",

  // Set the initial scene
  initialScene: "lab-entrance",

  // Define all scenes within this episode
  scenes: {
    // First scene: Laboratory Entrance
    "lab-entrance": {
      id: "lab-entrance",
      title: "Laboratory Entrance",
      text: `You stand at the entrance of an abandoned research laboratory. The heavy metal door 
      is partially open, revealing a dimly lit corridor beyond. Warning signs about biohazards 
      and restricted access hang on the walls, some of them fallen to the floor.
      
      A security keycard reader is mounted beside the door, its light blinking red.`,
      options: [
        {
          id: "squeeze-through",
          text: "Squeeze through the partially open door",
          scene: "main-corridor", // Navigate to another scene in this episode
        },
        {
          id: "use-keycard",
          text: "Use the security keycard on the reader",
          // This option only appears if the player has the keycard
          condition: {
            hasItems: ["security-keycard"],
          },
          // Remove the keycard from inventory (it gets damaged in the process)
          removeItems: ["security-keycard"],
          scene: "main-corridor-lights-on", // Navigate to a different version of the corridor
          setFlags: { "power-restored": true },
        },
        {
          id: "check-surroundings",
          text: "Check the surroundings for useful items",
          scene: "entrance-search", // Navigate to a search scene
        },
        {
          id: "leave-lab",
          text: "Leave the laboratory",
          nextEpisode: "wasteland", // Navigate to a different episode
        },
      ],
    },

    // Search scene: Finding items at the entrance
    "entrance-search": {
      id: "entrance-search",
      title: "Searching the Entrance",
      text: `You search around the laboratory entrance. Among the debris and fallen warning signs, 
      you find a dead security guard slumped against the wall. His uniform is tattered and decayed, 
      but his equipment belt still contains some potentially useful items.`,
      options: [
        {
          id: "take-flashlight",
          text: "Take the flashlight from the guard's belt",
          // Add the flashlight to inventory
          addItems: [
            {
              id: "flashlight",
              name: "Flashlight",
              description: "A sturdy flashlight that still works",
              quantity: 1,
            },
          ],
          scene: "entrance-search", // Stay in the same scene
          setFlags: { "took-flashlight": true },
        },
        {
          id: "take-keycard",
          text: "Take the security keycard from the guard's pocket",
          // This option disappears after taking the keycard
          condition: {
            flags: { "took-keycard": false },
          },
          // Add the keycard to inventory
          addItems: [
            {
              id: "security-keycard",
              name: "Security Keycard",
              description: "A keycard for accessing secure areas of the laboratory",
              quantity: 1,
            },
          ],
          scene: "entrance-search", // Stay in the same scene
          setFlags: { "took-keycard": true },
        },
        {
          id: "return-to-entrance",
          text: "Return to the laboratory entrance",
          scene: "lab-entrance", // Go back to the entrance scene
        },
      ],
    },

    // Main corridor scene (dark version)
    "main-corridor": {
      id: "main-corridor",
      title: "Main Corridor - Dark",
      text: `You're in the main corridor of the laboratory. It's very dark, with only faint emergency 
      lighting providing any illumination. You can make out doors leading to various rooms, but it's 
      difficult to see details.
      
      The air is stale and smells faintly of chemicals.`,
      options: [
        {
          id: "use-flashlight",
          text: "Use your flashlight to see better",
          // This option only appears if the player has the flashlight
          condition: {
            hasItems: ["flashlight"],
          },
          scene: "main-corridor-lit", // Navigate to a better-lit version of the corridor
        },
        {
          id: "try-power",
          text: "Try to find a power switch",
          skillCheck: {
            skill: "perception",
            difficulty: 7,
          },
          successText: "You find a circuit breaker panel on the wall.",
          failureText: "You fumble in the darkness but find nothing useful.",
          scene: "power-control", // On success, go to the power control scene
          failureScene: "main-corridor", // On failure, stay in the current scene
        },
        {
          id: "proceed-carefully",
          text: "Proceed carefully down the corridor",
          scene: "lab-junction", // Navigate to the junction scene
        },
        {
          id: "return-to-entrance",
          text: "Return to the entrance",
          scene: "lab-entrance", // Go back to the entrance scene
        },
      ],
    },

    // Main corridor scene (flashlight version)
    "main-corridor-lit": {
      id: "main-corridor-lit",
      title: "Main Corridor - Flashlight",
      text: `With your flashlight illuminating the way, you can see the main corridor more clearly. 
      There are doors labeled "Research Lab A", "Storage", and "Server Room". At the end of the 
      corridor is a junction.
      
      You notice a circuit breaker panel on one wall, and several ceiling panels have fallen to the floor.`,
      options: [
        {
          id: "check-breaker-panel",
          text: "Check the circuit breaker panel",
          scene: "power-control", // Navigate to the power control scene
        },
        {
          id: "enter-research-lab",
          text: "Enter Research Lab A",
          scene: "research-lab", // Navigate to the research lab scene
        },
        {
          id: "enter-storage",
          text: "Enter the Storage Room",
          scene: "storage-room", // Navigate to the storage room scene
        },
        {
          id: "enter-server-room",
          text: "Enter the Server Room",
          scene: "server-room", // Navigate to the server room scene
        },
        {
          id: "go-to-junction",
          text: "Proceed to the junction",
          scene: "lab-junction", // Navigate to the junction scene
        },
        {
          id: "return-to-entrance",
          text: "Return to the entrance",
          scene: "lab-entrance", // Go back to the entrance scene
        },
      ],
    },

    // Main corridor scene (power restored version)
    "main-corridor-lights-on": {
      id: "main-corridor-lights-on",
      title: "Main Corridor - Lights On",
      text: `The corridor lights flicker on as power is restored to the laboratory. You can now 
      clearly see doors labeled "Research Lab A", "Storage", and "Server Room". At the end of the 
      corridor is a junction.
      
      With the lights on, you notice bloodstains on the floor that you couldn't see before, 
      leading toward the research lab.`,
      options: [
        {
          id: "enter-research-lab",
          text: "Follow the bloodstains to Research Lab A",
          scene: "research-lab", // Navigate to the research lab scene
        },
        {
          id: "enter-storage",
          text: "Enter the Storage Room",
          scene: "storage-room", // Navigate to the storage room scene
        },
        {
          id: "enter-server-room",
          text: "Enter the Server Room",
          scene: "server-room", // Navigate to the server room scene
        },
        {
          id: "go-to-junction",
          text: "Proceed to the junction",
          scene: "lab-junction", // Navigate to the junction scene
        },
        {
          id: "return-to-entrance",
          text: "Return to the entrance",
          scene: "lab-entrance", // Go back to the entrance scene
        },
      ],
    },

    // Power control scene
    "power-control": {
      id: "power-control",
      title: "Circuit Breaker Panel",
      text: `You stand before the circuit breaker panel. Most of the switches are in the OFF position, 
      and there's a layer of dust on everything. A note taped to the panel reads "EMERGENCY POWER ONLY - 
      MAIN GENERATOR OFFLINE".
      
      There's a large red switch labeled "EMERGENCY LIGHTING" and several smaller breakers for 
      different sections of the laboratory.`,
      options: [
        {
          id: "flip-main-switch",
          text: "Flip the main emergency lighting switch",
          scene: "main-corridor-lights-on", // Navigate to the lit corridor scene
          setFlags: { "power-restored": true },
        },
        {
          id: "examine-breakers",
          text: "Examine the individual breakers",
          scene: "breaker-detail", // Navigate to a more detailed breaker scene
        },
        {
          id: "return-to-corridor",
          text: "Return to the corridor",
          // Return to appropriate corridor scene based on whether you have a flashlight
          condition: {
            hasItems: ["flashlight"],
          },
          scene: "main-corridor-lit", // If you have a flashlight
        },
        {
          id: "return-to-dark-corridor",
          text: "Return to the corridor",
          // This option only appears if you don't have a flashlight
          condition: {
            hasItems: ["flashlight"],
            not: true,
          },
          scene: "main-corridor", // If you don't have a flashlight
        },
      ],
    },

    // Storage room scene
    "storage-room": {
      id: "storage-room",
      title: "Storage Room",
      text: `The storage room contains shelves lined with laboratory supplies, most of which are 
      broken or expired. There are chemical containers, some of which have leaked their contents 
      onto the floor, creating multicolored stains.
      
      In one corner, you spot a first aid kit mounted on the wall. On another shelf, there's a 
      hazmat suit that appears to be intact.`,
      options: [
        {
          id: "take-first-aid",
          text: "Take the first aid kit",
          // This option disappears after taking the first aid kit
          condition: {
            flags: { "took-first-aid": false },
          },
          // Add the first aid kit to inventory
          addItems: [
            {
              id: "first-aid-kit",
              name: "First Aid Kit",
              description: "A well-stocked first aid kit with bandages and medicine",
              quantity: 1,
            },
          ],
          scene: "storage-room", // Stay in the same scene
          setFlags: { "took-first-aid": true },
        },
        {
          id: "take-hazmat-suit",
          text: "Take the hazmat suit",
          // This option disappears after taking the hazmat suit
          condition: {
            flags: { "took-hazmat-suit": false },
          },
          // Add the hazmat suit to inventory
          addItems: [
            {
              id: "hazmat-suit",
              name: "Hazmat Suit",
              description: "A protective suit for handling hazardous materials",
              quantity: 1,
            },
          ],
          scene: "storage-room", // Stay in the same scene
          setFlags: { "took-hazmat-suit": true },
        },
        {
          id: "return-to-corridor",
          text: "Return to the corridor",
          // Return to appropriate corridor scene based on power status
          condition: {
            flags: { "power-restored": true },
          },
          scene: "main-corridor-lights-on", // If power is restored
        },
        {
          id: "return-to-dark-corridor",
          text: "Return to the corridor",
          // This option only appears if power is not restored
          condition: {
            flags: { "power-restored": true },
            not: true,
          },
          // Return to appropriate corridor scene based on whether you have a flashlight
          condition: {
            hasItems: ["flashlight"],
          },
          scene: "main-corridor-lit", // If you have a flashlight
        },
        {
          id: "return-to-very-dark-corridor",
          text: "Return to the corridor",
          // This option only appears if power is not restored and you don't have a flashlight
          condition: {
            flags: { "power-restored": true },
            not: true,
          },
          condition: {
            hasItems: ["flashlight"],
            not: true,
          },
          scene: "main-corridor", // If you don't have a flashlight
        },
      ],
    },

    // Additional scenes would be defined here...
  },

  // For backward compatibility
  text: `You stand at the entrance of an abandoned research laboratory. The heavy metal door 
  is partially open, revealing a dimly lit corridor beyond.`,
  options: [
    {
      id: "enter-lab",
      text: "Enter the laboratory",
      nextEpisode: "lab-interior",
    },
    {
      id: "leave-lab",
      text: "Leave the laboratory",
      nextEpisode: "wasteland",
    },
  ],
}
