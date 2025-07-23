import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import type { PgColumn } from "drizzle-orm/pg-core"
import type { Message } from "ai"
import { chats } from "~/db"
import type { Operation } from "~/types"
import type { Task } from "~/types/task"
import type { Design } from "~/types/design"
import type { ChatMessage } from "~/types/message"
import type { PageStore } from "~/types/page"
import type { Status } from "~/types/shared"
import type { Current } from "~/types/current"

export interface UseChatParams {
  chatId: string
  userId: string
}

interface ChangeRecord {
  [key: string]: boolean
}

export function useChat(db: NodePgDatabase, params: UseChatParams) {
  const { chatId, userId } = params
  const auth = and(
    eq(chats.uid, userId),
    eq(chats.id, chatId)
  )
  const single = <T>(arr: T[]) => arr[0]

  let changed: ChangeRecord = {}

  let pages: PageStore | null = null
  let id: string | null = null
  let uid: string | null = null
  let context: Message[] | null = null
  let status: Status | null = null
  let messages: ChatMessage[] | null = null
  let design: Design | null = null
  let title: string | null = null
  let tasks: Task[] | null = null
  let current: Current | null = null

  async function pull(selector: Record<string, PgColumn>) {
    const column = single(await db.select(selector).from(chats).where(auth).limit(1))

    if (!column) {
      throw new Error('Chat not found')
    }

    id = column.id ?? null
    uid = column.uid ?? null
    pages = column.pages as PageStore ?? null
    context = <Message[]>column.context ?? null
    status = <Status>column.status ?? null
    messages = <ChatMessage[]>column.messages ?? null
    design = <Design>column.design ?? null
    title = column.title ?? null
    tasks = <Task[]>column.tasks ?? null
    current = <Current>column.current ?? null

    return {
      id, uid, pages, context, status, messages, design, title, tasks, current,
    }
  }

  function addChange(key: string) {
    if (changed[key]) return
    changed[key] = true
  }

  function updatePageChalkContext(pageId: number, context: Message[]) {
    if (!pages || !pages[pageId]) return
    pages[pageId].chalk_context.length = 0
    pages[pageId].chalk_context.push(...context)
    addChange('pages')
  }

  function updatePageLayoutContext(pageId: number, context: Message[]) {
    if (!pages || !pages[pageId]) return
    console.log(context)
    pages[pageId].layout_context.length = 0
    pages[pageId].layout_context.push(...context)
    addChange('pages')
  }

  function updatePageKnowledge(pageId: number, knowledge: string[]) {
    if (!pages || !pages[pageId]) return
    pages[pageId].knowledge.length = 0
    pages[pageId].knowledge.push(...knowledge)
    addChange('pages')
  }

  function addPageKnowledge(pageId: number, knowledge: string) {
    if (!pages || !pages[pageId]) return
    pages[pageId].knowledge.push(knowledge)
    addChange('pages')
  }

  function updatePageOperation(pageId: number, operation: Operation[]) {
    if (!pages || !pages[pageId]) return
    pages[pageId].operations.length = 0
    pages[pageId].operations.push(...operation)
    addChange('pages')
  }

  function updatePageTitle(pageId: number, title: string) {
    if (!pages || !pages[pageId]) return
    pages[pageId].title = title
    addChange('pages')
  }

  function addPageOperation(pageId: number, operation: Operation) {
    if (!pages || !pages[pageId]) return
    pages[pageId].operations.push(operation)
    addChange('pages')
  }

  function addPage(title: string) {
    if (!pages) return
    const maxId = Object.keys(pages).length > 0 ? Math.max(...Object.keys(pages).map(Number)) : 0
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

  function updateContext(newContext: Message[]) {
    if (!context) return
    context.length = 0
    context.push(...newContext)
    addChange('context')
  }

  function addContext(message: Message) {
    if (!context) return
    context.push(message)
    addChange('context')
  }

  function updateDesign(newDesign: Design) {
    if (!design) return
    design = newDesign
    addChange('design')
  }

  function updateMessages(newMessages: ChatMessage[]) {
    if (!messages) return
    messages.length = 0
    messages.push(...newMessages)
    addChange('messages')
  }

  function addMessage(message: ChatMessage) {
    if (!messages) return
    messages.push(message)
    addChange('messages')
  }

  function updateStatus(newStatus: Status) {
    if (!status) return
    status = newStatus
    addChange('status')
  }

  function updateTitle(newTitle: string) {
    if (!title) return
    title = newTitle
    addChange('title')
  }

  function updateTasks(newTasks: Task[]) {
    if (!tasks) return
    tasks.length = 0
    tasks.push(...newTasks)
    addChange('tasks')
  }

  function addTask(task: Task) {
    if (!tasks) return
    tasks.push(task)
    addChange('tasks')
  }

  function updateTaskStatus(taskId: string, status: Status, timestamp: Date = new Date()) {
    if (!tasks) return
    const task = tasks.find(task => task.id === taskId)
    if (!task) return
    task.status = status
    addChange('tasks')
  }

  function updateCurrent(newCurrent: Current) {
    if (!current) return
    current = newCurrent
    addChange('current')
  }

  function updateCurrentStep(step: string) {
    if (!current) return
    current.step = step
    addChange('current')
  }

  async function apply() {
    if (Object.keys(changed).length === 0) { return }
    const [result] = await db.update(chats)
      .set(Object.fromEntries(Object.keys(changed).map(key => {
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
          case 'tasks':
            return [key, tasks]
          case 'current':
            return [key, current]
          default:
            return [key, null]
        }
      })))
      .where(auth)
      .returning({
        id: chats.id,
        uid: chats.uid,
        pages: chats.pages,
        context: chats.context,
        status: chats.status,
        messages: chats.messages,
        design: chats.design,
        title: chats.title,
        tasks: chats.tasks,
        current: chats.current,
      })
    id = result.id
    uid = result.uid
    pages = result.pages as PageStore
    context = <Message[]>result.context
    status = <Status>result.status
    messages = <ChatMessage[]>result.messages
    design = <Design>result.design
    title = result.title
    tasks = <Task[]>result.tasks
    changed = {}
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
    updateTasks,
    addTask,
    updateTaskStatus,
    updateCurrent,
    updateCurrentStep,
  }
}