import { ActionOperation } from "../types"

export function createAwaiting() {
  const storage = useStorage()
  return async (type: ActionOperation, chat_id: string) => {
    const id = `awaiting-${type}-${crypto.randomUUID()}`
    await storage.setItem(id, {
      action: type,
      data: {},
      timestamp: Date.now(),
      chat_id,
      status: 'pending'
    })
    return id
  }
}