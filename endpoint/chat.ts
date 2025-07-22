import type { AgentMessageChunkAction, DesignActions, LayoutActions, PageActions, StepActions, TaskCreatedAction } from "~/types/agent";
import type { Task } from "~/types/task";
import type { ChatInfo } from "~/composables/index";
import type { Message } from "xsai";
import type { Current } from "~/types/current";
import type { Design } from "~/types/design";
import type { ChatMessage } from "~/types/message";
import type { Status } from "~/types/shared";
import type { PageStore } from "~/types/page";

export interface Chat {
  id: string
  context: Message[]
  status: Status
  messages: ChatMessage[]
  design: Design
  title: string
  tasks: Task[]
  current: Current
  pages: PageStore
}

async function get(info: ChatInfo) {
  const response = await fetch(`/api/chat/${info.chat_id}`, {
    headers: {
      Authorization: `Bearer ${info.token}`,
    },
  }).catch(err => {
    throw new Error('Failed to fetch ' + err)
  })

  return (await response.json()) as Chat
}

type AgentAction = TaskCreatedAction |
  AgentMessageChunkAction |
  DesignActions |
  StepActions |
  PageActions |
  LayoutActions

async function* agent(info: ChatInfo, input: string) {
  const response = await fetch(`/api/chat/${info.chat_id}/agent`, {
    headers: {
      Authorization: `Bearer ${info.token}`,
    },
    method: 'POST',
    body: JSON.stringify({ input, chatId: info.chat_id }),
  }).catch(err => {
    throw new Error('Failed to fetch', { cause: err })
  })

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Failed to get response reader')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    buffer += decoder.decode(value, { stream: true })
    let lines = buffer.split('\n\n');
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!/^data:.+$/.test(line)) continue;
      let action: AgentAction | null = null
      try {
        action = <AgentAction>JSON.parse(line.slice(6))
      } catch (error) {
        continue
      }
      yield action
    }
  }
}

async function taskInfo(info: ChatInfo, taskId: string) {
  const response = await fetch(`/api/chat/${info.chat_id}/task/${taskId}`, {
    headers: {
      Authorization: `Bearer ${info.token}`,
    },
  }).catch(err => {
    throw new Error('Failed to fetch task info', { cause: err })
  })

  return (await response.json())['data'] as Task
}

async function* taskExecute(info: ChatInfo, taskId: string) {
  const response = await fetch(`/api/chat/${info.chat_id}/task/${taskId}/execute`, {
    headers: {
      Authorization: `Bearer ${info.token}`,
    },
  }).catch(err => {
    throw new Error('Failed to fetch', { cause: err })
  })

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Failed to get response reader')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n\n')
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!/^data:.+$/.test(line)) continue;
      yield line.slice(6).trim()
    }
  }
}


export {
  get,
  agent,
  taskInfo,
  taskExecute,
}
