import db from "~/db";
import { LayoutRequestBody, LayoutResult } from "~/types";
import { withAuth } from "~/types/auth";
import { createLayout } from "~/workflow/layout";
import { chats } from "~/db";
import { and, eq } from "drizzle-orm";
import { Message } from "xsai";
import createUpdate from "~/utils/update";

export default defineEventHandler(async (event) => {
  const body = JSON.parse(await readBody(event)) as LayoutRequestBody;
  const userId = (event as unknown as withAuth)["userId"];
  const [{ context: readContext, results: readResults }] = await db.select({
    id: chats.id,
    uid: chats.uid,
    context: chats.layout_context,
    results: chats.layout_results,
  })
    .from(chats)
    .where(and(
      eq(chats.uid, userId),
      eq(chats.id, body.chat_id),
    ));
  const context = (readContext ?? []) as Message[]
  const results = (readResults ?? []) as LayoutResult[]
  const layout = createLayout(context)
  const { content, operations } = await layout(body) ?? { content: '', operations: [] }
  const result: LayoutResult = {
    step: body.step,
    content,
    operation: operations[0],
  }
  results.push(result)
  const update = createUpdate(body.chat_id)
  event.waitUntil(update({
    layout_context: context,
    layout_results: results,
  }))
  return result
});
