import { Chat } from "@/components/chat/chat";
import { getAccessTokenAction } from "@/components/functions/user-control";
import { createConnection } from "@echoai/api";

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: { chat_id: string };
  searchParams: { new: string };
}) {
  const { chat_id } = params;
  const { new: newParam } = searchParams;

  const chat = {
    messages: [],
    status: newParam === "yes" ? ("submitted" as const) : ("ready" as const),
  };
  const chatInfo = await createConnection({
    token: await getAccessTokenAction(),
  }).chat.get({
    chat_id,
  });

  return (
    <div className="w-full h-full">
      <Chat chatId={chat_id} status={chat.status} info={chatInfo} />
    </div>
  );
}
