import { v4 as uuidv4 } from "uuid"
import { get, getAll, put, remove } from "@/lib/db"
import type { Folder, FolderWithEpisodes, FolderHierarchy } from "@/types/folder"
import type { EpisodeSummary } from "@/types/episode"

// Get all folders
export async function getFolders(): Promise<Folder[]> {
  try {
    const folders = await getAll("folders")
    return folders
  } catch (error) {
    console.error("Failed to get folders:", error)
    return []
  }
}

// Get folders with episodes and organize into hierarchy
export async function getFoldersWithEpisodes(episodes: EpisodeSummary[]): Promise<FolderHierarchy> {
  try {
    const folders = await getFolders()

    // Create a map of folders with their episodes
    const folderMap: Record<string, FolderWithEpisodes> = {}

    folders.forEach((folder) => {
      const folderEpisodes = episodes.filter((episode) => folder.episodeIds.includes(episode.id))

      folderMap[folder.id] = {
        ...folder,
        episodes: folderEpisodes,
        subfolders: [],
      }
    })

    // Organize into hierarchy
    const rootFolders: FolderWithEpisodes[] = []

    // First pass: identify root folders and build hierarchy
    folders.forEach((folder) => {
      if (!folder.parentId) {
        // This is a root folder
        rootFolders.push(folderMap[folder.id])
      } else if (folderMap[folder.parentId]) {
        // This is a subfolder, add it to its parent
        if (!folderMap[folder.parentId].subfolders) {
          folderMap[folder.parentId].subfolders = []
        }
        folderMap[folder.parentId].subfolders!.push(folderMap[folder.id])
      } else {
        // Parent doesn't exist, treat as root
        rootFolders.push(folderMap[folder.id])
      }
    })

    return {
      rootFolders,
      flatFolders: folderMap,
    }
  } catch (error) {
    console.error("Failed to get folders with episodes:", error)
    return { rootFolders: [], flatFolders: {} }
  }
}

// Create a new folder
export async function createFolder(folderData: Omit<Folder, "id" | "createdAt" | "updatedAt">): Promise<Folder> {
  try {
    const now = new Date().toISOString()
    const newFolder: Folder = {
      ...folderData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    }

    await put("folders", newFolder)
    return newFolder
  } catch (error) {
    console.error("Failed to create folder:", error)
    throw new Error("Failed to create folder")
  }
}

// Create a subfolder
export async function createSubfolder(
  parentId: string,
  folderData: Omit<Folder, "id" | "createdAt" | "updatedAt" | "parentId">,
): Promise<Folder> {
  try {
    // Check if parent folder exists
    const parentFolder = await get("folders", parentId)
    if (!parentFolder) {
      throw new Error(`Parent folder with ID ${parentId} not found`)
    }

    // Create the subfolder with parent reference
    return createFolder({
      ...folderData,
      parentId,
    })
  } catch (error) {
    console.error("Failed to create subfolder:", error)
    throw new Error("Failed to create subfolder")
  }
}

