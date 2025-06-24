import { NodeType, type DocumentNode } from "sciux"
import type { ChatInfo } from "."
import type { Step } from "~/types/timeline"
import { chat } from "~/api"

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

  const pageId = ref<number | null>(null)

  function createPage(title: string) {
    const id = unused++
    pages.set(id, { title, document: createEmptyDocument(id) })
    pageId.value = id
  }

  function initialize() {
    createPage('PRIMARY')
  }

  async function apply(step: Step, prompt: string) {
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
    const { document } = pages.get(pageId.value!)!
    await chat.chalk({
      chat_id: info.chat_id,
      layout: content ?? '',
      step: step.step,
      page_id: pageId.value?.toString(),
      components: [],
      document: '',
      stream: true,
    }, {
      onAddNode: (op) => { },
      onSetContent: (op) => { },
      onSetProp: (op) => { },
      onRemoveProp: (op) => { },
      onRemoveNode: (op) => { },
    }, info.token)
  }

  return {
    pageId,
    initialize,
    createPage,
    apply,
  }
}