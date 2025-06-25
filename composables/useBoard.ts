import { NodeType, parse, querySelectorXPath, type AttributeNode, type DocumentNode, type ElementNode } from "sciux"
import type { ChatInfo } from "."
import type { Step } from "~/types/timeline"
import { chat } from "~/api"
import type { ChalkResult } from "~/types"
import { processChalkCallbacks, type ChalkCallbacks } from "~/api/chat"

export const PAGE = Symbol('PAGE')
export const VIEWING = Symbol('VIEWING')
export const DOCUMENT = Symbol('DOCUMENT')
export const TOTAL = Symbol('TOTAL')

export interface Page {
  title: string
  document: DocumentNode
}

function createEmptyDocument(id: number) {
  return {
    type: NodeType.DOCUMENT,
    children: [],
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
  const document = computed(() => pages.get(viewingId.value!)!.document)
  const total = ref<number>(0)

  provide(PAGE, pageId)
  provide(VIEWING, viewingId)
  provide(DOCUMENT, document)
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

  const operated: string[] = []
  const callbacks: ChalkCallbacks = {
    operated,
    onAddNode: (op) => {
      const { children } = parse(op.content)
      const { document } = pages.get(pageId.value!)!
      const target = <ElementNode>querySelectorXPath(document, op.position)
      if (!target) {
        // TODO: handle error
        return console.error(`Failed to find target node: ${op.position}`)
      }
      target.children.push(...children)
      console.log(document)
    },
    onSetContent: (op) => {
      const { children } = parse(op.content)
      const { document } = pages.get(pageId.value!)!
      const target = <ElementNode>querySelectorXPath(document, op.position)
      if (!target) {
        // TODO: handle error
        return console.error(`Failed to find target node: ${op.position}`)
      }
      target.children.length = 0
      target.children.push(...children)
    },
    onSetProp: (op) => {
      const { document } = pages.get(pageId.value!)!
      const target = <ElementNode>querySelectorXPath(document, op.position)
      if (!target) {
        // TODO: handle error
        return console.error(`Failed to find target node: ${op.position}`)
      }
      target.attributes = target.attributes.filter(attr => attr.name !== op.attr)
      target.attributes.push(<AttributeNode>{
        name: op.attr,
        value: op.value,
      })
    },
    onRemoveProp: (op) => {
      const { document } = pages.get(pageId.value!)!
      const target = <ElementNode>querySelectorXPath(document, op.position)
      if (!target) {
        // TODO: handle error
        return console.error(`Failed to find target node: ${op.position}`)
      }
      target.attributes = target.attributes.filter(attr => attr.name !== op.attr)
    },
    onRemoveNode: (op) => {
      const { document } = pages.get(pageId.value!)!
      const target = <ElementNode>querySelectorXPath(document, op.position)
      if (!target) {
        // TODO: handle error
        return console.error(`Failed to find target node: ${op.position}`)
      }
      const parent = target.parent
      if (!parent) {
        // TODO: handle error
        return console.error(`Failed to find parent node: ${op.position}`)
      }
      parent.children = parent.children.filter(child => child !== target)
    },
  }

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
    }, callbacks, info.token)
  }

  async function apply(result: ChalkResult[]) {
    for (const r of result) {
      const pageId = parseInt(r.page)
      if (!pages.has(pageId)) {
        createPage(r.page, pageId)
      }
      processChalkCallbacks(callbacks, operated, r.output)
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