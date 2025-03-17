import { defineClient } from "./common";
import { CHALK_MODEL_BASE_URL, CHALK_MODEL_API_KEY } from "../env";

export const chalk = defineClient(
  CHALK_MODEL_BASE_URL,
  CHALK_MODEL_API_KEY,
)