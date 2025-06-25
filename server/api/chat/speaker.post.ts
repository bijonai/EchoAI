import { and, eq } from "drizzle-orm";
import db from "~/db";
import { withAuth } from "~/types/auth";
import { chats } from "~/db";
import { createSpeaker } from "~/workflow/speaker";
import { message, Message } from "xsai";
import { SpeakerResult, SpeakerResponse, Message as ChatMessage } from "~/types";
import createUpdate from "~/utils/update";

export default defineEventHandler(async (event) => {
  const body = await JSON.parse(await readBody(event));
  const userId = (event as unknown as withAuth)["userId"];
  const [{ context: readContext, chatContext: readChatContext, results: readResults }] = await db.select({
    chatContext: chats.speaker_context,
    results: chats.speaker_results,
    context: chats.context,
    id: chats.id,
    uid: chats.uid,
  }).from(chats)
    .where(and(
      eq(chats.uid, userId), eq(chats.id, body.chat_id)
    ));

  const chatContext = (readChatContext ?? []) as Message[]
  const results = (readResults ?? []) as SpeakerResult[]
  const context = (readContext ?? []) as ChatMessage[]

  const speaker = createSpeaker(chatContext)
  const result = await speaker(body)

  setResponseHeader(event, "Content-Type", "text/event-stream");
  setResponseHeader(event, "Cache-Control", "no-cache");
  setResponseHeader(event, "Connection", "keep-alive");
  return new ReadableStream({
    async start(controller) {
      const reader = result.getReader()
      let fullContent = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        controller.enqueue(value)
        fullContent += value
      }
      results.push({
        step: body.step,
        content: fullContent,
      })
      chatContext.push(message.assistant(fullContent))
      context.push({ role: 'speaker', content: fullContent, step: body.step })
      const update = createUpdate(body.chat_id)
      event.waitUntil(update({
            speaker_context: chatContext,
            speaker_results: results,
        context,
      }))
      controller.close()
    }
  })
})
