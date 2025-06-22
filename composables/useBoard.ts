import { NodeType, type DocumentNode } from "sciux"

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

export default function useBoard(token?: string) {
  let unused = 1
  const pages = new Map<number, Page>()
  const pageId = ref<number | null>(null)

  function createPage(title: string) {
    const id = unused++
    pages.set(id, { title, document: createEmptyDocument(id) })
    pageId.value = id
  }

  return {
    pageId,
  }
}