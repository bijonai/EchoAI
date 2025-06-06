import { defineClient } from "./common";
import { DESIGNER_MODEL_BASE_URL, DESIGNER_MODEL_API_KEY } from "../env";

export const designer = defineClient(
  DESIGNER_MODEL_BASE_URL,
  DESIGNER_MODEL_API_KEY,
)