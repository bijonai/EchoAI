import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './chats'
import { DATABASE_URL } from '@/utils'

const db = drizzle({
  connection: DATABASE_URL,
  schema,
})

export default db
