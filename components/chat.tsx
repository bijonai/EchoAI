'use client'

import { DesignerResponse, DesignerStep, StepBranch } from '@/workflow/designer'
import { useState, useEffect } from 'react'
import MessageBox from './message-box'
import ToolBox from './tool-box'
import PromptArea from './prompt-area'
import fetchDesigner from '@/service/deigner'
import { Timeline } from './timeline'

interface TipMessageBoxType {
  role: 'tip'
  content: string
  isLoading?: boolean
}

interface ChatMessageBoxType {
  avatar?: string
  role: 'user' | 'assistant'
  content: string
}

type MessageBoxType = TipMessageBoxType | ChatMessageBoxType

export function Chat({
  chatId,
  initialMessages,
  status,
}: {
  chatId: string
  initialMessages?: MessageBoxType[]
  status: 'submitted' | 'streaming' | 'ready' | 'error'
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<MessageBoxType[]>([])
  console.log(messages)
  const [branches, setBranches] = useState<StepBranch[]>([])
  const [currentStepId, setCurrentStepId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string>('')

  useEffect(() => {
    const fetchMessages = async () => {
      if (status === 'submitted') {
        setIsLoading(true)
        setMessages((msg) => [
          ...msg,
          ...[
            {
              avatar: 'https://picsum.photos/200/300',
              role: 'user' as const,
              content: prompt,
            },
            {
              role: 'tip' as const,
              content: 'Designing...',
              isLoading,
            }
          ],
        ])
        const designerResponse = await fetchDesigner({
          chat_id: chatId,
          prompt,
        })
        setBranches(designerResponse.branches)
        
        // TODO: speaker model

        setIsLoading(false)
      }
    }
    fetchMessages()
  }, [chatId])

  function handleNext() {
    // TODO: handle next
  }

  function handleStepClick(step: DesignerStep) {
    console.log('clicked', step)
  }

  return (
    <div className="flex w-full gap-2 h-full">
      <div className="flex flex-col h-full w-2/3 gap-y-2">
        <div className="flex flex-3/4 h-full bg-gray-100 rounded-lg">
          w
        </div>
        <div className="flex flex-1/4 h-full bg-gray-100 rounded-lg">
          <Timeline />
        </div>
      </div>
      <div className="flex flex-col w-1/3 gap-y-2 bg-gray-100 rounded-lg p-4">
        <div className="flex flex-1 overflow-y-auto">
          <div className="size-full">
            {messages.map((message, index) => (
              (message.role === 'tip') ? (
                <ToolBox
                  content={message.content}
                  isLoading={message.isLoading ?? false}
                  key={index}
                />
              ) : (
                <MessageBox
                  avatar={message.avatar ?? 'https://picsum.photos/200/300'}
                  role={message.role}
                  content={message.content}
                  key={index}
                />
              )
            ))}
          </div>
        </div>
        <div className="h-[340px] w-full ">
          <PromptArea onNext={handleNext} setPrompt={setPrompt} />
        </div>
      </div>
    </div>
  )
}
