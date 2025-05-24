'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import PromptArea from "@/components/prompt-area";
import { createConnection } from "@echoai/api";
import { getAccessTokenAction } from "@/components/functions/user-control";

function getPeriod(): "morning" | "afternoon" | "evening" {
  const now = new Date();
  const hours = now.getHours();
  if (hours < 12) return "morning";
  if (hours < 18) return "afternoon";
  return "evening";
}

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState();
  let disabled = false;
  async function start() {
    if (!prompt || disabled) return;
    disabled = true;
    const { chat_id } = await createConnection({
      token: await getAccessTokenAction(),
    }).chat.create({
      prompt,
    });
    router.push(`/chat/${chat_id}?new=yes`);
  }

  return (
    <div className="flex flex-col w-full h-full pt-48">
      <div className="text-4xl flex flex-row gap-5 self-center font-blod">
        {`Good ${getPeriod()}, let's get started!`}
      </div>
      <div className="w-full h-72 px-56 py-10">
        <div className="w-full h-full mx-auto max-w-[900px]">
          <PromptArea setPrompt={setPrompt} onSend={start} />
        </div>
      </div>
    </div>
  );
}
