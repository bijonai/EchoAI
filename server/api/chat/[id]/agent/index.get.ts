import { generateId, Message } from "ai"
import db, { chats } from "~/db"
import { useChat } from "~/db/composables/useChat"
import { action, TaskCreatedAction } from "~/types/agent"
import { Current } from "~/types/current"
import { Design } from "~/types/design"
import { ChatMessage } from "~/types/message";
import { PageStore } from "~/types/page";
import { getUserId } from "~/utils/tool";
import { createAgent } from "~/workflow/agent";

export default defineEventHandler(async (event) => {
  const stream = createEventStream(event);

  const userId = getUserId(event);
  const params = await getQuery(event);
  const chatId = getRouterParam(event, "id")!;
  const {
    pull,
    apply,
    addPage,
    updateCurrentStep,
    updateDesign,
    updateContext,
    addMessage,
    addMessageChunk,
    updatePageLayoutContext,
  } = useChat(db, { chatId, userId });

  let pages: PageStore, context: Message[], design: Design, current: Current;

  try {
    ({ pages, context, design, current } = await pull({
      id: chats.id,
      uid: chats.uid,
      pages: chats.pages,
      context: chats.context,
      messages: chats.messages,
      design: chats.design,
      current: chats.current,
    }));
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Chat not found",
    });
  }

  addMessage({
    type: "agent",
    content: params.input as string,
    id: generateId(),
  });

  const agent = createAgent(context);

  (async () => {
    for await (const act of agent(
      {
        input: params.input as string,
        pages,
        design,
        current,
      },
      {
        updatePageLayoutContext: updatePageLayoutContext,
        apply: apply,
      }
    )) {
      if (act.type === "agent-message-chunk") {
        if (!act.success) return;
        addMessageChunk("agent", act.data.chunk);
      } else if (act.type === "layout-done") {
        if (!act.success) return;
        const { data } = await $fetch(`/api/chat/${chatId}/task/create`, {
          method: "POST",
          body: {
            task: {
              type: "chalk",
              data: {
                input: act.data.layout,
                page: act.data.page,
              },
            },
          },
        });
        addMessage({
          type: "layout",
          complete: true,
          id: generateId(),
        });
        await stream.push(
          JSON.stringify(
            action<TaskCreatedAction>("task-created", {
              id: data.id,
            })
          )
        );
      } else if (act.type === "create-page") {
        if (!act.success) return;
        addPage(act.data.title);
        addMessage({
          type: "page",
          page: Number(act.data.id),
          id: generateId(),
        });
      } else if (act.type === "design-branch") {
        if (!act.success) return;
        updateDesign(act.data.design);
        addMessage({
          type: "design",
          id: generateId(),
        });
      } else if (act.type === "step-to") {
        if (!act.success) return;
        updateCurrentStep(act.data.step);
        addMessage({
          type: "step",
          step: act.data.step,
          id: generateId(),
        });
      } else if (act.type === "agent-context-update") {
        if (!act.success) return;
        updateContext(act.data.context);
        await apply();
        continue;
      }
      await apply();
      await stream.push(JSON.stringify(act));
    }
    await stream.close();
  })();

  return stream.send();
});