<script setup lang="ts">
import type { Context, StepBranch, Operation } from '@/types'
// import { Whiteboard } from '@/utils/whiteboard'

const nextAvailablity = ref(false)
const messages = ref<Context>([])
const branches = ref<StepBranch[]>([])
const operations = ref<Operation[]>([])
// const whiteboard = ref<Whiteboard>(new Whiteboard())
const currentPage = ref<number | null>(null)  


const handleNext = () => {
  console.log('handleNext')
}
const handleSend = () => {
  console.log('handleSend')
}
const handleSwitch = (direction: 'previous' | 'next') => {
  console.log('handleSwitch', direction)
}
</script>

<template>
  <div class="flex w-full gap-2 h-full">
    <div class="flex flex-col h-full w-2/3 gap-y-2">
      <div class="flex flex-3/4 max-h-3/4 min-h-3/4 h-3/4 bg-gray-100 rounded-lg">
        <!-- <Board :operations="operations" :whiteboard="whiteboard" :page-id="currentPage!.toString()" @switch="handleSwitch" /> -->
      </div>
      <div class="flex flex-1/4 h-full bg-gray-100 rounded-lg">
        <div class="relative w-full">
          <Timeline :branches="branches" />
        </div>
      </div>
    </div>
    <div class="flex flex-col w-1/3 gap-y-2 bg-gray-100 rounded-lg p-4">
      <div class="flex flex-1 overflow-y-auto scroll-smooth" ref={messagesContainerRef}>
        <div class="size-full">
          <div v-for="(message, index) in messages" :key="index">
            <ToolBox v-if="message.role === 'processor'" :content="message.content"
              :is-loading="message.isLoading ?? false" />
            <MessageBox v-else :avatar="'https://picsum.photos/200/300'" :role="message.role"
              :content="message.content" />
          </div>
        </div>
      </div>
      <div class="h-[200px] w-full">
        <PromptArea @next="handleNext" @send="handleSend" :next="nextAvailablity" />
      </div>
    </div>
  </div>
</template>~/utils/whiteboard