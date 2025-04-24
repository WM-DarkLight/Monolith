import type { Episode } from "@/types/episode"
import type { GameState } from "@/types/game"
import { DialogueManager } from "@/modules/dialogue-manager"

const guardEncounter: Episode = {
  id: "guard-encounter",
  title: "The Guard Post",
  description: "An encounter with a guard at a checkpoint.",
  text: "You approach a small guard post on the road. A single guard stands watch, eyeing you suspiciously as you approach.",

  npcs: {
    guard: {
      id: "guard",
      name: "Guard",
      description: "A stern-looking guard in worn armor.",
      initialDialogueId: "greeting",
      memoryFlags: ["spared_guard", "bribed_guard", "threatened_guard", "helped_guard"],
      dialogues: {
        greeting: {
          id: "greeting",
          text: "Halt! State your business, traveler.",
          speakerName: "Guard",
          speakerType: "npc",
          onEnter: (gameState: GameState) => {
            // Check if player has encountered this guard before
            if (DialogueManager.hasMetNPC(gameState, "guard")) {
              // Check if player spared the guard in a previous encounter
              if (DialogueManager.getNPCMemory(gameState, "guard", "spared_guard")) {
                return {
                  ...gameState,
                  dialogueState: {
                    ...gameState.dialogueState,
                    currentNodeId: "greeting_spared",
                  },
                }
              }

              // Check if player bribed the guard
              if (DialogueManager.getNPCMemory(gameState, "guard", "bribed_guard")) {
                return {
                  ...gameState,
                  dialogueState: {
                    ...gameState.dialogueState,
                    currentNodeId: "greeting_bribed",
                  },
                }
              }
            }

            return gameState
          },
          responses: [
            {
              id: "peaceful",
              text: "I'm just passing through. I mean no harm.",
              nextNodeId: "peaceful_response",
            },
            {
              id: "bribe",
              text: "Perhaps some caps would help me pass? (Bribe)",
              nextNodeId: "bribe_response",
              condition: {
                flags: { has_money: true },
              },
            },
            {
              id: "threaten",
              text: "You really don't want to stand in my way. (Threaten)",
              nextNodeId: "threaten_response",
              condition: {
                skills: { strength: { min: 7 } },
              },
            },
            {
              id: "leave",
              text: "Never mind, I'll go another way.",
              nextNodeId: "EXIT",
            },
          ],
        },
        greeting_spared: {
          id: "greeting_spared",
          text: "You... I remember you. You spared my life when you could have ended it. I won't forget that. What do you need?",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "ask_passage",
              text: "I need to get through the checkpoint.",
              nextNodeId: "grant_passage",
            },
            {
              id: "ask_info",
              text: "Any news or rumors I should know about?",
              nextNodeId: "provide_info",
            },
            {
              id: "leave_friendly",
              text: "Just passing by. Take care.",
              nextNodeId: "EXIT",
            },
          ],
        },
        greeting_bribed: {
          id: "greeting_bribed",
          text: "Ah, it's you again. *lowers voice* Got more of those caps to make things... smoother?",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "bribe_again",
              text: "Here's some more. (Pay 10 caps)",
              nextNodeId: "bribe_again_response",
              condition: {
                flags: { has_money: true },
              },
              setFlags: {
                caps: -10,
              },
            },
            {
              id: "no_bribe",
              text: "Not this time. I just need to pass through.",
              nextNodeId: "no_bribe_response",
            },
            {
              id: "leave",
              text: "Never mind, I'll go another way.",
              nextNodeId: "EXIT",
            },
          ],
        },
        peaceful_response: {
          id: "peaceful_response",
          text: "Hmm. You seem harmless enough. But I'm still going to need to see some identification or payment for the toll.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "show_id",
              text: "Here's my identification papers.",
              nextNodeId: "id_response",
              condition: {
                hasItems: ["id_papers"],
              },
            },
            {
              id: "pay_toll",
              text: "I'll pay the toll. (Pay 5 caps)",
              nextNodeId: "toll_paid",
              condition: {
                flags: { has_money: true },
              },
              setFlags: {
                caps: -5,
              },
            },
            {
              id: "leave",
              text: "I don't have either. I'll go another way.",
              nextNodeId: "EXIT",
            },
          ],
        },
        bribe_response: {
          id: "bribe_response",
          text: "*looks around nervously* Well... I suppose I could look the other way. For the right price.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "pay_bribe",
              text: "Here's 20 caps. Let me through.",
              nextNodeId: "bribe_accepted",
              setFlags: {
                caps: -20,
                bribed_guard: true,
              },
            },
            {
              id: "nevermind_bribe",
              text: "On second thought, I'll find another way.",
              nextNodeId: "EXIT",
            },
          ],
        },
        threaten_response: {
          id: "threaten_response",
          text: "*hand moves to weapon* Is that a threat? You should choose your next words carefully.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "back_down",
              text: "No, just a misunderstanding. I'll go another way.",
              nextNodeId: "EXIT",
            },
            {
              id: "intimidate",
              text: "It's a promise. Stand aside or regret it.",
              nextNodeId: "intimidation_success",
              condition: {
                skills: { strength: { min: 8 } },
              },
              setFlags: {
                threatened_guard: true,
              },
            },
            {
              id: "intimidate_fail",
              text: "It's a promise. Stand aside or regret it.",
              nextNodeId: "intimidation_failure",
              condition: {
                skills: { strength: { max: 7 } },
              },
            },
          ],
        },
        bribe_accepted: {
          id: "bribe_accepted",
          text: "*pockets the caps* I didn't see anyone come through here. Move along quickly.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "thanks",
              text: "Thanks. I'll be on my way.",
              nextNodeId: "EXIT",
            },
          ],
        },
        intimidation_success: {
          id: "intimidation_success",
          text: "*swallows hard* Alright, alright. No need for trouble. Go on through. I won't report this.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "leave_threat",
              text: "Smart choice. Remember my face.",
              nextNodeId: "EXIT",
            },
          ],
        },
        intimidation_failure: {
          id: "intimidation_failure",
          text: "*laughs* You don't scare me. Now either pay the toll or turn around.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "pay_toll_after_fail",
              text: "Fine, I'll pay. (Pay 5 caps)",
              nextNodeId: "toll_paid",
              condition: {
                flags: { has_money: true },
              },
              setFlags: {
                caps: -5,
              },
            },
            {
              id: "leave_embarrassed",
              text: "I'll go another way.",
              nextNodeId: "EXIT",
            },
          ],
        },
        id_response: {
          id: "id_response",
          text: "*examines your papers* These seem to be in order. You may pass.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "thanks_id",
              text: "Thank you.",
              nextNodeId: "EXIT",
            },
          ],
        },
        toll_paid: {
          id: "toll_paid",
          text: "*takes the caps* The toll is paid. You may proceed.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "thanks_toll",
              text: "Thanks.",
              nextNodeId: "EXIT",
            },
          ],
        },
        grant_passage: {
          id: "grant_passage",
          text: "For you? No problem. Go right ahead. And... thanks again for what you did.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "appreciate",
              text: "I appreciate it.",
              nextNodeId: "EXIT",
            },
          ],
        },
        provide_info: {
          id: "provide_info",
          text: "Well, there's been reports of raiders to the east. And some strange lights in the sky to the north. People are saying it might be aliens, but I think it's just radiation playing tricks.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "thanks_info",
              text: "Thanks for the information.",
              nextNodeId: "EXIT",
              setFlags: {
                heard_about_raiders: true,
                heard_about_lights: true,
              },
            },
            {
              id: "ask_more_raiders",
              text: "Tell me more about these raiders.",
              nextNodeId: "raider_info",
            },
            {
              id: "ask_more_lights",
              text: "Strange lights? That sounds interesting.",
              nextNodeId: "lights_info",
            },
          ],
        },
        raider_info: {
          id: "raider_info",
          text: "They've been hitting caravans about a day's journey east of here. Well-armed, organized. Not your typical wasteland scum. They've got some kind of symbol painted on their armor - a red skull with lightning bolts.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "thanks_raider_info",
              text: "I'll keep an eye out. Thanks.",
              nextNodeId: "EXIT",
              setFlags: {
                detailed_raider_info: true,
              },
            },
            {
              id: "ask_lights_after_raiders",
              text: "What about those strange lights you mentioned?",
              nextNodeId: "lights_info",
            },
          ],
        },
        lights_info: {
          id: "lights_info",
          text: "Yeah, people have been seeing them for about a week now. Bright green, hovering in the sky to the north. Some folks went to investigate but never came back. The captain's forbidden anyone else from going that way.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "thanks_lights_info",
              text: "Interesting. I'll be careful if I head north.",
              nextNodeId: "EXIT",
              setFlags: {
                detailed_lights_info: true,
              },
            },
            {
              id: "ask_raiders_after_lights",
              text: "Tell me more about those raiders you mentioned.",
              nextNodeId: "raider_info",
              condition: {
                flags: { heard_about_raiders: true },
              },
            },
          ],
        },
        bribe_again_response: {
          id: "bribe_again_response",
          text: "*quickly pockets the caps* Always a pleasure doing business. Go right ahead, and I never saw you.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "thanks_bribe_again",
              text: "Appreciate it.",
              nextNodeId: "EXIT",
            },
          ],
        },
        no_bribe_response: {
          id: "no_bribe_response",
          text: "*frowns* Well, then you'll have to pay the regular toll like everyone else. 5 caps.",
          speakerName: "Guard",
          speakerType: "npc",
          responses: [
            {
              id: "pay_toll_after_no_bribe",
              text: "Fine, here's 5 caps.",
              nextNodeId: "toll_paid",
              condition: {
                flags: { has_money: true },
              },
              setFlags: {
                caps: -5,
              },
            },
            {
              id: "leave_no_bribe",
              text: "I'll go another way.",
              nextNodeId: "EXIT",
            },
          ],
        },
      },
    },
  },

  options: [
    {
      id: "approach",
      text: "Approach the guard and identify yourself",
      scene: "guard_post",
    },
    {
      id: "sneak",
      text: "Try to sneak past the guard post",
      skillCheck: {
        skill: "agility",
        difficulty: 7,
      },
      successText: "You successfully sneak past the guard post without being noticed.",
      failureText: "The guard spots you trying to sneak by!",
      scene: "sneaking_success",
      failureScene: "sneaking_failure",
    },
    {
      id: "observe",
      text: "Observe the guard post from a distance",
      scene: "observation",
    },
    {
      id: "go_back",
      text: "Turn back and find another route",
      nextEpisode: "wasteland_crossroads",
    },
  ],

  scenes: {
    guard_post: {
      id: "guard_post",
      title: "The Guard Post",
      text: "You approach the guard post directly. The guard watches you carefully, hand resting near his weapon.",
      availableNpcs: ["guard"],
      options: [
        {
          id: "continue_journey",
          text: "Continue on your journey",
          condition: {
            flags: { bribed_guard: true },
          },
          nextEpisode: "wasteland_path",
        },
        {
          id: "attack_guard",
          text: "Attack the guard",
          scene: "combat",
        },
        {
          id: "turn_back",
          text: "Turn back",
          nextEpisode: "wasteland_crossroads",
        },
      ],
    },
    sneaking_success: {
      id: "sneaking_success",
      title: "Successful Stealth",
      text: "Using the terrain and shadows to your advantage, you manage to slip past the guard post without being detected. You're now on the other side, free to continue your journey.",
      options: [
        {
          id: "continue",
          text: "Continue on your way",
          nextEpisode: "wasteland_path",
        },
      ],
    },
    sneaking_failure: {
      id: "sneaking_failure",
      title: "Caught!",
      text: 'As you try to sneak past, your foot dislodges some loose stones. The guard\'s head snaps in your direction. "Hey! You there! Stop right where you are!"',
      availableNpcs: ["guard"],
      options: [
        {
          id: "surrender",
          text: "Surrender and approach the guard",
          scene: "guard_post",
        },
        {
          id: "run",
          text: "Run away",
          skillCheck: {
            skill: "agility",
            difficulty: 6,
          },
          successText: "You sprint away before the guard can catch you.",
          failureText: "The guard is faster than you expected and cuts off your escape.",
          nextEpisode: "wasteland_crossroads",
          failureScene: "guard_post",
        },
        {
          id: "attack",
          text: "Attack the guard",
          scene: "combat",
        },
      ],
    },
    observation: {
      id: "observation",
      title: "Observing the Guard Post",
      text: "From your hidden vantage point, you observe the guard post. There appears to be only one guard on duty. He occasionally checks papers from travelers and collects what looks like a toll. The guard seems alert but not particularly vigilant.",
      options: [
        {
          id: "approach_after_observing",
          text: "Approach the guard post",
          scene: "guard_post",
        },
        {
          id: "sneak_after_observing",
          text: "Try to sneak past",
          skillCheck: {
            skill: "agility",
            difficulty: 6, // Easier after observation
          },
          successText: "Using your observations, you time your approach perfectly and slip past unnoticed.",
          failureText: "Despite your careful planning, the guard spots you!",
          scene: "sneaking_success",
          failureScene: "sneaking_failure",
        },
        {
          id: "go_back_after_observing",
          text: "Find another route",
          nextEpisode: "wasteland_crossroads",
        },
      ],
    },
    combat: {
      id: "combat",
      title: "Combat with the Guard",
      text: "You decide to attack the guard. He draws his weapon and prepares to defend himself.",
      options: [
        {
          id: "fight",
          text: "Fight the guard",
          skillCheck: {
            skill: "strength",
            difficulty: 7,
          },
          successText: "After a brief but intense struggle, you overpower the guard.",
          failureText:
            "The guard proves to be more skilled than you anticipated. He wounds you before you can retreat.",
          scene: "guard_defeated",
          failureScene: "guard_victorious",
          modifyStats: {
            health: -10,
          },
          failureStats: {
            health: -30,
          },
        },
        {
          id: "flee_combat",
          text: "Try to flee",
          skillCheck: {
            skill: "agility",
            difficulty: 6,
          },
          successText: "You manage to disengage and escape before the situation gets worse.",
          failureText: "The guard cuts off your escape and wounds you as you try to flee.",
          nextEpisode: "wasteland_crossroads",
          failureScene: "guard_victorious",
          failureStats: {
            health: -20,
          },
        },
      ],
    },
    guard_defeated: {
      id: "guard_defeated",
      title: "Guard Defeated",
      text: "The guard lies defeated at your feet, groaning in pain but still alive.",
      options: [
        {
          id: "spare",
          text: "Spare the guard and continue on your way",
          setFlags: {
            spared_guard: true,
          },
          scene: "journey_continues", // Navigate to a new final scene
        },
        {
          id: "finish",
          text: "Finish the guard",
          setFlags: {
            killed_guard: true,
          },
          scene: "dark_path", // Navigate to a new final scene
        },
        {
          id: "rob",
          text: "Rob the guard and continue",
          setFlags: {
            robbed_guard: true,
            caps: 30, // Add 30 caps
          },
          addItems: [
            {
              id: "guard_key",
              name: "Guard Post Key",
              description: "A key that might open something valuable at the guard post.",
              quantity: 1,
            },
          ],
          scene: "journey_continues", // Navigate to a new final scene
        },
      ],
    },
    guard_victorious: {
      id: "guard_victorious",
      title: "Defeated by the Guard",
      text: 'The guard overpowers you. "That was a stupid move," he says, keeping his weapon trained on you. "Now you\'ve got two choices: pay a fine for assaulting an officer, or I take you in."',
      availableNpcs: ["guard"],
      options: [
        {
          id: "pay_fine",
          text: "Pay the fine (50 caps)",
          condition: {
            flags: { has_money: true },
          },
          setFlags: {
            caps: -50,
          },
          nextEpisode: "wasteland_crossroads",
        },
        {
          id: "go_to_jail",
          text: "Refuse to pay",
          nextEpisode: "wasteland_jail",
        },
      ],
    },
    journey_continues: {
      id: "journey_continues",
      title: "The Journey Continues",
      text: `You leave the guard post behind and continue on your journey. The path ahead stretches into the distance, winding through the wasteland. What other challenges and opportunities await you?

Your encounter with the guard has shaped your reputation in this region. Word will spread of your actions, for better or worse.

THE END`,
      options: [
        {
          id: "continue",
          text: "Continue your adventure",
          nextEpisode: "wasteland_crossroads",
        },
      ],
      isFinal: true, // Mark this as a final scene
    },

    dark_path: {
      id: "dark_path",
      title: "A Dark Path",
      text: `You finish off the guard and continue on your way, leaving the body behind. The weight of your decision hangs over you as you walk the wasteland path.

Your actions today have darkened your reputation in this region. Travelers will speak of the merciless wanderer who kills those who stand in their way.

THE END`,
      options: [
        {
          id: "continue",
          text: "Continue down your dark path",
          nextEpisode: "wasteland_crossroads",
        },
      ],
      isFinal: true, // Mark this as a final scene
    },
  },

  initialScene: "guard_post",
}

export default guardEncounter
