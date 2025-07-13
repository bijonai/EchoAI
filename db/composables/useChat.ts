import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import type { PgColumn } from "drizzle-orm/pg-core"
import type { Message } from "xsai"
import { chats } from "~/db"
import type { Operation } from "~/types"
import type { Branch, Design } from "~/types/design"
import type { ChatMessage } from "~/types/message"
import type { PageStore } from "~/types/page"
import type { Status } from "~/types/shared"

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

  const changed: string[] = []

  let pages: PageStore | null = null
  let id: string | null = null
  let uid: string | null = null
  let context: Message[] | null = null
  let status: Status | null = null
  let messages: ChatMessage[] | null = null
  let design: Design | null = null
  let title: string | null = null

  async function pull(selector: Record<string, PgColumn>, defaultColumn?: Record<string, any>) {
    const column = defaultColumn ?? single(await db.select(selector).from(chats).where(auth).limit(1))
    id = column.id ?? null
    uid = column.uid ?? null
    pages = column.pages as PageStore ?? null
    context = <Message[]>column.context ?? null
    status = <Status>column.status ?? null
    messages = <ChatMessage[]>column.messages ?? null
    design = <Design>column.design ?? null
    title = column.title ?? null
    return {
      id, uid, pages, context, status, messages, design, title,
    }
  }

  function addChange(key: string) {
    if (changed.includes(key)) return
    changed.push(key)
  }

  function updatePageChalkContext(pageId: number, context: Message[]) {
    if (!pages) return
    const page = pages[pageId]
    if (!page) return
    page.chalk_context.length = 0
    page.chalk_context.push(...context)
    addChange('pages')
  }

  function updatePageLayoutContext(pageId: number, context: Message[]) {
    if (!pages) return
    const page = pages[pageId]
    if (!page) return
    page.layout_context.length = 0
    page.layout_context.push(...context)
  }

  function updatePageKnowledge(pageId: number, knowledge: string[]) {
    if (!pages) return
    const page = pages[pageId]
    if (!page) return
    page.knowledge.length = 0
    page.knowledge.push(...knowledge)
    addChange('pages')
  }

  function addPageKnowledge(pageId: number, knowledge: string) {
    if (!pages) return
    const page = pages[pageId]
    if (!page) return
    page.knowledge.push(knowledge)
    addChange('pages')
  }

  function updatePageOperation(pageId: number, operation: Operation[]) {
    if (!pages) return
    const page = pages[pageId]
    if (!page) return
    page.operations.length = 0
    page.operations.push(...operation)
    addChange('pages')
  }

  function updatePageTitle(pageId: number, title: string) {
    if (!pages) return
    const page = pages[pageId]
    if (!page) return
    page.title = title
    addChange('pages')
  }

  function addPageOperation(pageId: number, operation: Operation) {
    if (!pages) return
    const page = pages[pageId]
    if (!page) return
    page.operations.push(operation)
    addChange('pages')
  }

  function addPage(title: string) {
    if (!pages) return
    const maxId = Math.max(...Object.keys(pages).map(Number))
    const newPage = {
      id: maxId + 1,
      chalk_context: [],
      layout_context: [],
      knowledge: [],
      operations: [],
      title,
    }
    pages[newPage.id] = newPage
    addChange('pages')
    return newPage
  }

  function updateContext(context: Message[]) {
    if (!context) return
    context.length = 0
    context.push(...context)
    addChange('context')
  }

  function addContext(message: Message) {
    if (!context) return
    context.push(message)
    addChange('context')
  }

  function updateDesign(branch: Branch) {
    if (!design) return
    design.root.length = 0
    design.root.push(branch)
    addChange('design')
  }

  function updateMessages(messages: ChatMessage[]) {
    if (!messages) return
    messages.length = 0
    messages.push(...messages)
    addChange('messages')
  }

  function addMessage(message: ChatMessage) {
    if (!messages) return
    messages.push(message)
    addChange('messages')
  }

  function updateStatus(status: Status) {
    if (!status) return
    status = status
    addChange('status')
  }

  function updateTitle(title: string) {
    if (!title) return
    title = title
    addChange('title')
  }
  
  async function apply() {
    const [result] = await db.insert(chats)
      .values(Object.fromEntries(changed.map(key => {
        switch (key) {
          case 'pages':
            return [key, pages]
          case 'uid':
            return [key, uid]
          case 'id':
            return [key, id]
          case 'context':
            return [key, context]
          case 'status':
            return [key, status]
          case 'messages':
            return [key, messages]
          case 'design':
            return [key, design]
          case 'title':
            return [key, title]
          default:
            return [key, null]
        }
      })))
    .returning({
        id: chats.id,
        uid: chats.uid,
        pages: chats.pages,
        context: chats.context,
        status: chats.status,
        messages: chats.messages,
        design: chats.design,
        title: chats.title,
    })
    id = result.id
    uid = result.uid
    pages = result.pages as PageStore
    context = <Message[]>result.context
    status = <Status>result.status
    messages = <ChatMessage[]>result.messages
    design = <Design>result.design
    title = result.title
    changed.length = 0
  }

  return {
    pull,
    apply,
    updatePageChalkContext,
    updatePageLayoutContext,
    updatePageKnowledge,
    addPageKnowledge,
    updatePageOperation,
    addPageOperation,
    addPage,
    updatePageTitle,
    updateContext,
    addContext,
    updateDesign,
    updateMessages,
    addMessage,
    updateStatus,
    updateTitle,
  }
}