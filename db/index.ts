import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { DATABASE_URL } from '@/utils'
import * as schema from './schema'

const db = drizzle(DATABASE_URL);

export default db
export * from './schema'
