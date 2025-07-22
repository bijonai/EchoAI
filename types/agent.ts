import type { Design } from "./design"
import type { Operation } from "./operation"

export interface ActionSuccess<N extends string, T> {
  type: N
  success: true
  timestamp: Date
  data: T
}
export interface ActionError<N extends string> {
  type: N
  success: false
  timestamp: Date
  error: string
}
export type Action<N extends string, T> = ActionSuccess<N, T> | ActionError<N>
export type ActionData<T extends ActionSuccess<string, any>> = T['data']

// Event Actions

export type ChalkCalledAction = Action<
  'chalk-called',
  {
    page: number
  }
  >
export type ChalkOperateAction = Action<
  'chalk-operate',
  {
    operation: Operation
    page: number
  }
>
export type ChalkEndAction = Action<
  'chalk-end',
  {
    page: number
    result: string
  }
>
export type ChalkActions = ChalkCalledAction | ChalkOperateAction | ChalkEndAction

export type TaskCreatedAction = Action<
  'task-created',
  {
    id: string
  }
>

export type LayoutStartAction = Action<
  'layout-start',
  {}
  >
export type LayoutDoneAction = Action<
  'layout-done',
  {
    layout: string
    page: number
  }
  >
export type LayoutActions = LayoutStartAction | LayoutDoneAction

export type DesignBranchAction = Action<
  'design-branch',
  {
    design: Design
  }
>
export type DesignActions = DesignBranchAction

export type StepToAction = Action<
  'step-to',
  {
    step: string
  }
>
export type StepActions = StepToAction

export type CreatePageAction = Action<
  'create-page',
  {
    id: string
    title: string
  }
>
export type PageActions = CreatePageAction

export type AgentMessageChunkAction = Action<
  'agent-message-chunk',
  {
    chunk: string
  }
  >
export type AgentActions = AgentMessageChunkAction

// Utils
export function action<T extends Action<string, any>>(type: T['type'], data: (T extends ActionSuccess<string, any> ? T['data'] : never)) {
  return {
    type,
    success: true,
    timestamp: new Date(),
    data,
  } as T
}

export function catchAction<T extends Action<string, any>>(type: T['type'], error: string) {
  return {
    type,
    success: false,
    timestamp: new Date(),
    error,
  } as T
}
