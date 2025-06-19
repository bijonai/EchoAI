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
  background: #E7E3C5;
    font-family: "Inconsolata", "Noto Serif SC", "Noto Serif TC", serif;
  font-weight: 400;
}
</style>
