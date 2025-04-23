import type { Episode } from "@/types/episode"

export const factionOutpostEpisode: Episode = {
  id: "faction-outpost",
  title: "Faction Outpost",
  description: "Navigate the complex politics of wasteland factions at a neutral trading outpost.",
  text: `You approach a bustling outpost built from the ruins of a pre-war gas station. Various flags and symbols indicate this is a neutral trading hub where different factions meet to exchange goods and information.

Guards from the Wasteland Survivors patrol the perimeter, while merchants from the Merchants Guild hawk their wares from makeshift stalls. In one corner, you notice a group of Tech Brotherhood members examining salvaged equipment, and in another, a few Raiders sit quietly, watched carefully by everyone else.

As you enter the outpost, people turn to look at you, assessing whether you're a threat or an opportunity.`,
  options: [
    {
      id: "approach-survivors",
      text: "Approach the Wasteland Survivors guards",
      modifyReputation: {
        "wasteland-survivors": {
          value: 5,
          reason: "Showed respect by approaching guards first",
        },
      },
      scene: "survivors-interaction",
    },
    {
      id: "talk-to-merchants",
      text: "Talk to the Merchants Guild traders",
      modifyReputation: {
        "merchants-guild": {
          value: 5,
          reason: "Showed interest in legitimate trade",
        },
      },
      scene: "merchants-interaction",
    },
    {
      id: "examine-tech",
      text: "Examine the Tech Brotherhood's equipment",
      modifyReputation: {
        "tech-brotherhood": {
          value: 5,
          reason: "Showed interest in technology",
        },
      },
      scene: "brotherhood-interaction",
    },
    {
      id: "sit-with-raiders",
      text: "Sit with the Raiders",
      modifyReputation: {
        "wasteland-survivors": {
          value: -10,
          reason: "Associated with known criminals",
        },
        raiders: {
          value: 15,
          reason: "Showed boldness by openly associating with Raiders",
        },
      },
      scene: "raiders-interaction",
    },
    {
      id: "leave-outpost",
      text: "Leave the outpost without interacting",
      nextEpisode: "intro",
    },
  ],
  scenes: {
    "survivors-interaction": {
      id: "survivors-interaction",
      title: "Wasteland Survivors",
      text: `You approach the Wasteland Survivors guards, who eye you cautiously but not hostilely. Their leader, a weathered woman with a shotgun slung across her back, nods at you.

"Welcome, traveler. We keep the peace here. Any trouble, and you'll answer to us," she says matter-of-factly. "But if you're here to trade or gather information, you're welcome to stay."

She explains that the Survivors are trying to rebuild civilization in the wasteland, establishing safe settlements and trade routes between them. They're always looking for capable people to help with security or scavenging missions.`,
      options: [
        {
          id: "offer-help-survivors",
          text: "Offer to help with their security patrols",
          modifyReputation: {
            "wasteland-survivors": {
              value: 10,
              reason: "Volunteered to help with security",
            },
          },
          scene: "survivors-quest",
        },
        {
          id: "ask-about-settlements",
          text: "Ask about their settlements",
          modifyReputation: {
            "wasteland-survivors": {
              value: 5,
              reason: "Showed interest in their rebuilding efforts",
            },
          },
          scene: "survivors-info",
        },
        {
          id: "return-to-outpost",
          text: "Thank them and return to the main area",
          scene: "faction-outpost",
        },
      ],
    },
    "merchants-interaction": {
      id: "merchants-interaction",
      title: "Merchants Guild",
      text: `The Merchants Guild traders welcome you with practiced smiles. Their stalls are filled with a variety of goods - weapons, medicine, food, and even some luxury items that are rare in the wasteland.

"Looking to buy or sell, friend?" asks a portly man with a well-maintained beard. "The Guild guarantees fair prices and quality merchandise, unlike those scavengers who'll sell you rusted junk for premium prices."

He explains that the Merchants Guild controls most legitimate trade in the region, maintaining caravans that travel between settlements. They're always looking for guards to protect their caravans or scouts to find new trade routes.`,
      options: [
        {
          id: "trade-with-merchants",
          text: "Trade with the merchants (get better prices)",
          condition: {
            reputation: {
              "merchants-guild": "friendly",
            },
          },
          scene: "merchants-trade",
        },
        {
          id: "offer-help-merchants",
          text: "Offer to help guard their next caravan",
          modifyReputation: {
            "merchants-guild": {
              value: 10,
              reason: "Volunteered to protect a caravan",
            },
          },
          scene: "merchants-quest",
        },
        {
          id: "ask-about-routes",
          text: "Ask about their trade routes",
          modifyReputation: {
            "merchants-guild": {
              value: 5,
              reason: "Showed interest in their trade network",
            },
          },
          scene: "merchants-info",
        },
        {
          id: "return-to-outpost",
          text: "Thank them and return to the main area",
          scene: "faction-outpost",
        },
      ],
    },
    "brotherhood-interaction": {
      id: "brotherhood-interaction",
      title: "Tech Brotherhood",
      text: `The Tech Brotherhood members are huddled around a disassembled piece of pre-war technology. They look up as you approach, their expressions guarded but curious.

"Interested in the old world's wonders?" asks a woman in a modified hazmat suit with various tech attachments. "Most people only see scrap metal, but we see the knowledge of our ancestors."

She explains that the Tech Brotherhood is dedicated to preserving and understanding pre-war technology. They believe that the key to rebuilding civilization lies in reclaiming the lost knowledge of the past, not just scavenging its remains.`,
      options: [
        {
          id: "share-tech-knowledge",
          text: "Share some technical knowledge you have",
          condition: {
            skills: {
              intelligence: 7,
            },
          },
          modifyReputation: {
            "tech-brotherhood": {
              value: 15,
              reason: "Shared valuable technical knowledge",
            },
          },
          scene: "brotherhood-impressed",
        },
        {
          id: "offer-help-brotherhood",
          text: "Offer to help recover technology from a dangerous location",
          modifyReputation: {
            "tech-brotherhood": {
              value: 10,
              reason: "Volunteered to help recover technology",
            },
          },
          scene: "brotherhood-quest",
        },
        {
          id: "ask-about-technology",
          text: "Ask about their technological discoveries",
          modifyReputation: {
            "tech-brotherhood": {
              value: 5,
              reason: "Showed interest in their technological research",
            },
          },
          scene: "brotherhood-info",
        },
        {
          id: "return-to-outpost",
          text: "Thank them and return to the main area",
          scene: "faction-outpost",
        },
      ],
    },
    "raiders-interaction": {
      id: "raiders-interaction",
      title: "Raiders",
      text: `You sit down with the Raiders, who look surprised at your boldness. The other patrons of the outpost give your table a wide berth, and you notice the Survivors guards watching closely.

"Got guts, I'll give you that," growls a scarred man with a mohawk. "Most people won't be seen with us, even in a neutral zone."

He explains, with no apparent shame, that the Raiders survive by taking what they need from others. "The strong take from the weak. That's the law of the wasteland," he says. "But we're not mindless killers. We have a code... of sorts."`,
      options: [
        {
          id: "suggest-raid",
          text: "Suggest a potential target for them to raid",
          modifyReputation: {
            raiders: {
              value: 20,
              reason: "Provided valuable raiding information",
            },
            "wasteland-survivors": {
              value: -20,
              reason: "Conspired with Raiders",
            },
          },
          scene: "raiders-quest",
        },
        {
          id: "ask-about-territory",
          text: "Ask about their territory",
          modifyReputation: {
            raiders: {
              value: 5,
              reason: "Showed interest in their operations",
            },
          },
          scene: "raiders-info",
        },
        {
          id: "leave-quickly",
          text: "Make an excuse and leave quickly",
          modifyReputation: {
            raiders: {
              value: -5,
              reason: "Showed fear or discomfort",
            },
          },
          scene: "faction-outpost",
        },
      ],
    },
    "survivors-quest": {
      id: "survivors-quest",
      title: "Survivors Quest",
      text: `The guard captain looks pleased with your offer. "We could use an extra pair of eyes. We've had reports of mutant activity near the eastern perimeter. Help us clear them out, and we'll make it worth your while."

She hands you a map marking the location and explains that a small group of mutants has been harassing travelers. The Survivors want them dealt with before they become a bigger problem.`,
      options: [
        {
          id: "accept-survivors-quest",
          text: "Accept the mission",
          modifyReputation: {
            "wasteland-survivors": {
              value: 5,
              reason: "Accepted a mission to help the community",
            },
          },
          nextEpisode: "intro", // This would normally lead to a quest episode
        },
        {
          id: "decline-politely",
          text: "Decline politely",
          scene: "survivors-interaction",
        },
      ],
    },
    "survivors-info": {
      id: "survivors-info",
      title: "Survivors Settlements",
      text: `The guard captain tells you about the network of settlements the Survivors have established. The largest is Haven, a fortified town built around a pre-war water purification plant. They also maintain several smaller outposts and farms.

"We're trying to bring back what was lost," she says. "Not just survival, but community. Working together instead of just looking out for yourself. It's hard work, but it's the only way forward."

She marks several Survivor settlements on your map, including Haven.`,
      options: [
        {
          id: "ask-about-haven",
          text: "Ask more about Haven",
          modifyReputation: {
            "wasteland-survivors": {
              value: 5,
              reason: "Showed interest in their main settlement",
            },
          },
          scene: "survivors-haven",
        },
        {
          id: "return-to-survivors",
          text: "Thank her for the information",
          scene: "survivors-interaction",
        },
      ],
    },
    "merchants-trade": {
      id: "merchants-trade",
      title: "Merchant Trading",
      text: `The merchant recognizes you as a friend of the Guild and offers you special prices not available to the general public. His inventory includes some high-quality items that he keeps hidden from most customers.

"For a valued associate of the Guild, I can offer a 10% discount on all purchases," he says with a wink. "And I might be willing to pay a premium for any interesting items you've found in your travels."`,
      options: [
        {
          id: "buy-special-item",
          text: "Buy a special item (requires friendly reputation)",
          condition: {
            reputation: {
              "merchants-guild": "friendly",
            },
          },
          scene: "merchants-special-item",
        },
        {
          id: "return-to-merchants",
          text: "Thank him and return",
          scene: "merchants-interaction",
        },
      ],
    },
    "merchants-quest": {
      id: "merchants-quest",
      title: "Merchant Quest",
      text: `The merchant's eyes light up at your offer. "As a matter of fact, we do have a caravan heading out tomorrow. The route takes us through some territory that's been seeing raider activity lately. An extra gun would be most welcome."

He explains that the caravan will be carrying valuable medical supplies to a settlement called Riverside. The pay is good, and you'd also receive a discount on Guild merchandise in the future.`,
      options: [
        {
          id: "accept-merchants-quest",
          text: "Accept the job",
          modifyReputation: {
            "merchants-guild": {
              value: 5,
              reason: "Accepted a caravan guard position",
            },
          },
          nextEpisode: "intro", // This would normally lead to a quest episode
        },
        {
          id: "decline-politely",
          text: "Decline politely",
          scene: "merchants-interaction",
        },
      ],
    },
    "merchants-info": {
      id: "merchants-info",
      title: "Merchant Routes",
      text: `The merchant shows you a well-worn map with various routes marked between settlements. "The Guild maintains six major caravan routes," he explains. "The northern route is the safest but longest. The eastern route is fastest but goes near raider territory."

He points out various landmarks and danger zones, giving you valuable information about the region. He also mentions that the Guild is always looking to establish new trade routes if you discover any promising settlements in your travels.`,
      options: [
        {
          id: "ask-about-raiders",
          text: "Ask about the raiders threatening the eastern route",
          modifyReputation: {
            "merchants-guild": {
              value: 5,
              reason: "Showed concern for trade route safety",
            },
          },
          scene: "merchants-raiders",
        },
        {
          id: "return-to-merchants",
          text: "Thank him for the information",
          scene: "merchants-interaction",
        },
      ],
    },
    "brotherhood-impressed": {
      id: "brotherhood-impressed",
      title: "Brotherhood Impressed",
      text: `You share some technical knowledge about the device they're examining, pointing out a power coupling they hadn't noticed. The Brotherhood members look at you with new respect.

"You know your tech," the woman says, clearly impressed. "Most wastelanders can barely tell a circuit board from a dinner plate. Where did you learn about pre-war technology?"

The group becomes much more open with you, showing you some of their other projects and discussing their theories about how certain technologies worked before the war.`,
      options: [
        {
          id: "offer-join-brotherhood",
          text: "Express interest in joining their faction",
          modifyReputation: {
            "tech-brotherhood": {
              value: 10,
              reason: "Expressed interest in joining the Brotherhood",
            },
          },
          scene: "brotherhood-recruitment",
        },
        {
          id: "share-more-knowledge",
          text: "Share more of your technical knowledge",
          condition: {
            skills: {
              intelligence: 8,
            },
          },
          modifyReputation: {
            "tech-brotherhood": {
              value: 10,
              reason: "Shared advanced technical knowledge",
            },
          },
          scene: "brotherhood-collaboration",
        },
        {
          id: "return-to-brotherhood",
          text: "Thank them for the discussion",
          scene: "brotherhood-interaction",
        },
      ],
    },
    "brotherhood-quest": {
      id: "brotherhood-quest",
      title: "Brotherhood Quest",
      text: `The Brotherhood member considers your offer carefully. "We've identified a pre-war research facility that likely contains valuable data," she says. "But the area is heavily irradiated and may have automated defenses still active."

She explains that they need someone to retrieve a specific data storage device from the facility's main computer. The radiation levels mean it would be a dangerous mission, but the Brotherhood would be very grateful for your help.`,
      options: [
        {
          id: "accept-brotherhood-quest",
          text: "Accept the mission",
          modifyReputation: {
            "tech-brotherhood": {
              value: 5,
              reason: "Accepted a technology recovery mission",
            },
          },
          nextEpisode: "intro", // This would normally lead to a quest episode
        },
        {
          id: "decline-politely",
          text: "Decline politely",
          scene: "brotherhood-interaction",
        },
      ],
    },
    "brotherhood-info": {
      id: "brotherhood-info",
      title: "Brotherhood Technology",
      text: `The Brotherhood member explains some of their recent discoveries, showing you diagrams of pre-war devices they've managed to restore to working condition.

"Our greatest achievement was restoring a solar power array," she says proudly. "It provides clean energy to our main compound. We've also made progress in water purification technology and medical equipment."

She explains that the Brotherhood believes technology should be used to benefit humanity, not for destruction as it was before the war. Their goal is to rebuild society with a wiser approach to technological advancement.`,
      options: [
        {
          id: "ask-about-weapons",
          text: "Ask if they've discovered any weapons technology",
          modifyReputation: {
            "tech-brotherhood": {
              value: -5,
              reason: "Showed interest in weapons rather than beneficial technology",
            },
          },
          scene: "brotherhood-weapons",
        },
        {
          id: "ask-about-medicine",
          text: "Ask about their medical technology",
          modifyReputation: {
            "tech-brotherhood": {
              value: 5,
              reason: "Showed interest in beneficial technology",
            },
          },
          scene: "brotherhood-medicine",
        },
        {
          id: "return-to-brotherhood",
          text: "Thank them for sharing their knowledge",
          scene: "brotherhood-interaction",
        },
      ],
    },
    "raiders-quest": {
      id: "raiders-quest",
      title: "Raiders Quest",
      text: `The Raider leader leans in, suddenly very interested. "You know of a good target? Let's hear it."

You mention a location that might be worth raiding, and the Raiders discuss it among themselves, clearly taking your suggestion seriously.

"Not bad," the leader says finally. "We'll check it out. If it pays off, you'll get a cut." He gives you a small token with their gang symbol. "Show this if you run into any of our crews. They'll know you're a friend."`,
      options: [
        {
          id: "accept-raiders-alliance",
          text: "Accept their token of friendship",
          addItems: [
            {
              id: "raider-token",
              name: "Raider Token",
              description: "A metal token marking you as a friend of the Raiders",
              quantity: 1,
            },
          ],
          modifyReputation: {
            raiders: {
              value: 10,
              reason: "Formed an alliance with Raiders",
            },
            "wasteland-survivors": {
              value: -10,
              reason: "Word spread of your Raider connections",
            },
          },
          scene: "raiders-alliance",
        },
        {
          id: "decline-politely",
          text: "Decline, saying you were just making conversation",
          modifyReputation: {
            raiders: {
              value: -10,
              reason: "Backed out of a deal",
            },
          },
          scene: "raiders-angry",
        },
      ],
    },
    "raiders-info": {
      id: "raiders-info",
      title: "Raider Territory",
      text: `The Raider describes their territory, which centers around a fortified former prison they call "The Cage."

"We control the highways for about 20 miles in each direction," he says with pride. "Anyone passing through pays a toll. Call it a tax for our protection services." He laughs darkly at this.

He explains that they're in conflict with the Wasteland Survivors, who've been expanding their patrols into what the Raiders consider their territory. "They think they can push us out, but we've been here longer than their little 'civilization' project."`,
      options: [
        {
          id: "ask-about-cage",
          text: "Ask more about The Cage",
          modifyReputation: {
            raiders: {
              value: 5,
              reason: "Showed interest in their stronghold",
            },
          },
          scene: "raiders-cage",
        },
        {
          id: "suggest-peace",
          text: "Suggest peaceful coexistence with the Survivors",
          condition: {
            skills: {
              charisma: 7,
            },
          },
          modifyReputation: {
            raiders: {
              value: -5,
              reason: "Suggested weakness through peace",
            },
          },
          scene: "raiders-peace",
        },
        {
          id: "return-to-raiders",
          text: "Thank them for the information",
          scene: "raiders-interaction",
        },
      ],
    },
    "faction-outpost": {
      id: "faction-outpost",
      title: "Faction Outpost",
      text: `You return to the main area of the outpost. The various factions continue their activities, occasionally casting glances your way. Your interactions have not gone unnoticed, and you sense that your standing with each group has shifted based on your choices.

The neutral trading outpost continues to buzz with activity as traders haggle, guards patrol, and travelers exchange information about the wasteland beyond.`,
      options: [
        {
          id: "approach-survivors-again",
          text: "Approach the Wasteland Survivors guards",
          scene: "survivors-interaction",
        },
        {
          id: "talk-to-merchants-again",
          text: "Talk to the Merchants Guild traders",
          scene: "merchants-interaction",
        },
        {
          id: "examine-tech-again",
          text: "Examine the Tech Brotherhood's equipment",
          scene: "brotherhood-interaction",
        },
        {
          id: "sit-with-raiders-again",
          text: "Sit with the Raiders",
          scene: "raiders-interaction",
        },
        {
          id: "leave-outpost-final",
          text: "Leave the outpost",
          nextEpisode: "intro",
        },
      ],
    },
  },
}
