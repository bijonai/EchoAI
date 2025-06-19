<script setup lang="ts">
import type { Context, GetChatResponse, StepBranch } from '@/types'
import { Whiteboard } from '@/utils/whiteboard'
import { useComposer, NEW_CHAT, findStepNext, END } from './composer'

const nextAvailablity = ref(false)
const messages = ref<Context>([])
const branches = ref<StepBranch[]>([])
const whiteboard = new Whiteboard()
const currentPage = ref<number>(1)
const currentStep = ref<string | null>(null)
const prompt = ref<string>('')

const accessToken = useState<string | undefined>('access-token');

whiteboard.addPage('Primary Page')

const route = useRoute()
const router = useRouter()

const data = await $fetch<GetChatResponse>('/api/chat/get', {
  headers: {
    'Authorization': `Bearer ${accessToken.value}`
  },
  method: 'POST',
  body: {
    chat_id: route.params.id,
  }
})
branches.value.push(...data.branches)
messages.value.push(...data.context)
currentStep.value = data.context[data.context.length - 1].step ?? null

watch([currentStep, branches, messages], () => {
  const nextStep = currentStep.value ? findStepNext(currentStep.value, branches.value) : null
  console.log(nextStep)
  nextAvailablity.value = nextStep !== END && nextStep !== null
})

const composer = useComposer({
  pageId: currentPage as Ref<number>,
  chatId: route.params.id as string,
  messages,
  branches,
  nextAvailablity,
  token: accessToken,
})
provide('composer', composer)

const handleNext = () => {
  composer(whiteboard, currentStep.value!).then((step) => {
    if (step) currentStep.value = step.step.toString()
  })
}
const handleSend = () => {
  composer(whiteboard, currentStep.value!, prompt.value).then((step) => {
    if (step) currentStep.value = step.step.toString()
  })
}
const handleSwitch = (direction: 'previous' | 'next') => {
  if (direction === 'previous') {
    if (currentPage.value! <= 1) return
    currentPage.value = currentPage.value! - 1
  } else {
    if (currentPage.value! >= whiteboard.getPageCount()) return
    currentPage.value = currentPage.value! + 1
  }
}

const newParam = route.query.new

if (newParam) {
  composer(whiteboard, currentStep.value!, NEW_CHAT).then((step) => {
    if (step) currentStep.value = step.step.toString()
  })
  router.replace({ query: { ...route.query, new: undefined } });
}
</script>

<template>
  <div class="grid grid-cols-10 gap-2 w-full h-full p-2">
    <div class="col-span-7 flex flex-col gap-2 w-full h-full">
      <div class="flex-grow rounded-md bg-[#FEFFE4]">
        <Board :pageId="currentPage.toString()" :whiteboard="whiteboard" @switch="handleSwitch" />
      </div>
      <div class="h-48 rounded-md bg-[#FEFFE4]">
        <Timeline :branches="branches" />
      </div>
    </div>
    <div class="col-span-3 flex flex-col gap-2 w-full h-full">
      <div class="flex flex-col w-full h-full max-h-[calc(100vh-13.5rem)] overflow-y-auto scroll-smooth scrollbar-hide"
        ref={messagesContainerRef}>
        <div v-for="(message, index) in messages" :key="index">
          <MessageBox :role="message.role" :content="message.content" :is-loading="message.isLoading ?? false" />
        </div>
      </div>
      <div class="h-48 w-full">
        <PromptArea @next="handleNext" @send="handleSend" :next="nextAvailablity" v-model="prompt" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}

.scrollbar-hide::-webkit-scrollbar-thumb {
  background: rgba(140, 140, 120, 0.3);
  border-radius: 4px;
}

.scrollbar-hide::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-hide {
  scrollbar-width: thin;
  scrollbar-color: rgba(140, 140, 120, 0.3) transparent;
}
</style>