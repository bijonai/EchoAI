import { eq } from 'drizzle-orm';
import { table as chats } from '@/db/chats'
import db from '@/db'

export default defineTask({
  meta: {
    name: 'save-context',
  },
  async run({ payload, context }) {
    await db
      .update(chats)
      .set(payload.values)
      .where(eq(chats.id, payload.chat_id as string))

    return {
      result: {
        success: true,
        message: 'Chat updated'
      }
    }
  }
})