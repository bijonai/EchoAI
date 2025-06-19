<script setup lang="ts">
import type { ChatCreateResponse } from '~/server/api/chat/create.post';

const prompt = ref('')

const accessToken = useState<string | undefined>('access-token');
const isAuthenticated = useState<boolean | undefined>('is-authenticated');
const userInfo = useLogtoUser();

async function start() {
  const data = await $fetch<ChatCreateResponse>('/api/chat/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken.value}`
    },
    body: {
      prompt: prompt.value,
    },
  })
  navigateTo(`/chat/${data.chat_id}?new=true`)
}
</script>

<template>
  <div class="flex flex-col justify-end items-center w-full h-full">
    <div class="text-4xl flex flex-row gap-5 self-center font-blod"
      style="background: linear-gradient(90deg, #E88AFF 0%, #FFE373 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
      {{ `Hello, ${isAuthenticated ? userInfo.username : 'Please Login'}!` }}
    </div>
    <div class="w-full h-72 max-w-4xl py-10 px-4">
      <PromptArea v-model="prompt" @send="start" :displayNext="false" />
    </div>
  </div>
</template>
