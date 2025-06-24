// import { startChalkWorkflow } from "@/workflow/chalk";
// import { and, eq } from "drizzle-orm";
// import db from "@/db";
// import { table as chats } from "@/db/chats";
// import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
// import type { ChalkResult, ChalkRequestBody } from '@/types'
// import type { Operation, Position } from '@/types'

import { eq, and } from "drizzle-orm"
import { ChalkRequestBody, ChalkResult, Operation } from "~/types"
import { withAuth } from "~/types/auth"
import db from "~/db"
import { table as chats } from "~/db/chats"
import { createChalk } from "~/workflow/chalk"
import { message, Message } from "xsai"
import createUpdate from "~/utils/update"

// export default defineEventHandler(async (event) => {
//   const body = JSON.parse(await readBody(event));

//   const userId = event["userId"];

//   const [chat] = await db
//     .select({
//       chat_id: chats.id,
//       uid: chats.uid,
//       chalk_context: chats.chalk_context,
//       chalk_results: chats.chalk_results,
//     })
//     .from(chats)
//     .where(eq(chats.id, body.chat_id));

//   console.log(chat, body.chat_id)
//   if (!chat) {
//     throw createError({
//       statusCode: 404,
//       message: "Chat not found",
//     });
//   }

//   const context = chat.chalk_context as ChatCompletionMessageParam[];
//   const results = chat.chalk_results as ChalkResult[];

//   if (body.stream) {
//     setResponseHeader(event, "Content-Type", "text/event-stream");
//     setResponseHeader(event, "Cache-Control", "no-cache");
//     setResponseHeader(event, "Connection", "keep-alive");

//     return await startChalkWorkflow(
//       context,
//       {
//         prompt: body.prompt,
//         components: body.components,
//         document: body.document,
//         pageId: body.page_id,
//         model: body.model,
//         stream: true,
//       },
//       (operations) => {
//         results.push({
//           input: body.prompt,
//           components: body.components ?? [],
//           output: operations as unknown as Operation[],
//           step: body.step,
//         });
//         runTask("save-context", {
//           payload: {
//             chat_id: body.chat_id,
//             values: {
//               chalk_context: context,
//               chalk_results: results,
//             },
//           },
//         });
//       }
//     );
//   }

//   const chalkResult = await startChalkWorkflow(context, {
//     prompt: body.prompt,
//     components: body.components,
//     document: body.document,
//     pageId: body.page_id,
//     model: body.model,
//   });

//   return chalkResult;
// });

export default defineEventHandler(async (event) => {
  const body = JSON.parse(await readBody(event)) as ChalkRequestBody
  const userId = (event as unknown as withAuth)['userId']
  const [{ readContext, readResults }] = await db.select({
    readContext: chats.chalk_context,
    readResults: chats.chalk_results,
    id: chats.id,
    uid: chats.uid,
  }).from(chats).where(and(
    eq(chats.uid, userId),
    eq(chats.id, body.chat_id)
  ))

  // Ensure arrays with proper type casting
  const context = Array.isArray(readContext) ? [...readContext] as Message[] : [] as Message[]
  const results = Array.isArray(readResults) ? [...readResults] as ChalkResult[] : [] as ChalkResult[]
  
  const chalk = createChalk(context)
  return chalk(body, (operations, content) => {
    // Create new arrays for updates
    const updatedContext = [...context, message.assistant(content)]
    const updatedResults = [...results, {
      layout: body.layout,
      components: body.components ?? [],
      output: operations,
      step: body.step,
    }]
    console.log('[PRE-UPDATE]')

    // Use await instead of event.waitUntil for database update
    const update = createUpdate(body.chat_id)
    update({
      chalk_context: updatedContext,
      chalk_results: updatedResults,
    })
  })
})
