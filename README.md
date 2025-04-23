Monolith Engine

"In the dust-choked echoes of the end, stories still matter. The Monolith remembers."

Monolith is a modular, narrative-focused engine for building text-based RPGs with rich branching choices, dynamic flags, skill/perk systems, and a persistent story state. It is built in Next.js + TypeScript + React, designed to power episodic or scene-driven narrative games in the spirit of Fallout 2, Sunless Sea, and Disco Elysium.

✨ Features

• Scene-Based Navigation

Each episode contains a set of uniquely identified scenes.

Choices move the player between scenes using scene: "scene-id".

• Conditional Branching

Use flags, inventory, and skills to gate options and change content dynamically.

Supports passive checks or explicit player-triggered logic.

• Inventory System

Add/remove/check for items.

Scene options can require or grant items.

• Skills and Perks

Scenes can include skillChecks or perk-based conditions.

Perks modify options, descriptions, or outcomes.

• Reputation System

Faction-based or individual-based reputation tracking.

Affects branching scenes, trust scores, or conditional dialogue.

• Multiple Endings + Replay

Easily define narrative end states.

Includes restart mechanics with memory (carry flags/perks forward).

• Modular Episodes

Each episode is a self-contained .ts file.

Episodes can be swapped, reordered, or injected dynamically.

• State Management

Global state managed through a single hook (useGameState).

Handles flags, inventory, skill states, reputation, current scene, and player memory.
📂 Folder Structure

monolith-engine/
├── episodes/              # Episode definitions (scene graphs)
├── types/                 # Shared interfaces (Episode, Scene, Option, etc.)
├── ui/                    # UI components (TextDisplay, OptionsPanel, etc.)
├── app.tsx                # Main entry point
├── state.ts               # Global game state + logic
├── components/            # Reusable logic-bound UI pieces
├── public/                # Static files
└── README.md              # This file

🚀 Getting Started

1. Clone and install dependencies

git clone https://github.com/yourusername/monolith-engine.git
cd monolith-engine
npm install

2. Start the dev server

npm run dev

3. Open in browser

Visit http://localhost:3000 to begin.

📚 Episode Format

Each episode is defined in a TypeScript file, exporting a single Episode object.

export const abandonedBunkerEpisode: Episode = {
  id: "abandoned-bunker",
  initialScene: "bunker-entrance",
  scenes: {
    "bunker-entrance": {
      id: "bunker-entrance",
      text: "You see a half-buried hatch...",
      options: [
        { id: "descend", text: "Go inside", scene: "control-room" },
        { id: "leave", text: "Walk away", scene: "ending-leave" },
      ],
    },
    // More scenes here...
  },
};

You can add conditions, setFlags, requiredItems, reputationChanges, and more.

🛠️ Built With

Next.js - Framework for React

TypeScript - Static typing for safer logic

React - Component-based UI system

📊 Roadmap



📜 License

MIT License.
Free to use, modify, and build upon. Attribution appreciated.


## Further Documentation

For detailed information on how to create custom episodes, perks, and skills, see the [Developer Documentation](DEVELOPER.md).
