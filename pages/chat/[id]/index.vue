<script setup lang="ts">
import type { Timeline } from '#components'

const route = useRoute()
const router = useRouter()

const nextType = <NextType>ref('next')
const token = useState('access-token')
const prompts = ref('')

const nowStep = useState<string | null>('now-step')

const info = {
  token: <string>token.value,
  chat_id: route.params.id as string,
}
const { messages, next: speaker } = useSpeaker(nextType, info)
const { branches, step, next: designer } = useDesigner(nextType, info, messages)
const { pageId, viewingId, initialize, next: nextBoard, apply: applyBoard } = useBoard(info)
initialize()

const { apply, get } = useHistory(info)

const timelines = ref<InstanceType<typeof Timeline> | null>(null)

watch(prompts, (newPrompts) => {
  if (nextType.value === 'prohibited') { return }
  if (newPrompts.trim() === '') {
    nextType.value = 'next'
  } else {
    nextType.value = 'doubt'
  }
}, { immediate: true })

async function handleNext(move: boolean = true) {
  const activeStep = move ? findStepNext(step.value!, branches.value) : findStep(step.value!, branches.value)

  if (nextType.value === 'doubt') {
    designer(findStep(step.value!, branches.value), {
      prompt: prompts.value,
    }).then(() => {
      nextType.value = 'next'
      handleNext(false)
    })
  } else {
    if (!activeStep || activeStep === END) return

    nowStep.value = activeStep.step.toString()
    await timelines.value?.moveToActiveCard()

    const promises = [
      speaker(activeStep),
      nextBoard(activeStep, prompts.value),
    ]
    await Promise.all(promises)

    step.value = activeStep.step.toString()
    prompts.value = ''

    nextType.value = 'next'
  }
}

apply(messages, branches, step as Ref<string>).then(() => {
  nowStep.value = step.value
})

get().then((result) => {
  applyBoard(result.chalk)
})

const newParam = route.query.new
const resourceId = route.query.resource_id

if (newParam) {
  nextType.value = 'doubt'
  apply(messages, branches, step as Ref<string>).then(() => {
    designer(null, {
      prompt: newParam as string,
      resource_id: resourceId as string,
    }).then(() => {
      handleNext(false)
    })
  })
  router.replace({ query: { ...route.query, new: undefined } })
}
</script>

<template>
  <div class="grid grid-cols-10 gap-2 w-full h-full p-2">
    <div class="col-span-7 flex flex-col gap-2 w-full h-full">
      <div class="flex-grow rounded-md bg-[#24292F]">
        <Board />
      </div>
      <div class="h-56 rounded-md bg-[#FEFFE4]">
        <Timeline ref="timelines" :branches="branches" />
      </div>
    </div>
    <div class="col-span-3 flex flex-col gap-2 w-full h-full">
      <div class="flex flex-col w-full h-full max-h-[calc(100vh-15.5rem)] overflow-y-auto scroll-smooth scrollbar-hide">
        <div v-for="(message, index) in messages" :key="index">
          <MessageBox :role="message.role" :content="message.content" :is-loading="message.isLoading ?? false" />
        </div>
      </div>
      <div class="h-56 w-full">
        <PromptArea @action="handleNext" :model="nextType" v-model="prompts" />
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