import { NodeType, parse, querySelectorXPath, type AttributeNode, type DocumentNode, type ElementNode } from "sciux"
import type { ChatInfo } from "."
import type { Step } from "~/types/timeline"
import { chat } from "~/api"
import type { ChalkResult } from "~/types"

export const PAGE = Symbol('PAGE')
export const VIEWING = Symbol('VIEWING')
export const VIEWING_DOCUMENT = Symbol('VIEWING_DOCUMENT')
export const ACTIVE_DOCUMENT = Symbol('ACTIVE_DOCUMENT')
export const TOTAL = Symbol('TOTAL')

export interface Page {
  title: string
  document: DocumentNode
}

function createEmptyDocument(id: number) {
  return {
    type: NodeType.DOCUMENT,
    children: [
      {
        type: NodeType.ELEMENT,
        tag: 'root',
        children: [],
        selfClosing: false,
        attributes: [],
      },
    ],
    filename: `page-${id}`,
    raw: '',
  } as DocumentNode
}

export default function useBoard(info: ChatInfo) {
  let unused = 0
  const pages = new Map<number, Page>()

  // PageId: The current page id LLM is working on
  const pageId = ref<number | null>(null)
  // ViewingId: The page id that is currently visible to the user
  const viewingId = ref<number | null>(null)
  // Document: The document that is currently visible to the user
  const viewingDocument = computed(() => pages.get(viewingId.value!)!.document)
  const activeDocument = computed(() => pages.get(pageId.value!)!.document)
  const total = ref<number>(0)

  provide(PAGE, pageId)
  provide(VIEWING, viewingId)
  provide(VIEWING_DOCUMENT, viewingDocument)
  provide(ACTIVE_DOCUMENT, activeDocument)
  provide(TOTAL, total)

  // The view of user is always follow the page id LLM is working on,
  // But when LLM has no new operation, the user was be allowed to switch to other page.
  watch(pageId, (id) => {
    if (id) {
      viewingId.value = id
    }
  })

  function createPage(title: string, givenId?: number) {
    const id = givenId ?? unused++
    pages.set(id, { title, document: createEmptyDocument(id) })
    pageId.value = id
    total.value++
    return id
  }

  function initialize() {
    createPage('PRIMARY')
    viewingId.value = pageId.value
  }

  function switchViewing(operation: 'next' | 'previous'): number
  function switchViewing(operation: number): void
  function switchViewing(operation: unknown): number | void {
    if (typeof operation === 'number') {
      viewingId.value = operation
    } else if (operation === 'next') {
      viewingId.value = (viewingId.value! + 1) % pages.size
      return viewingId.value
    } else if (operation === 'previous') {
      viewingId.value = (viewingId.value! - 1 + pages.size) % pages.size
      return viewingId.value
    }
  }

  const { handleOperation } = useOperator(activeDocument)

  async function next(step: Step, prompt: string) {
    const { content } = await chat.layout({
      chat_id: info.chat_id,
      step,
      prompt,
      page_id_will_be_used: (unused + 1).toString(),
    }, {
      onOperate: (operation) => {
        if (operation.type === 'switch-page') {
          pageId.value = parseInt(operation.pageId)
        } else if (operation.type === 'add-page') {
          createPage(operation.title)
        }
      }
    }, info.token)
    await chat.chalk({
      chat_id: info.chat_id,
      layout: content ?? '',
      step: step.step,
      page_id: pageId.value?.toString(),
      components: [],
      document: '',
      stream: true,
    }, {
      onOperate: (operation) => {
        const result = handleOperation(operation)
        console.log(result, activeDocument.value)
      }
    }, info.token)
  }

  async function apply(result: ChalkResult[]) {
    for (const r of result) {
      const pageId = parseInt(r.page)
      if (!pages.has(pageId)) {
        createPage(r.page, pageId)
      }
      for (const op of r.output) {
        handleOperation(op)
      }
      console.log(pages.get(0))
    }
  }

  return {
    pageId,
    viewingId,
    initialize,
    createPage,
    next,
    switchViewing,
    apply,
  }
}