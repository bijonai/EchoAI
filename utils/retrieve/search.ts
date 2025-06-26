import { QdrantClient } from "@qdrant/js-client-rest";
export interface SearchParams {
  baseURL: string
  apiKey: string
  embedding: number[]
  collections: string[]
  limit?: number
}
export interface Chunk {
  text: string
  id: string | number
  score: number
}
export async function search(params: SearchParams) {
  const client = new QdrantClient({
    url: params.baseURL,
    apiKey: params.apiKey,
  })
  return {
    chunks: Object.fromEntries(await Promise.all(params.collections.map(async (collection) => {
      const res = await client.search(collection, {
        vector: params.embedding,
        limit: params.limit,
      })
      return [collection, res.map((hit) => ({
        text: hit.payload?.text as string,
        id: hit.id,
        score: hit.score,
      })) as Chunk[]]
    }))) as Record<string, Chunk[]>
  }
}
