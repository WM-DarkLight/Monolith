import { compress, decompress } from "lz-string"

/**
 * Compress data to reduce storage size
 * @param data Any serializable data
 * @returns Compressed string representation
 */
export async function compressData<T>(data: T): Promise<string> {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data)

    // Compress the string
    const compressed = compress(jsonString)

    return compressed
  } catch (error) {
    console.error("Data compression failed:", error)
    throw new Error("Failed to compress data")
  }
}

/**
 * Decompress data back to its original form
 * @param compressedData Compressed string
 * @returns Original data object
 */
export async function decompressData<T>(compressedData: string): Promise<T> {
  try {
    // Decompress the string
    const jsonString = decompress(compressedData)

    if (!jsonString) {
      throw new Error("Decompression resulted in null or empty data")
    }

    // Parse the JSON string back to an object
    const data = JSON.parse(jsonString) as T

    return data
  } catch (error) {
    console.error("Data decompression failed:", error)
    throw new Error("Failed to decompress data. The save file may be corrupted.")
  }
}
