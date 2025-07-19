import { embed, message, streamText, type Message } from 'xsai'
import { CHALK_MODEL_API_KEY, CHALK_MODEL_BASE_URL, CHALK_MODEL, prompt } from '~/utils'
import { SYSTEM, USER } from './prompts'
import { action, type ChalkActions, type ChalkCalledAction, type ChalkEndAction, type ChalkOperateAction } from '~/types/agent'
import type { Operation } from '~/types'
import { parse } from './parse'
import { createChunkFilter } from '~/utils/retrieve/filter'
import { QDRANT_URL, QDRANT_API_KEY, EMBEDDING_MODEL_BASE_URL, EMBEDDING_MODEL_API_KEY, EMBEDDING_MODEL } from '~/utils/env'
import type { StreamTextEvent } from '../types'

const _env = {
  baseURL: CHALK_MODEL_BASE_URL,
  apiKey: CHALK_MODEL_API_KEY,
  model: CHALK_MODEL
}
const _embedding_env = {
  baseURL: EMBEDDING_MODEL_BASE_URL,
  apiKey: EMBEDDING_MODEL_API_KEY,
  model: EMBEDDING_MODEL,
}
const _search_env = {
  baseURL: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
}

export interface ChalkOptions {
  input: string
  page: number
  chunks: (string | number)[]
}

export function createChalk(
  context: Message[]
) {
  if (context.length === 0) {
    context.push(message.system(SYSTEM))
  }

  return async function* (
    options: ChalkOptions,
  ): AsyncGenerator<ChalkActions> {
    yield action<ChalkCalledAction>('chalk-called', { page: options.page })

    // RAG
    const filter = createChunkFilter(options.chunks)
    const { embedding } = await embed({
      ..._embedding_env,
      input: options.input,
    })
    const { chunks } = await search({
      ..._search_env,
      embedding,
      collections: ['refers', 'comps'],
    })
    const references = filter(Object.values(chunks).flat())

    // Start to operate document.
    context.push(message.user(
      prompt(USER, {
        requirement: options.input,
        reference: references.map(chunk => chunk.text).join('\n\n'),
      })
    ))
    const { fullStream, messages } = await streamText({
      ..._env,
      messages: context,
    })
    let content = ''
    const operations: Operation[] = []
    for await (const chunk of fullStream) {
      if (chunk.type === 'text-delta') {
        content += chunk
        const parsed = parse(content)
        if (parsed.length > operations.length) {
          const operation = parsed[operations.length]
          operations.push(operation)
          yield action<ChalkOperateAction>('chalk-operate', {
            operation,
            page: options.page
          })
        }
      }
    }

    context.length = 0
    context.push(...(await messages))

    return action<ChalkEndAction>('chalk-end', {
      page: options.page,
      result: content,
    })
  }
}