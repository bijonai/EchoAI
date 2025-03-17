import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, QDRANT_API_KEY } from "../env";

export const client = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
})

