import type { Episode } from "@/types/episode"

export const skillTestExampleEpisode: Episode = {
  id: "skill-test-example",
  title: "Skill Test Example",
  description: "An example showing success and failure paths",
  text: `You approach a rickety bridge spanning a deep chasm. The wooden planks look worn and some are missing entirely. The wind howls through the canyon below.

On the other side, you can see what appears to be an abandoned outpost that might contain valuable supplies.`,
  options: [
    {
      id: "cross-bridge",
      text: "Carefully cross the bridge using your agility",
      skillCheck: {
        skill: "agility",
        difficulty: 7,
      },
      successText: "You nimbly make your way across the bridge, avoiding the weak spots.",
      failureText: "You slip on a loose plank and nearly fall, forcing you to retreat.",
      nextEpisode: "abandoned-outpost",
      failureEpisode: "canyon-bottom",
      modifyStats: {
        energy: -10,
      },
      failureStats: {
        health: -15,
        energy: -20,
      },
    },
    {
      id: "analyze-bridge",
      text: "Use your perception to analyze the bridge structure",
      skillCheck: {
        skill: "perception",
        difficulty: 6,
      },
      successText: "You identify a safe path across the bridge.",
      failureText: "You can't determine if the bridge is safe to cross.",
      setFlags: { "bridge-analyzed": true },
      nextEpisode: "skill-test-example",
    },
    {
      id: "find-alternate-path",
      text: "Look for another way across the chasm",
      nextEpisode: "chasm-path",
    },
  ],
}

export const abandonedOutpostEpisode: Episode = {
  id: "abandoned-outpost",
  title: "Abandoned Outpost",
  text: `You've successfully crossed the bridge and reached the abandoned outpost. The door creaks as you push it open, revealing a dusty interior that hasn't seen visitors in years.

Inside, you find shelves with various supplies and a locked cabinet that might contain something valuable.`,
  options: [
    {
      id: "search-supplies",
      text: "Search through the supplies",
      addItems: [
        { id: "canned-food", name: "Canned Food", description: "Preserved food that's still edible", quantity: 3 },
        { id: "medical-kit", name: "Medical Kit", description: "Basic medical supplies", quantity: 1 },
      ],
      nextEpisode: "abandoned-outpost-searched",
    },
    {
      id: "pick-lock",
      text: "Try to pick the cabinet lock",
      skillCheck: {
        skill: "agility",
        difficulty: 8,
      },
      successText: "You successfully pick the lock.",
      failureText: "The lock is too complex for you to pick.",
      nextEpisode: "cabinet-contents",
    },
    {
      id: "leave-outpost",
      text: "Leave the outpost",
      nextEpisode: "skill-test-example",
    },
  ],
}

export const canyonBottomEpisode: Episode = {
  id: "canyon-bottom",
  title: "Canyon Bottom",
  text: `You slip and fall from the bridge, tumbling down into the canyon. Fortunately, you manage to grab onto outcroppings on your way down, slowing your fall.

You land hard but survive, finding yourself at the bottom of the canyon. The walls tower above you, and you'll need to find a way back up.`,
  options: [
    {
      id: "climb-up",
      text: "Try to climb back up",
      skillCheck: {
        skill: "strength",
        difficulty: 8,
      },
      successText: "With great effort, you manage to climb back up to where you started.",
      failureText: "The climb is too difficult in your current state.",
      nextEpisode: "skill-test-example",
    },
    {
      id: "follow-canyon",
      text: "Follow the canyon and look for an easier way up",
      nextEpisode: "canyon-path",
    },
    {
      id: "rest-recover",
      text: "Rest and recover your strength",
      modifyStats: {
        health: 15,
        energy: 20,
      },
      nextEpisode: "canyon-bottom",
    },
  ],
}
