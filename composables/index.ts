import { NodeType, type DocumentNode } from "sciux"
import type { Message } from "xsai"
import type { Branch, Design } from "~/types/design"
import type { ChatMessage } from "~/types/message"
import type { PageStore } from "~/types/page"
import type { Page } from "~/types/page"

export interface ChatInfo {
  chatId: string
  token: string
}

export function createRootNode(id: string): DocumentNode {
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

export interface PageRender extends Page {
  ast: Ref<DocumentNode | null>
  rendered: Ref<Node[] | null>
}

export interface Pages {
  [key: string]: PageRender
}

export interface AgentEnvironment {
  title: Ref<string | null>
  context: Ref<Message[]>
  messages: Ref<ChatMessage[]>
  design: Ref<Design | null>
  step: Ref<string | null>
  pages: Ref<Pages>
  activePageId: Ref<string>
}