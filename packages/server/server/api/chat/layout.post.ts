import { eq, and } from "drizzle-orm";
import { table as chats } from "../../../db/chats";
import db from "../../../db";
import { ChatCompletionMessageParam } from "openai/resources.mjs";
import { startLayoutWorkflow } from "@echoai/workflow/layout";
import { UNAUTHORIZED_MODE, UNAUTHORIZED_MODE_USER_ID } from "@echoai/utils";

export interface LayoutRequestBody {
  chat_id: string;
  prompt: string;
  step: string;
  problem: string;
  knowledge: string;
  explanation: string;
  conclusion: string;
}

export interface LayoutResponse {
  chat_id: string;
  prompt: string;
  content: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LayoutRequestBody>(event);

  const userId = event["userId"];

  try {
    const [layoutContext] = await db
      .select({
        uid: chats.uid,
        id: chats.id,
        layout_context: chats.layout_context,
        layout_results: chats.layout_results,
        context: chats.context,
        branches: chats.branches,
      })
      .from(chats)
      .where(and(eq(chats.uid, userId), eq(chats.id, body.chat_id)));

    if (!layoutContext) {
      throw createError({
        statusCode: 404,
        message: "Chat not found",
      });
    }

    const context =
      layoutContext.layout_context as ChatCompletionMessageParam[];

    const layoutResult = await startLayoutWorkflow(context, {
      ...body,
      interaction: "",
    });

    const updateValues = {
      layout_context: context,
      layout_results: [
        ...((layoutContext.layout_results as any[]) || []),
        {
          ...body,
          result: layoutResult,
        },
      ],
      context: [
        ...(layoutContext.context as any[]),
        {
          role: "processor" as const,
          content: "Layout",
        },
      ],
    };
    runTask("save-context", {
      payload: {
        chat_id: body.chat_id,
        values: updateValues,
      },
    });

    return {
      chat_id: body.chat_id,
      prompt: body.prompt,
      content: layoutResult,
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: `Internal Server Error: ${error.message}`,
    });
  }
});
