// import { eq, and } from "drizzle-orm";
// import { table as chats } from "@/db/chats";
// import db from "@/db";
// import type { ChatCompletionMessageParam } from "openai/resources.mjs";
// import { startSpeakerWorkflow } from "@/workflow/speaker";
// import type { SpeakerRequestBody } from "@/types";

import { and, eq } from "drizzle-orm";
import db from "~/db";
import { withAuth } from "~/types/auth";
import { table as chats } from "~/db/chats";
import { createSpeaker } from "~/workflow/speaker";
import { message, Message } from "xsai";
import { SpeakerResult, SpeakerResponse, Message as ChatMessage } from "~/types";
import createUpdate from "~/utils/update";

// export default defineEventHandler(async (event) => {
//   const body = await JSON.parse(await readBody(event));
//   console.log('Request body:', JSON.stringify(body, null, 2));
//   console.log('Body type:', typeof body);
//   console.log('Chat ID:', body?.chat_id);

//   const userId = event["userId"];

//   try {
//     const [speakerContext] = await db
//       .select({
//         uid: chats.uid,
//         id: chats.id,
//         speaker_context: chats.speaker_context,
//         speaker_results: chats.speaker_results,
//         context: chats.context,
//         branches: chats.branches,
//       })
//       .from(chats)
//       .where(and(/* eq(chats.uid, userId), */ eq(chats.id, body.chat_id)));
//     console.log(userId, body.chat_id)

//     if (!speakerContext) {
//       throw createError({
//         statusCode: 404,
//         message: "Chat not found",
//       });
//     }

//     const context =
//       speakerContext.speaker_context as ChatCompletionMessageParam[];

//     if (body.stream) {
//       setResponseHeader(event, "Content-Type", "text/event-stream");
//       setResponseHeader(event, "Cache-Control", "no-cache");
//       setResponseHeader(event, "Connection", "keep-alive");

//       const textStream = await startSpeakerWorkflow(context, {
//         ...body,
//         stream: true,
//       });

//       let fullContent = "";

//       const stream = new ReadableStream({
//         async start(controller) {
//           const reader = textStream.getReader();

//           try {
//             while (true) {
//               const { done, value } = await reader.read();
//               if (done) break;

//               fullContent += value;
//               controller.enqueue(new TextEncoder().encode(value));
//             }
//           } catch (error) {
//             console.error("Streaming error:", error);
//             controller.error(error);
//           } finally {
//             const updateValues = {
//               speaker_context: context,
//               speaker_results: [
//                 ...((speakerContext.speaker_results as any[]) || []),
//                 {
//                   ...body,
//                   result: fullContent,
//                 },
//               ],
//               context: [
//                 ...(speakerContext.context as any[]),
//                 {
//                   role: "assistant" as const,
//                   content: fullContent,
//                   step: body.step,
//                 },
//               ],
//             };
//             runTask("save-context", {
//               payload: {
//                 chat_id: body.chat_id,
//                 values: updateValues,
//               },
//             });
//             controller.close();
//           }
//         },
//       });

//       return stream;
//     }

//     const result = await startSpeakerWorkflow(context, body);

//     const updateValues = {
//       speaker_context: context,
//       speaker_results: [
//         ...((speakerContext.speaker_results as any[]) || []),
//         {
//           ...body,
//           result,
//         },
//       ],
//       context: [
//         ...(speakerContext.context as any[]),
//         {
//           role: "assistant" as const,
//           content: result,
//           step: body.step,
//         },
//       ],
//     };
//     runTask("save-context", {
//       payload: {
//         chat_id: body.chat_id,
//         values: updateValues,
//       },
//     });

//     return {
//       content: result,
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
