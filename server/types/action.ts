import { Message } from "~/types/model"
import { Operation } from "~/types/operation"
import { Branch, Step } from "~/types/timeline"

export type ActionOperation =
  | "designer-start"
  | "designer-done"
  | "timeline-create"
  | "speaker-start"
  | "speaker-done"
  | "message-add"
  | "message-update"
  | "message-chunk"
  | "layout-start"
  | "layout-done"
  | "page-create"
  | "awaiting-page-create"
  | "page-switch"
  | "awaiting-page-switch"
  | "chalk-start"
  | "awaiting-document-content"
  | "chalk-done"
  | "operation-chunk"
  | "step-go-forward"

export type Action<T extends ActionOperation, D extends Record<string, unknown>> = {
  action: T
  data: D
  timestamp: number
  chat_id: string
}

export type DesignerStartAction = Action<"designer-start", {
  input: string
  refs: string[]
  step_id: string
}>
export type DesignerDoneAction = Action<"designer-done", {
  // timeline_id: string
  time_usage: number
}>
export type TimelineCreateAction = Action<"timeline-create", {
  // timeline_id: string
  branch: Branch
}>
export type SpeakerStartAction = Action<"speaker-start", {
  step_id: string
  step: Step
}>
export type SpeakerDoneAction = Action<"speaker-done", {
  step_id: string
  step: Step
  time_usage: number
}>
export type MessageAddAction = Action<"message-add", {
  message_id: string
  message: Message
}>
export type MessageUpdateAction = Action<"message-update", {
  message_id: string
  message: Message
}>
export type MessageChunkAction = Action<"message-chunk", {
  message_id: string
  chunk: string
}>
export type LayoutStartAction = Action<"layout-start", {
  step_id: string
  step: Step
  input: string
}>
export type LayoutDoneAction = Action<"layout-done", {
  step_id: string
  step: Step
  time_usage: number
}>
export type PageCreateAction = Action<"page-create", {
  page_id: string
  step_id: string
  title: string
}>
export type PageSwitchAction = Action<"page-switch", {
  step_id: string
  page_id: string
}>
export type AwaitingPageCreateAction = Action<"awaiting-page-create", {
  step_id: string
  awaiting_id: string
}>
export type AwaitingPageSwitchAction = Action<"awaiting-page-switch", {
  step_id: string
  awaiting_id: string
}>
export type ChalkStartAction = Action<"chalk-start", {
  step_id: string
  step: Step
}>
export type AwaitingDocumentContentAction = Action<"awaiting-document-content", {
  step_id: string
  awaiting_id: string
}>
export type ChalkDoneAction = Action<"chalk-done", {
  step_id: string
  step: Step
  time_usage: number
}>
export type OperationChunkAction = Action<"operation-chunk", {
  step_id: string
  step: Step
  operation: Operation
  operation_id: string
}>
export type StepGoForwardAction = Action<"step-go-forward", {
  previous_step_id: string
  latest_step_id: string
}>

export type AwaitingRespond<T extends ActionOperation, D extends Record<string, unknown>> = {
  action: T
  awaiting_id: string
  data: D
}
export type AwaitingPageCreateRespond = AwaitingRespond<"awaiting-page-create", {
  page_id: string
  success: boolean
}>
export type AwaitingPageSwitchRespond = AwaitingRespond<"awaiting-page-switch", {
  page_id: string
  success: boolean
}>
export type AwaitingDocumentContentRespond = AwaitingRespond<"awaiting-document-content", {
  document: string
  success: boolean
}>
