import type { EpisodeSummary } from "./episode"

export interface Folder {
  id: string
  name: string
  color: string
  description?: string
  episodeIds: string[]
  parentId?: string | null // Parent folder ID for subfolder support
  createdAt: string
  updatedAt: string
}

export type FolderWithEpisodes = Folder & {
  episodes: EpisodeSummary[]
  subfolders?: FolderWithEpisodes[] // Subfolders
}

export interface FolderHierarchy {
  rootFolders: FolderWithEpisodes[]
  flatFolders: Record<string, FolderWithEpisodes>
}