// Update a folder
export async function updateFolder(
  id: string,
  updates: Partial<Omit<Folder, "id" | "createdAt" | "updatedAt">>,
): Promise<Folder> {
  try {
    const folder = await get("folders", id)

    if (!folder) {
      throw new Error(`Folder with ID ${id} not found`)
    }

    const updatedFolder: Folder = {
      ...folder,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await put("folders", updatedFolder)
    return updatedFolder
  } catch (error) {
    console.error(`Failed to update folder ${id}:`, error)
    throw new Error("Failed to update folder")
  }
}

// Delete a folder and all its subfolders
export async function deleteFolder(id: string): Promise<void> {
  try {
    // Get all folders to find subfolders
    const allFolders = await getFolders()

    // Find all subfolders (direct and indirect)
    const subfolderIds = findAllSubfolderIds(allFolders, id)

    // Delete the folder and all its subfolders
    await remove("folders", id)

    // Delete all subfolders
    for (const subfolderId of subfolderIds) {
      await remove("folders", subfolderId)
    }
  } catch (error) {
    console.error(`Failed to delete folder ${id}:`, error)
    throw new Error("Failed to delete folder")
  }
}

// Helper function to find all subfolder IDs (direct and indirect)
function findAllSubfolderIds(folders: Folder[], parentId: string): string[] {
  const directSubfolders = folders.filter((folder) => folder.parentId === parentId)

  if (directSubfolders.length === 0) {
    return []
  }

  const directSubfolderIds = directSubfolders.map((folder) => folder.id)
  const indirectSubfolderIds = directSubfolderIds.flatMap((id) => findAllSubfolderIds(folders, id))

  return [...directSubfolderIds, ...indirectSubfolderIds]
}

// Add episode to folder
export async function addEpisodeToFolder(folderId: string, episodeId: string): Promise<Folder> {
  try {
    const folder = await get("folders", folderId)

    if (!folder) {
      throw new Error(`Folder with ID ${folderId} not found`)
    }

    if (folder.episodeIds.includes(episodeId)) {
      return folder // Episode already in folder
    }

    const updatedFolder: Folder = {
      ...folder,
      episodeIds: [...folder.episodeIds, episodeId],
      updatedAt: new Date().toISOString(),
    }

    await put("folders", updatedFolder)
    return updatedFolder
  } catch (error) {
    console.error(`Failed to add episode ${episodeId} to folder ${folderId}:`, error)
    throw new Error("Failed to add episode to folder")
  }
}

// Remove episode from folder
export async function removeEpisodeFromFolder(folderId: string, episodeId: string): Promise<Folder> {
  try {
    const folder = await get("folders", folderId)

    if (!folder) {
      throw new Error(`Folder with ID ${folderId} not found`)
    }

    const updatedFolder: Folder = {
      ...folder,
      episodeIds: folder.episodeIds.filter((id) => id !== episodeId),
      updatedAt: new Date().toISOString(),
    }

    await put("folders", updatedFolder)
    return updatedFolder
  } catch (error) {
    console.error(`Failed to remove episode ${episodeId} from folder ${folderId}:`, error)
    throw new Error("Failed to remove episode from folder")
  }
}

// Move episode between folders
export async function moveEpisode(
  episodeId: string,
  sourceFolderId: string | null,
  targetFolderId: string | null,
): Promise<void> {
  try {
    // Remove from source folder if specified
    if (sourceFolderId) {
      const sourceFolder = await get("folders", sourceFolderId)
      if (sourceFolder && sourceFolder.episodeIds.includes(episodeId)) {
        await removeEpisodeFromFolder(sourceFolderId, episodeId)
      }
    }

    // Add to target folder if specified
    if (targetFolderId) {
      await addEpisodeToFolder(targetFolderId, episodeId)
    }
  } catch (error) {
    console.error(`Failed to move episode ${episodeId}:`, error)
    throw new Error("Failed to move episode")
  }
}

// Move folder to a new parent (or to root if parentId is null)
export async function moveFolder(folderId: string, newParentId: string | null): Promise<Folder> {
  try {
    // Check for circular references
    if (newParentId) {
      const allFolders = await getFolders()
      const subfolderIds = findAllSubfolderIds(allFolders, folderId)

      if (subfolderIds.includes(newParentId)) {
        throw new Error("Cannot move a folder into its own subfolder")
      }

      // Check if new parent exists
      const newParent = await get("folders", newParentId)
      if (!newParent) {
        throw new Error(`New parent folder with ID ${newParentId} not found`)
      }
    }

    // Update the folder's parent
    return updateFolder(folderId, { parentId: newParentId })
  } catch (error) {
    console.error(`Failed to move folder ${folderId}:`, error)
    throw new Error("Failed to move folder")
  }
}

// Get all episodes not in any folder
export async function getUnorganizedEpisodes(episodes: EpisodeSummary[]): Promise<EpisodeSummary[]> {
  try {
    const folders = await getFolders()
    const allFolderEpisodeIds = new Set(folders.flatMap((folder) => folder.episodeIds))

    return episodes.filter((episode) => !allFolderEpisodeIds.has(episode.id))
  } catch (error) {
    console.error("Failed to get unorganized episodes:", error)
    return episodes // Return all episodes as fallback
  }
}
