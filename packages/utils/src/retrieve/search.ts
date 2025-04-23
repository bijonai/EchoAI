import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import { COLLECTION_NAME, EMBEDDING_MODEL } from "../env";

export interface SearchParams {
  collection?: string
  query: string
  topK: number
  model?: string
}

export async function search(
  client: OpenAI,
  qdrant: QdrantClient,
  params: SearchParams,
): Promise<string[]> {
  const embeddingRes = await client.embeddings.create({
    model: params.model ?? EMBEDDING_MODEL,
    input: [params.query],
  });
  const queryVector = embeddingRes.data[0].embedding;
  const searchRes = await qdrant.search(params.collection ?? COLLECTION_NAME, {
    vector: queryVector,
    limit: params.topK,
    with_payload: true,
  })

  const results = searchRes.map(hit => (hit.payload as any).text as string);

  return results;
}
