import { CHALK_MODEL_API_KEY, CHALK_MODEL_BASE_URL, CHALK_MODEL, prompt } from '~/utils'
import { SYSTEM, USER } from './prompts'
import { action, type ChalkActions, type ChalkCalledAction, type ChalkEndAction, type ChalkOperateAction } from '~/types/agent'
import type { Operation } from '~/types'
import { parse } from './parse'
import { createChunkFilter } from '~/utils/retrieve/filter'
import { QDRANT_URL, QDRANT_API_KEY, EMBEDDING_MODEL_BASE_URL, EMBEDDING_MODEL_API_KEY, EMBEDDING_MODEL } from '~/utils/env'
import type { StreamTextEvent } from '../types'
import { embed, streamText, type Message } from 'ai'
import { message } from '~/utils/ai-sdk/message'
import { embeddingModel } from '~/utils/ai-sdk/embedding-provider'
import { chalkModel } from '~/utils/ai-sdk/provider'

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
      model: embeddingModel,
      value: options.input,
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
    const { fullStream, response } = await streamText({
      model: chalkModel,
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
    context.push(...(await response).messages as Message[])

    return action<ChalkEndAction>('chalk-end', {
      page: options.page,
      result: content,
    })
  }
}