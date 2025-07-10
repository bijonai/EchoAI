import type { Chunk } from "./search"

export function createChunkFilter(filtered: (string | number)[] = []) {
  return (chunks: Chunk[]) => chunks.filter(chunk => !filtered.includes(chunk.id))
}