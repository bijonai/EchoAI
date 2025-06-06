<script setup lang="ts">
const prompt = ref('')

function getPeriod(): "morning" | "afternoon" | "evening" {
  const now = new Date();
  const hours = now.getHours();
  if (hours < 12) return "morning";
  if (hours < 18) return "afternoon";
  return "evening";
}

function start() {

}
</script>

<template>
  <div class="flex flex-col w-full h-full pt-48">
    <div class="text-4xl flex flex-row gap-5 self-center font-blod">
      {{ `Good ${getPeriod()}, let's get started! 尊重` }}
    </div>
    <div class="w-full h-72 px-56 py-10">
      <div class="w-full h-full mx-auto max-w-[900px]">
        <PromptArea v-model="prompt" @send="start" />
      </div>
    </div>
  </div>
</template>
