🗿 Monolith Engine
"In the dust-choked echoes of the end, stories still matter. The Monolith remembers."

Monolith is a modular, narrative-focused game engine built for crafting text-based RPGs with reactive storytelling, persistent world logic, and branching consequences.

It powers scene-driven adventures in richly imagined worlds where your choices matter — and are remembered.

✨ Features
Scene-Based Navigation
Author tightly scoped scenes connected by unique scene IDs.

Flag System
Track state using global flags. Unlock conditions, branch dialogue, or trigger story events.

Inventory System
Add, remove, and check for items during gameplay. Useful for puzzles, exploration, and character progression.

Skill & Perk Checks
Integrate character traits into dialogue and interaction. Influence choices based on character build.

Reputation System
Persistent faction or character-specific reputation values that influence the world’s response.

Multiple Endings + Replay Support
Let players reach narrative conclusions and restart with memory intact.

Self-contained Episodes
Each episode contains its own scenes, title, and logic. Easy to write, share, and expand.

📁 Folder Structure
bash
Copy
Edit
/episodes/           # Modular episode files (scene trees)
/types/              # Shared TypeScript interfaces (Episode, Scene, etc.)
/ui/                 # UI components (inventory, choices, stats)
/state.ts            # Core game state manager
/app.tsx             # Main game runner (React-based)
🚀 Getting Started
Clone this repository:

bash
Copy
Edit
git clone https://github.com/yourusername/monolith-engine.git
Install dependencies:

nginx
Copy
Edit
npm install
Start the development server:

arduino
Copy
Edit
npm run dev
Open the app in your browser and start editing episodes in /episodes/.

📜 Episode Structure Example
ts
Copy
Edit
export const bunkerEpisode: Episode = {
  id: "bunker",
  initialScene: "entrance",
  scenes: {
    "entrance": {
      id: "entrance",
      text: "You find a sealed metal door buried in sand.",
      options: [
        { id: "open", text: "Open it", scene: "hallway" },
        { id: "leave", text: "Leave", scene: "ending" }
      ]
    }
  }
}
🧱 Built For
Text-based RPGs and IF games

Systems-driven story structures

Post-apocalyptic worlds, mystery arcs, or modular anthologies

📜 License
MIT License. Free to use, fork, and adapt. Attribution appreciated but not required.

## Further Documentation

For detailed information on how to create custom episodes, perks, and skills, see the [Developer Documentation](DEVELOPER.md).
