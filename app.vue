<script setup lang="ts">
useHead({
  title: 'EchoAI',
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/logo.svg' },
  ]
})
</script>

<template>
  <div class="bg">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
.bg {
  background: #D9D9D9;
  font-family: 'Noto Serif SC', 'Noto Serif TC';
  font-weight: 400;
}
</style>
