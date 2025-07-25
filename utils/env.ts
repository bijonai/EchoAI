// Logto
export const LOGTO_ENDPOINT = process.env.LOGTO_ENDPOINT!
export const LOGTO_APP_ID = process.env.LOGTO_APP_ID!;
export const LOGTO_APP_SECRET = process.env.LOGTO_APP_SECRET!
export const LOGTO_BASE_URL = process.env.LOGTO_BASE_URL!;
export const LOGTO_COOKIE_SECRET = process.env.LOGTO_COOKIE_SECRET!;
export const LOGTO_RESOURCE = process.env.LOGTO_RESOURCE!;
export const LOGTO_SCOPES = process.env.LOGTO_SCOPES ? process.env.LOGTO_SCOPES.split(',') : [];

// Postgres
export const DATABASE_URL = process.env.DATABASE_URL!

// Qdrant
export const QDRANT_URL = process.env.QDRANT_URL!
export const QDRANT_API_KEY = process.env.QDRANT_API_KEY!

// Embedding
export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL!
export const EMBEDDING_MODEL_BASE_URL = process.env.EMBEDDING_MODEL_BASE_URL!
export const EMBEDDING_MODEL_API_KEY = process.env.EMBEDDING_MODEL_API_KEY!

// Designer
export const DESIGNER_MODEL = process.env.DESIGNER_MODEL!
export const DESIGNER_MODEL_BASE_URL = process.env.DESIGNER_MODEL_BASE_URL!
export const DESIGNER_MODEL_API_KEY = process.env.DESIGNER_MODEL_API_KEY!

// Chalk
export const CHALK_MODEL = process.env.CHALK_MODEL!
export const CHALK_MODEL_BASE_URL = process.env.CHALK_MODEL_BASE_URL!
export const CHALK_MODEL_API_KEY = process.env.CHALK_MODEL_API_KEY!

// Speaker
export const SPEAKER_MODEL = process.env.SPEAKER_MODEL!
export const SPEAKER_MODEL_BASE_URL = process.env.SPEAKER_MODEL_BASE_URL!
export const SPEAKER_MODEL_API_KEY = process.env.SPEAKER_MODEL_API_KEY!

// Layout
export const LAYOUT_MODEL = process.env.LAYOUT_MODEL!
export const LAYOUT_MODEL_BASE_URL = process.env.LAYOUT_MODEL_BASE_URL!
export const LAYOUT_MODEL_API_KEY = process.env.LAYOUT_MODEL_API_KEY!

// Devtools
export const BOARD_DEBUG = process.env.BOARD_DEBUG!
