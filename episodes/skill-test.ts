import type { Episode } from "@/types/episode"

export const skillTestEpisode: Episode = {
  id: "skill-test",
  title: "Skill Challenge",
  description: "Test your character's skills in various challenges",
  allowCustomSkills: true,
  skillPoints: 15,
  recommendedSkills: {
    perception: 7,
    agility: 6,
    charisma: 6,
  },
  text: `You've reached a small settlement on the edge of the wasteland. The locals eye you suspiciously as you approach the gates. A guard steps forward, hand resting on his weapon.

"State your business, stranger," he demands. "We don't get many visitors these days, and those we do often bring trouble."

The settlement appears well-fortified, with high walls made of scavenged metal and wood. You can see people moving about inside, and the smell of cooking food makes your stomach rumble.`,
  options: [
    {
      id: "persuade-guard",
      text: "Use your charisma to persuade the guard you mean no harm",
      skillCheck: {
        skill: "charisma",
        difficulty: 7,
      },
      successText: "You convince the guard with your friendly demeanor",
      failureText: "The guard remains suspicious of your intentions",
      nextEpisode: "settlement-interior",
      modifySkills: {
        charisma: 1,
      },
    },
    {
      id: "intimidate-guard",
      text: "Intimidate the guard with your strength",
      skillCheck: {
        skill: "strength",
        difficulty: 6,
      },
      successText: "The guard backs down from your imposing presence",
      failureText: "Your attempt at intimidation fails miserably",
      nextEpisode: "settlement-interior",
    },
    {
      id: "observe-weakness",
      text: "Use your perception to find another way in",
      skillCheck: {
        skill: "perception",
        difficulty: 8,
        bonus: {
          itemId: "binoculars",
          value: 2,
        },
      },
      successText: "You notice a gap in the settlement's defenses",
      failureText: "You fail to find any weaknesses in the settlement's defenses",
      nextEpisode: "settlement-interior",
      modifySkills: {
        perception: 1,
      },
    },
    {
      id: "use-lockpick",
      text: "Try to pick the lock on the side gate",
      condition: {
        hasItems: ["lockpick"],
      },
      skillCheck: {
        skill: "agility",
        difficulty: 5,
      },
      successText: "You successfully pick the lock without being noticed",
      failureText: "Your lockpick breaks in the lock",
      nextEpisode: "settlement-interior",
      removeItems: ["lockpick"],
    },
    {
      id: "leave-settlement",
      text: "Leave and continue your journey elsewhere",
      nextEpisode: "wasteland",
    },
  ],
}
