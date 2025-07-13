import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import { chats } from "~/db"
import type { PageStore } from "~/types/page"

export interface UseChatParams {
  chatId: string
  userId: string
}
export function useChat(db: NodePgDatabase, params: UseChatParams) {
  const { chatId, userId } = params
  const auth = and(
    eq(chats.uid, userId),
    eq(chats.id, chatId)
  )
  const single = <T>(arr: T[]) => arr[0]

  async function getPageStore(): Promise<PageStore> {
    return single(await db.select({
      id: chats.id,
      uid: chats.uid,
      pages: chats.pages
    }).from(chats).where(auth).limit(1)).pages as PageStore
  }

  return {
    getPageStore,
  }
}