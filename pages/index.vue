<script setup lang="ts">
import { chat } from '~/endpoint';

const accessToken = useState<string | undefined>('access-token');
const isAuthenticated = useState<boolean | undefined>('is-authenticated');
const userInfo = useLogtoUser()

const prompts = ref('')

async function start() {
  const data = await chat.create({
    prompt: prompts.value,
  }, accessToken.value)
  navigateTo(`/chat/${data.chat_id}?new=${prompts.value}`)
}
</script>

<template>
  <div class="flex flex-col justify-end items-center w-full h-full">
    <div class="text-4xl flex flex-row gap-5 self-center font-blod"
      style="background: linear-gradient(90deg, #E88AFF 0%, #FFE373 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
      {{ `Hello, ${isAuthenticated ? userInfo.username : 'Please Login'}!` }}
    </div>
    <div class="w-full h-72 max-w-4xl py-10 px-4">
      <PromptArea v-model="prompts" @action="start" model="doubt" />
    </div>
  </div>
</template>
