import type { CampaignRegistry } from "@/types/campaign"
import { wastelandChronicles } from "./wasteland-chronicles"
import { abandonedFacilities } from "./abandoned-facilities"
import { factionWars } from "./faction-wars"

// Central registry of all campaigns
export const campaignRegistry: CampaignRegistry = {
  "wasteland-chronicles": wastelandChronicles,
  "abandoned-facilities": abandonedFacilities,
  "faction-wars": factionWars,
}
