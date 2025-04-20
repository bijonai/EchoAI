import { eq, and } from "drizzle-orm";
import { table as chats } from "../../../db/chats";
import db from "../../../db";
import { ChatCompletionMessageParam } from "openai/resources.mjs";
import { startSpeakerWorkflow } from "@echoai/workflow/speaker";
import logto from "../../utils/logto";

export interface SpeakerRequestBody {
  chat_id: string;
  step: string
  problem: string
  knowledge: string
  explanation: string
  conclusion: string
  prompt?: string
  model?: string
  stream?: boolean
}

export interface SpeakerResponse {
  content: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SpeakerRequestBody>(event);
  const token = getRequestHeader(event, "Authorization")?.split(" ")[1];

  if (!token && process.env.UNAUTHORIZED_MODE !== "true") {
    throw createError({
      statusCode: 401,
      message: "Unauthorized"
    });
  }

  const userId = process.env.UNAUTHORIZED_MODE === "true"
    ? process.env.UNAUTHORIZED_MODE_USER_ID
    : (await logto.getAccessTokenClaims(token))?.sub;

  try {
    const [speakerContext] = await db
      .select({
        uid: chats.uid,
        id: chats.id,
        speaker_context: chats.speaker_context,
        speaker_results: chats.speaker_results,
        context: chats.context,
        branches: chats.branches
      })
      .from(chats)
      .where(and(
        eq(chats.uid, userId),
        eq(chats.id, body.chat_id)
      ));

    if (!speakerContext) {
      throw createError({
        statusCode: 404,
        message: "Chat not found"
      });
    }

    const context = speakerContext.speaker_context as ChatCompletionMessageParam[];

    if (body.stream) {
      setResponseHeader(event, 'Content-Type', 'text/event-stream');
      setResponseHeader(event, 'Cache-Control', 'no-cache');
      setResponseHeader(event, 'Connection', 'keep-alive');

      const textStream = await startSpeakerWorkflow(context, {
        ...body,
        stream: true
      });

      let fullContent = '';

      const stream = new ReadableStream({
        async start(controller) {
          const reader = textStream.getReader();

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              fullContent += value;
              controller.enqueue(new TextEncoder().encode(value));
            }
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
          } finally {
            const updateValues = {
              speaker_context: context,
              speaker_results: [
                ...(speakerContext.speaker_results as any[] || []),
                {
                  ...body,
                  result: fullContent
                }
              ],
              context: [
                ...(speakerContext.context as any[]),
                {
                  role: 'processor' as const,
                  content: 'Speaker',
                }
              ]
            } as any;

            await db
              .update(chats)
              .set(updateValues)
              .where(eq(chats.id, body.chat_id));

            controller.close();
          }
        }
      });

      return stream;
    }

    const result = await startSpeakerWorkflow(context, body);

    const updateValues = {
      speaker_context: context,
      speaker_results: [
        ...(speakerContext.speaker_results as any[] || []),
        {
          ...body,
          result
        }
      ],
      context: [
        ...(speakerContext.context as any[]),
        {
          role: 'processor' as const,
          content: 'Speaker',
        }
      ]
    } as any;

    await db
      .update(chats)
      .set(updateValues)
      .where(eq(chats.id, body.chat_id));

    return {
      content: result
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: `Internal Server Error: ${error.message}`
    });
  }
});
