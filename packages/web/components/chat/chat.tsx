'use client'

import { DesignerStep, StepBranch } from '@echoai/shared'
import { useState, useEffect, useRef, RefObject } from 'react'
import MessageBox from '../message-box'
import ToolBox from '../tool-box'
import PromptArea from '../prompt-area'
import { Timeline } from '../timeline'
import { GetChatResponse } from "@echoai/shared";
import { createConnection } from "@echoai/api";
import { Operation } from "@echoai/shared";
import { Board } from "./board";
import { useClearParamOnLoad } from "@/hooks/use-clear-params-onload";
import { MessageBoxType, END } from "./types";
import { convert, findStep, findStepNext } from "./timeline";
import { Whiteboard } from "./whiteboard";
import { getAccessTokenAction } from "../functions/user-control";
export function Chat({
  chatId,
  info,
  status,
}: {
  chatId: string;
  info: GetChatResponse;
  status: "submitted" | "streaming" | "ready" | "error";
}) {
  const [fetchStatus, setFetchStatus] = useState(status);
  const [isLoading, setIsLoading] = useState(false);
  const messages = useRef<MessageBoxType[]>(convert(info.context));
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [branches, setBranches] = useState<StepBranch[]>(info.branches);
  const currentStep = useRef<string | null | typeof END>(
    info.context[info.context.length - 1]?.step ?? null
  );
  const currentPage = useRef<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const calledRef = useRef(false);
  const [nextAvailablity, setNextAvailablity] = useState(status === "ready");
  const [boardContent, setBoardContent] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const operations = useRef<Operation[]>([]);
  const whiteboard = new Whiteboard();

  // Initialize whiteboard
  currentPage.current = whiteboard.addPage("Default").id;

  useClearParamOnLoad("new");
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  });

  const requestDesigner = async (inputPrompt: string) => {
    try {
      calledRef.current = true;
      setFetchStatus("streaming");
      setIsLoading(true);

      messages.current.push(
        ...(prompt
          ? [
              {
                avatar: "https://picsum.photos/200/300",
                role: "user" as const,
                content: inputPrompt,
              },
            ]
          : []),
        {
          role: "tip",
          content: "Designing...",
          isLoading: true,
        }
      );
      setUpdateTrigger((v) => v + 1);

      const nextStep = findStepNext(currentStep.current as string, branches);
      const designerResponse = await createConnection({
        token: await getAccessTokenAction(),
      }).chat.designer({
        chat_id: chatId,
        prompt,
        step: currentStep.current as string,
        next_step: nextStep ? (nextStep as DesignerStep).step : void 0,
      });

      setBranches(designerResponse.branches);
      currentStep.current =
        designerResponse.branches[
          designerResponse.branches.length - 1
        ].steps[0].step;
      messages.current.length = 0;
      messages.current.push(...convert(designerResponse.displayed_messages));
      setUpdateTrigger((v) => v + 1);

      await request(designerResponse.branches);
      setNextAvailablity(true);
    } catch (error) {
      console.error("Error in fetchMessages:", error);
      setFetchStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const requestSpeaker = async (currentBranches: StepBranch[]) => {
    const step = findStep(currentStep.current as string, currentBranches)!;

    // Create a new message object once and reuse it
    const messageIndex = messages.current.length;
    messages.current.push({
      role: "assistant",
      content: "",
      key: Date.now(), // Add a stable key to help React with reconciliation
    });
    setUpdateTrigger((v) => v + 1);

    let buffer = "";

    await createConnection({
      token: await getAccessTokenAction(),
    }).chat.speaker(
      {
        chat_id: chatId,
        stream: true,
        ...step,
      },
      (chunk) => {
        buffer = chunk.content;

        // Update the existing message object instead of creating a new one
        messages.current[messageIndex] = {
          role: "assistant",
          content: buffer,
          key: messages.current[messageIndex].key,
        };
        setUpdateTrigger((v) => v + 1);
      }
    );
  };

  const requestChalk = async (prompt: string) => {
    await createConnection({
      token: await getAccessTokenAction(),
    }).chat.chalk(
      {
        chat_id: chatId,
        prompt,
        stream: true,
        document: whiteboard.processToSummarizedDocumentString(
          currentPage.current!
        ),
        page_id: currentPage.current!,
        step: currentStep.current as string,
      },
      (chunk) => {
        console.log(chunk)
        operations.current.length = 0;
        operations.current.push(...chunk.operations);

        setUpdateTrigger((v) => v + 1);
      }
    );
  };

  const requestLayout = async (currentBranches: StepBranch[]) => {
    const step = findStep(currentStep.current as string, currentBranches)!;
    const layoutResponse = await createConnection({
      token: await getAccessTokenAction(),
    }).chat.layout({
      chat_id: chatId,
      prompt,
      ...step,
      page_id_will_be_used: (parseInt(currentPage.current!) + 1).toString(),
    });
    if (layoutResponse.operation) {
      if (layoutResponse.operation.type === "new-page") {
        currentPage.current = whiteboard.addPage(layoutResponse.operation.title).id;
      } else if (layoutResponse.operation.type === "switch-page") {
        currentPage.current = layoutResponse.operation.pageId;
      }
    }
    await requestChalk(layoutResponse.content);
    setUpdateTrigger((v) => v + 1);
  };

  const request = async (currentBranches: StepBranch[]) => {
    await Promise.all([
      requestSpeaker(currentBranches),
      requestLayout(currentBranches),
    ]);
  };

  useEffect(() => {
    if (calledRef.current) return;
    if (fetchStatus === "submitted") {
      requestDesigner(prompt);
    }
  }, [chatId]);

  async function handleNext() {
    setNextAvailablity(false);
    const nextStep = findStepNext(currentStep.current as string, branches);

    if (nextStep === END) {
      // handle end
    } else {
      currentStep.current = nextStep?.step!;
      await request(branches);
      setUpdateTrigger((v) => v + 1);
    }
    setNextAvailablity(true);
  }

  function handleSend() {
    requestDesigner(prompt);
    setPrompt("");
  }

  function handleSwitch(operation: "next" | "previous") {
    console.log(currentPage.current, operation)
    const total = whiteboard.getPageCount();
    const current = parseInt(currentPage.current!)
    if (operation === "next") {
      if (current + 1 > total) return;
      console.log(current + 1)
      currentPage.current = (current + 1).toString();
    } else {
      if (current - 1 < 1) return;
      console.log(current - 1)
      currentPage.current = (current - 1).toString();
    }
  }

  return (
    <div className="flex w-full gap-2 h-full">
      <div className="flex flex-col h-full w-2/3 gap-y-2">
        <div className="flex flex-3/4 max-h-3/4 min-h-3/4 h-3/4 bg-gray-100 rounded-lg">
          <Board
            operations={operations}
            whiteboard={whiteboard}
            pageId={currentPage as RefObject<string>}
            onSwitch={handleSwitch}
          />
        </div>
        <div className="flex flex-1/4 h-full bg-gray-100 rounded-lg">
          <div className="relative w-full">
            <Timeline branches={branches} />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/3 gap-y-2 bg-gray-100 rounded-lg p-4">
        <div
          className="flex flex-1 overflow-y-auto scroll-smooth"
          ref={messagesContainerRef}
        >
          <div className="size-full">
            {messages.current.map((message, index) =>
              message.role === "tip" ? (
                <ToolBox
                  key={index}
                  content={message.content}
                  isLoading={message.isLoading ?? false}
                />
              ) : (
                <MessageBox
                  key={index}
                  avatar={message.avatar ?? "https://picsum.photos/200/300"}
                  role={message.role}
                  content={message.content}
                />
              )
            )}
          </div>
        </div>
        <div className="h-[200px] w-full">
          <PromptArea
            onNext={handleNext}
            onSend={handleSend}
            setPrompt={setPrompt}
            next={nextAvailablity}
          />
        </div>
      </div>
    </div>
  );
}
