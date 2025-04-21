import { openDB, type DBSchema, type IDBPDatabase } from "idb"
import type { SavedGame } from "@/types/save"
import type { EpisodeSummary } from "@/types/episode"

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
}

let db: IDBPDatabase<MonolithDB> | null = null

export async function initializeDatabase(): Promise<IDBPDatabase<MonolithDB>> {
  if (db) return db

  db = await openDB<MonolithDB>("monolith-db", 1, {
    upgrade(database) {
      // Create saves store
      const savesStore = database.createObjectStore("saves", {
        keyPath: "id",
      })
      savesStore.createIndex("by-timestamp", "timestamp")

      // Create episodes store
      database.createObjectStore("episodes", {
        keyPath: "id",
      })
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
