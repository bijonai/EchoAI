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
export type ChalkLayoutedAction = Action<
  'chalk-layouted',
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
export type ChalkActions = ChalkCalledAction | ChalkLayoutedAction | ChalkOperateAction | ChalkEndAction

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
