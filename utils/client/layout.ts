import { defineClient } from "./common";
import { LAYOUT_MODEL_BASE_URL, LAYOUT_MODEL_API_KEY } from "../env";

export const layout = defineClient(
  LAYOUT_MODEL_BASE_URL,
  LAYOUT_MODEL_API_KEY,
)