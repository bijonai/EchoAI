import type { Action } from "~/types/agent"

export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type Task<N extends string, Args extends Record<string, any>> = {
  type: N
  args: Args
  id: string
  executeAt: Date
  status: TaskStatus
} & (
  { status: TaskStatus.COMPLETED, result: Action<string, any>[] } |
  { status: TaskStatus.FAILED, error: string } |
  { status: TaskStatus.PENDING } |
  { status: TaskStatus.RUNNING }
)

// Executer

export interface TaskExecuter<T extends Task<string, any>> {
  name: T['type']
  execute: (args: T['args']) => AsyncGenerator<Action<string, any>>
}
export function defineTaskExecuter<T extends Task<string, any>>(name: T['type'], execute: (args: T['args']) => AsyncGenerator<Action<string, any>>): TaskExecuter<T> {
  return {
    name,
    execute,
  }
}
