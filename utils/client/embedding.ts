import { EMBEDDING_MODEL_BASE_URL, EMBEDDING_MODEL_API_KEY } from "../env";
import { defineClient } from "./common";

console.log(EMBEDDING_MODEL_BASE_URL, EMBEDDING_MODEL_API_KEY)
export const embedding = defineClient(
  EMBEDDING_MODEL_BASE_URL,
  EMBEDDING_MODEL_API_KEY,
)
