import { prompt } from '~/utils'
import { SYSTEM, USER } from './prompts'
import { action, type ChalkActions, type ChalkCalledAction, type ChalkContextUpdateAction, type ChalkEndAction, type ChalkOperateAction } from '~/types/agent'
import type { Operation } from '~/types'
import { parse } from './parse'
import { createChunkFilter } from '~/utils/retrieve/filter'
import { QDRANT_URL, QDRANT_API_KEY } from '~/utils/env'
import { embed, streamText, type Message } from 'ai'
import { message } from '~/utils/ai-sdk/message'
import { embeddingModel } from '~/utils/ai-sdk/embedding-provider'
import { chalkModel } from '~/utils/ai-sdk/provider'
import { search } from '~/utils/retrieve/search'

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
        content += chunk.textDelta
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

    context.push(...(await response).messages as Message[])

    yield action<ChalkContextUpdateAction>('chalk-context-update', {
      context,
    })

    yield action<ChalkEndAction>('chalk-end', {
      page: options.page,
      result: content,
    })
  }
}