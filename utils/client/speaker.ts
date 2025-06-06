import { defineClient } from "./common";
import { SPEAKER_MODEL_BASE_URL, SPEAKER_MODEL_API_KEY } from "../env";

export const speaker = defineClient(
  SPEAKER_MODEL_BASE_URL,
  SPEAKER_MODEL_API_KEY,
)