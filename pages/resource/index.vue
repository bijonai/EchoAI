<template>
  <div class="w-full h-full px-20 pt-10 pb-4 ">
    <div class="max-w-6xl mx-auto h-full flex flex-col gap-4 items-stretch justify-start">
      <ResourceSearchBanner />
      <ResourcePannel :data="data" :page-count="Math.ceil(total / pageSize)" :current-page="page"
        @update:page="(val: number) => { if (val >= 1 && val <= Math.ceil(total / pageSize)) page = val }" />
      <div class="flex-1"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PublicResource } from '~/types/resource';

const accessToken = useState<string | undefined>('access-token');

const data = ref<PublicResource[]>([])
const total = ref<number>(0)
const page = ref(1)
const pageSize = 15

const fetchData = async () => {
  await $fetch('/api/resource', {
    method: 'GET',
    query: {
      limit: pageSize,
      offset: (page.value - 1) * pageSize,
    },
    headers: {
      'Authorization': `Bearer ${accessToken.value}`,
    },
  }).then((res) => {
    data.value = res.resources as PublicResource[]
    total.value = res.total
  })
}

onMounted(fetchData)

watch(page, fetchData)

</script>

<style scoped></style>