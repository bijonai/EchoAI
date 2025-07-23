<script setup lang="ts">
import { useChat } from '~/composables/useChat'
import { useRoute } from 'vue-router'
import useAgent from '~/composables/useAgent';

const route = useRoute()
const accessToken = useState<string | undefined>('access-token');

const chatInfo = {
  chat_id: route.params.id as string,
  token: accessToken.value ?? ''
}

const prompts = ref('')

const agentEnvironment = await useChat(chatInfo)

const boardHandler = useBoard(agentEnvironment)
const { agent } = useAgent(chatInfo, agentEnvironment, boardHandler)

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
    <div class="col-span-3 flex flex-col gap-2 w-full h-full relative">
      <div ref="messageList"
        class="flex flex-col w-full h-full max-h-[calc(100vh-15.5rem)] overflow-y-auto scroll-smooth scrollbar-hide">
        <span
          class="w-10 h-10 flex items-center justify-center rounded-md bg-[#FEFFE4] hover:shadow-xl transition-all duration-100 absolute top-[calc(100vh-18rem)] right-2 z-10"
          @click="scrollToBottom(true)">
          <Icon name="humbleicons:align-objects-bottom" class="!w-5 !h-5 opacity-60" />
        </span>
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