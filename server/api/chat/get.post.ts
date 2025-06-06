import { eq, and } from "drizzle-orm";
import { table as chats } from "@/db/chats";
import db from "@/db";
import type { StepBranch, DesignerResult, SpeakerResult, LayoutResult, ChalkResult, Context, DisplayedMessage, GetChatRequestBody } from '@/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<GetChatRequestBody>(event);

  const userId = event["userId"];

  try {
    const [chat] = await db
      .select({
        id: chats.id,
        designer_context: chats.designer_context,
        designer_results: chats.designer_results,
        speaker_context: chats.speaker_context,
        speaker_results: chats.speaker_results,
        layout_context: chats.layout_context,
        layout_results: chats.layout_results,
        chalk_context: chats.chalk_context,
        chalk_results: chats.chalk_results,
        branches: chats.branches,
        context: chats.context,
      })
      .from(chats)
      .where(and(eq(chats.uid, userId), eq(chats.id, body.chat_id)));

    if (!chat) {
      throw createError({
        statusCode: 404,
        message: "Chat not found",
      });
    }

    return {
      chat_id: chat.id,
      designer_context: chat.designer_context as Context,
      designer_results: chat.designer_results as DesignerResult[],
      speaker_context: chat.speaker_context as Context,
      speaker_results: chat.speaker_results as SpeakerResult[],
      layout_context: chat.layout_context as Context,
      layout_results: chat.layout_results as LayoutResult[],
      chalk_context: chat.chalk_context as Context,
      chalk_results: chat.chalk_results as ChalkResult[],
      branches: chat.branches as StepBranch[],
      context: chat.context as DisplayedMessage[],
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: `Internal Server Error: ${error.message}`,
    });
  }
});
