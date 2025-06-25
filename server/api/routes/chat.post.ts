import { EventStream } from "openai/lib/EventStream.mjs"
import { and, eq } from "drizzle-orm"
import db, { chats } from "~/db"
import { ChatRequest } from "~/server/types/request"
import { withAuth } from "~/types/auth"
import { createDesigner } from "~/workflow/designer"
import { initialize } from "~/server/utils/initialize"
import { ChalkResult, Message as ChatMessage, DesignerResult, LayoutResult, SpeakerResult } from "~/types"
import { Branch, Step } from "~/types/timeline"
import { Message } from "xsai"
import { createSpeaker } from "~/workflow/speaker"
import { createLayout } from "~/workflow/layout"
import { createChalk } from "~/workflow/chalk"
import { END, findStep, findStepNext } from "~/composables"
import { Action, ActionOperation, DesignerDoneAction, DesignerStartAction, LayoutStartAction, MessageAddAction, MessageChunkAction, MessageUpdateAction, SpeakerDoneAction, SpeakerStartAction, TimelineCreateAction } from "~/server/types"
import createUpdate from "~/utils/update"


function createGenerateSSE(chat_id: string) {
  return <T extends Action<ActionOperation, Record<string, unknown>>>(action: T['action'], data: T['data']): string => {
    return JSON.stringify({
      action,
      data,
      chat_id,
      timestamp: Date.now(),
    } as T)
  }
}

export default defineEventHandler(async (event) => {
  const body = <ChatRequest>JSON.parse(await readBody(event))
  const userId = (event as unknown as withAuth)['userId']
  const stream = createEventStream(event)
  const [data] = await db.select({
    id: chats.id,
    uid: chats.uid,
    context: chats.context,
    board: chats.board,
    branches: chats.branches,
    designer_context: chats.designer_context,
    designer_results: chats.designer_results,
    speaker_context: chats.speaker_context,
    speaker_results: chats.speaker_results,
    layout_context: chats.layout_context,
    layout_results: chats.layout_context,
    chalk_context: chats.chalk_context,
    chalk_results: chats.chalk_results,
  }).from(chats).where(and(
    eq(chats.uid, userId),
    eq(chats.id, body.chat_id)
  ))

  const {
    context,
    branches,
    designerContext,
    designerResults,
    speakerContext,
    speakerResults,
    layoutContext,
    layoutResults,
    chalkContext,
    chalkResults,
  } = initialize<{
    context: ChatMessage,
    branches: Branch,
    designerContext: Message,
    designerResults: DesignerResult,
    speakerContext: Message,
    speakerResults: SpeakerResult,
    layoutContext: Message,
    layoutResults: LayoutResult,
    chalkContext: Message,
    chalkResults: ChalkResult,
  }>({
    context: data.context,
    branches: data.branches,
    designerContext: data.designer_context,
    designerResults: data.designer_results,
    speakerContext: data.speaker_context,
    speakerResults: data.speaker_results,
    layoutContext: data.layout_context,
    layoutResults: data.layout_context,
    chalkContext: data.chalk_context,
    chalkResults: data.chalk_context,
  })

  const designer = createDesigner(designerContext)
  const speaker = createSpeaker(speakerContext)
  const layout = createLayout(layoutContext)
  const chalk = createChalk(chalkContext)
  const generateSSE = createGenerateSSE(body.chat_id)
  const update = createUpdate(body.chat_id)

  let stepId: string | null = null
  const start = Date.now()

  if (body.type === 'doubt') {
    // ------------ Doubt ------------ <Designer>
    const messageId = crypto.randomUUID()
    stream.push(
      generateSSE<DesignerStartAction>('designer-start', {
        input: body.input,
        refs: [],
        step_id: body.step_id,
      })
    )
    stream.push(
      generateSSE<MessageAddAction>('message-add', {
        message_id: messageId,
        message: {
          role: 'processor',
          content: 'Designer is working...',
          isLoading: true,
        }
      })
    )
    const startStep = body.step_id ? findStep(body.step_id, branches)?.step : void 0
    const nextStep = body.step_id ?
      findStepNext(body.step_id, branches) === END
        ? void 0
        : (<Step>findStepNext(body.step_id, branches)).step
      : void 0
    const designerResult = await designer({
      prompt: body.input,
      step: startStep,
      next_step: nextStep,
    })
    designerResults.push({
      step: body.step_id,
      result: designerResult,
      prompt: body.input,
      // refs: [],
    })
    event.waitUntil(update({
      designer_results: designerResults,
      designer_context: designerContext,
    }))
    stepId = designerResult[0].step.toString()
    stream.push(
      generateSSE<TimelineCreateAction>('timeline-create', {
        branch: {
          start: startStep,
          end: nextStep,
          steps: designerResult,
        }
      })
    )
    stream.push(
      generateSSE<MessageUpdateAction>('message-update', {
        message_id: messageId,
        message: {
          role: 'processor',
          content: 'Timeline Generated',
          isLoading: false,
        }
      })
    )
    stream.push(
      generateSSE<DesignerDoneAction>('designer-done', {
        time_usage: Date.now() - start,
      })
    )
  } else {
    const nextStep = findStepNext(body.step_id, branches)
    if (nextStep === END) {
      // TODO: Next SSE data
    } else {
      stepId = nextStep!.step.toString()
      const speakerPromise = (async () => {
        const messageId = crypto.randomUUID()
        stream.push(
          generateSSE<SpeakerStartAction>('speaker-start', {
            step_id: body.step_id,
            step: nextStep!,
          })
        )
        stream.push(
          generateSSE<MessageAddAction>('message-add', {
            message_id: messageId,
            message: {
              role: 'user',
              content: ''
            }
          })
        )
        const speakerResult = await speaker({
          step: nextStep!,
          chat_id: body.chat_id,
        })
        for await (const chunk of speakerResult as unknown as Iterable<string>) {
          stream.push(
            generateSSE<MessageChunkAction>('message-chunk', {
              message_id: messageId,
              chunk,
            })
          )
        }
        stream.push(
          generateSSE<SpeakerDoneAction>('speaker-done', {
            time_usage: Date.now() - start,
            step_id: body.step_id,
            step: nextStep!,
          })
        )
      })()
    }
  }

  stream.onClosed(async () => {
    await stream.close()
  })
  return stream.send()
})