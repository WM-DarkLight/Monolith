# Monolith Adventure Engine

![Monolith Adventure Engine](https://placeholder.svg?height=200&width=600&text=Monolith+Adventure+Engine)

## Overview

Monolith Adventure Engine is a powerful text-based adventure game framework built with Next.js and TypeScript. It provides a robust foundation for creating immersive, choice-driven narrative experiences with RPG elements such as skills, perks, inventory management, and more.

Set in a post-apocalyptic wasteland, the engine comes with a retro-futuristic UI inspired by classic RPGs like Fallout, but can be customized to fit any setting or theme.

## Key Features

- **Rich Text-Based Adventures**: Create branching narratives with multiple paths and endings
- **Skill System**: Character skills that affect gameplay options and outcomes
- **Perk System**: Unlockable abilities that provide unique bonuses and gameplay options
- **Inventory Management**: Item collection, usage, and management
- **Save System**: Multiple save slots with auto-save functionality
- **Character Creation**: Custom character building with skill allocation
- **Skill Checks**: Challenge-based gameplay with probability of success based on character skills
- **Journal System**: Automatic tracking of player choices and story progression
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/monolith-adventure-engine.git
cd monolith-adventure-engine
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the game.

## Basic Usage

The Monolith Adventure Engine comes with several example episodes to demonstrate its capabilities. To start playing:

1. Launch the application
2. Select "Episodes" from the dashboard
3. Choose an episode to begin your adventure

To create your own episodes and extend the engine, see the [Developer Documentation](DEVELOPER.md).

## Technologies Used

- **Next.js**: React framework for the application
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework for styling
- **IndexedDB**: Browser database for save game storage
- **LZ-String**: Compression library for efficient save data storage

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by classic text-based adventures and RPGs
- UI design influenced by post-apocalyptic games like Fallout

## Further Documentation

For detailed information on how to create custom episodes, perks, and skills, see the [Developer Documentation](DEVELOPER.md).
