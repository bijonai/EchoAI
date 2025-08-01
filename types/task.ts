import type { Status } from "./shared";

export interface BaseTask<N extends string, T extends Record<string, unknown>> {
  type: N
  data: T
  status: Status
  createAt: Date
  executeAt: Date
  id: string
}

export type ChalkTask = BaseTask<'chalk', {
  input: string
  page: number
}>

export type Task = ChalkTask
