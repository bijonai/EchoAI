// import { eq, and } from "drizzle-orm";
// import { table as chats } from "@/db/chats";
// import db from "@/db";
// import type { StepBranch, Message, DesignerRequestBody } from '@/types'
// import type { ChatCompletionMessageParam } from "openai/resources.mjs";
// import { startDesignerWorkflow } from "@/workflow/designer";

import { and, eq } from "drizzle-orm"
import db from "~/db"
import { withAuth } from "~/types/auth"
import { table as chats } from "~/db/chats"
import { generateObject, Message } from "xsai"
import { Message as ChatMessage, DesignerRequestBody } from "~/types"
import { DesignerResult } from "~/types"
import { createDesigner } from "~/workflow/designer"
import { Branch, Step } from "~/types/timeline"

// export default defineEventHandler(async (event) => {
//   const body = await readBody<DesignerRequestBody>(event);

//   const userId = event["userId"];

//   try {
//     const [designerContext] = await db
//       .select({
//         uid: chats.uid,
//         id: chats.id,
//         designer_context: chats.designer_context,
//         branches: chats.branches,
//         context: chats.context,
//       })
//       .from(chats)
//       .where(and(eq(chats.uid, userId), eq(chats.id, body.chat_id)));

//     if (!designerContext) {
//       throw createError({
//         statusCode: 404,
//         message: "Chat not found",
//       });
//     }

//     const context =
//       designerContext.designer_context as ChatCompletionMessageParam[];

//     const steps = await startDesignerWorkflow(context, {
//       prompt: body.prompt,
//       refs: body.refs,
//       step: body.step,
//       model: body.model,
//     });

//     const latestBranch = {
//       steps,
//       start: body.step,
//       end: body.next_step,
//     };
//     const updateValues = {
//       designer_context: context,
//       context: [
//         ...(designerContext.context as any[]),
//         ...(body.prompt
//           ? [
//               {
//                 role: "user" as const,
//                 content: body.prompt,
//               },
//             ]
//           : []),
//         {
//           role: "processor" as const,
//           content: "Designer",
//         },
//       ],
//       branches: [...(designerContext.branches as StepBranch[]), latestBranch],
//     };
//     runTask("save-context", {
//       payload: {
//         chat_id: body.chat_id,
//         values: updateValues,
//       },
//     });

//     return {
//       steps,
//       branches: updateValues.branches as StepBranch[],
//       displayed_messages: updateValues.context as Message[],
//     };
//   } catch (error) {
//     console.error(error);
//     throw createError({
//       statusCode: 500,
//       message: `Internal Server Error: ${error.message}`,
//     });
//   }
// });


export default defineEventHandler(async (event) => {
  const body = JSON.parse(await readBody(event)) as DesignerRequestBody
  const userId = (event as unknown as withAuth)["userId"]

  const [{ readChatContext, readContext, readResults, readBranches }] = await db.select({
    readChatContext: chats.designer_context,
    readContext: chats.context,
    readResults: chats.designer_results,
    id: chats.id,
    uid: chats.uid,
    readBranches: chats.branches,
  }).from(chats).where(and(eq(chats.uid, userId), eq(chats.id, body.chat_id)))

  const context = (readContext ?? []) as ChatMessage[]
  const chatContext = (readChatContext ?? []) as Message[]
  const results = (readResults ?? []) as DesignerResult[]
  const branches = (readBranches ?? []) as Branch[]

  const designer = createDesigner(chatContext)
  const object = await designer({
    prompt: body.prompt,
    refs: body.refs,
    step: body.step,
    chat_id: body.chat_id,
  })
  results.push({
    prompt: body.prompt,
    result: object,
    step: body.step,
  })
  context.push({
    role: 'processor',
    content: 'Timeline Generated',
    step: body.step,
  })
  branches.push({
    steps: object,
    start: body.step,
    end: body.next_step,
  })
  runTask('save-context', {
    payload: {
      chat_id: body.chat_id,
      values: {
        designer_context: chatContext,
        designer_results: results,
        context,
        branches,
      }
    }
  })

  return {
    branches,
    messages: context,
  }
})  
