import type { Message } from "xsai"
import type { Operation } from "./operation"

export interface Page {
  title: string
  operations: Operation[]
  knowledge: string[]
  chalk_context: Message[]
  layout_context: Message[]
}

export interface PageStore {
  [key: string]: Page
}
