import type { EpisodeRegistry } from "@/types/episode"
import { introEpisode } from "./intro"
import { caveEntranceEpisode } from "./cave-entrance"
import { darkCorridorEpisode } from "./dark-corridor"
import { ancientChamberEpisode } from "./ancient-chamber"
import { monolithRoomEpisode } from "./monolith-room"
import { skillTestEpisode } from "./skill-test"
import { perkShowcaseEpisode } from "./perk-showcase"
import { perkShowcaseObservedEpisode } from "./perk-showcase-observed"
import { abandonedBunkerEpisode } from "./abandoned-bunker"
import { factionOutpostEpisode } from "./faction-outpost"
import guardEncounter from "./guard-encounter"

// Central registry of all episodes
export const episodeRegistry: EpisodeRegistry = {
  intro: introEpisode,
  "cave-entrance": caveEntranceEpisode,
  "dark-corridor": darkCorridorEpisode,
  "ancient-chamber": ancientChamberEpisode,
  "monolith-room": monolithRoomEpisode,
  "skill-test": skillTestEpisode,
  "perk-showcase": perkShowcaseEpisode,
  "perk-showcase-observed": perkShowcaseObservedEpisode,
  "abandoned-bunker": abandonedBunkerEpisode,
  "faction-outpost": factionOutpostEpisode,
  "guard-encounter": guardEncounter,
}
