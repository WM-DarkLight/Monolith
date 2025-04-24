import { openDB, type DBSchema, type IDBPDatabase } from "idb"
import type { SavedGame } from "@/types/save"
import type { EpisodeSummary } from "@/types/episode"
import type { CampaignProgress } from "@/types/campaign"
import type { Folder } from "@/types/folder"

interface MonolithDB extends DBSchema {
  saves: {
    key: string
    value: SavedGame
    indexes: { "by-timestamp": string }
  }
  episodes: {
    key: string
    value: EpisodeSummary
  }
  campaignProgress: {
    key: string
    value: CampaignProgress
  }
  folders: {
    key: string
    value: Folder
  }
}

let db: IDBPDatabase<MonolithDB> | null = null

export async function initializeDatabase(): Promise<IDBPDatabase<MonolithDB>> {
  if (db) return db

  db = await openDB<MonolithDB>("monolith-db", 3, {
    upgrade(database, oldVersion, newVersion) {
      // Create saves store if it doesn't exist
      if (!database.objectStoreNames.contains("saves")) {
        const savesStore = database.createObjectStore("saves", {
          keyPath: "id",
        })
        savesStore.createIndex("by-timestamp", "timestamp")
      }

      // Create episodes store if it doesn't exist
      if (!database.objectStoreNames.contains("episodes")) {
        database.createObjectStore("episodes", {
          keyPath: "id",
        })
      }

      // Create campaignProgress store if it doesn't exist (new in version 2)
      if (oldVersion < 2 && !database.objectStoreNames.contains("campaignProgress")) {
        database.createObjectStore("campaignProgress", {
          keyPath: "campaignId",
        })
      }

      // Create folders store if it doesn't exist (new in version 3)
      if (oldVersion < 3 && !database.objectStoreNames.contains("folders")) {
        database.createObjectStore("folders", {
          keyPath: "id",
        })
      }
    },
  })

  return db
}

export async function getDatabase(): Promise<IDBPDatabase<MonolithDB>> {
  if (!db) {
    return initializeDatabase()
  }
  return db
}

// Generic CRUD operations

export async function add<T extends keyof MonolithDB>(storeName: T, item: MonolithDB[T]["value"]): Promise<string> {
  const database = await getDatabase()
  const id = await database.add(storeName, item)
  return id.toString()
}

export async function get<T extends keyof MonolithDB>(
  storeName: T,
  id: string,
): Promise<MonolithDB[T]["value"] | undefined> {
  const database = await getDatabase()
  return database.get(storeName, id)
}

export async function getAll<T extends keyof MonolithDB>(storeName: T): Promise<MonolithDB[T]["value"][]> {
  const database = await getDatabase()
  return database.getAll(storeName)
}

export async function put<T extends keyof MonolithDB>(storeName: T, item: MonolithDB[T]["value"]): Promise<string> {
  const database = await getDatabase()
  const id = await database.put(storeName, item)
  return id.toString()
}

export async function remove<T extends keyof MonolithDB>(storeName: T, id: string): Promise<void> {
  const database = await getDatabase()
  await database.delete(storeName, id)
}
