import { startChalkWorkflow } from "@/workflow/chalk";
import { and, eq } from "drizzle-orm";
import db from "@/db";
import { table as chats } from "@/db/chats";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { ChalkResult, ChalkRequestBody } from '@/types'
import type { Operation, Position } from '@/types'

export default defineEventHandler(async (event) => {
  const body = JSON.parse(await readBody(event));

  const userId = event["userId"];
  const [chat] = await db
    .select({
      chat_id: chats.id,
      uid: chats.uid,
      chalk_context: chats.chalk_context,
      chalk_results: chats.chalk_results,
    })
    .from(chats)
    .where(eq(chats.id, body.chat_id));

  console.log(chat, body.chat_id)
  if (!chat) {
    throw createError({
      statusCode: 404,
      message: "Chat not found",
    });
  }

  const context = chat.chalk_context as ChatCompletionMessageParam[];
  const results = chat.chalk_results as ChalkResult[];

  if (body.stream) {
    setResponseHeader(event, "Content-Type", "text/event-stream");
    setResponseHeader(event, "Cache-Control", "no-cache");
    setResponseHeader(event, "Connection", "keep-alive");

    return await startChalkWorkflow(
      context,
      {
        prompt: body.prompt,
        components: body.components,
        document: body.document,
        pageId: body.page_id,
        model: body.model,
        stream: true,
      },
      (operations) => {
        results.push({
          input: body.prompt,
          components: body.components ?? [],
          output: operations as unknown as Operation[],
          step: body.step,
        });
        runTask("save-context", {
          payload: {
            chat_id: body.chat_id,
            values: {
              chalk_context: context,
              chalk_results: results,
            },
          },
        });
      }
    );
  }

  const chalkResult = await startChalkWorkflow(context, {
    prompt: body.prompt,
    components: body.components,
    document: body.document,
    pageId: body.page_id,
    model: body.model,
  });

  return chalkResult;
});
