import { eq } from "drizzle-orm";
import { table as chats } from "../../../db/chats";
import db from "../../../db";
import { SYSTEM, USER } from "@echoai/workflow/designer";
import { prompt } from "@echoai/utils";

export interface ChatCreateRequestBody {
  prompt?: string;
}

export interface ChatCreateResponse {
  chat_id: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatCreateRequestBody>(event);

  const userId = event["userId"];

  try {
    const [chat] = await db
      .insert(chats)
      .values({
        uid: userId,
        designer_context: [
          {
            role: "system",
            content: SYSTEM,
          },
          body.prompt
            ? {
              role: "user",
              content: prompt(USER, {
                prompt: body.prompt,
              }),
            }
            : undefined,
        ],
        context: [
          {
            role: "user",
            content: body.prompt,
          },
        ],
      } as any)
      .returning({ id: chats.id });

    return {
      chat_id: chat.id,
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: `Internal Server Error: ${error.message}`,
    });
  }
});
