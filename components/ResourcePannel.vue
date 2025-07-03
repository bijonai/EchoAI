<template>
  <div class="w-full h-full flex-grow grid grid-cols-4 gap-2 max-h-[calc(100vh-8rem)]">
    <div class="col-span-3 flex flex-col justify-between h-full overflow-y-scroll scrollbar-hide">
      <div class="grid gap-2" style="grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));">
        <ResourceCard v-for="i in data" :key="i.id" :data="i" @click="activeCardId = i.id" @start="start(i.id)" />
      </div>
      <div class="flex justify-center mt-4">
        <Pagination :page-count="props.pageCount" :current-page="props.currentPage"
          @update:page="(val: number) => emit('update:page', val)" />
      </div>
    </div>
    <div class="col-span-1">
      <div class="w-full h-full bg-[#FEFFE4] rounded-md p-4 flex flex-col gap-4 overflow-y-auto">
        <template v-if="activeResource">
          <div class="text-xl font-bold mb-2 text-[#66665B] opacity-80">{{ activeResource.name }}</div>
          <div class="mb-2 text-[#66665B] opacity-60">{{ activeResource.description }}</div>
          <div class="flex-1 min-h-0 overflow-y-auto">
            <MarkdownRenderer :content="activeResource.readme" class="text-[#5C5B4F] opacity-80" />
          </div>
        </template>
        <template v-else>
          <div class="text-[#A6A28B] opacity-40 text-center mt-8">请选择一个资源卡片</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PublicResource } from '~/types/resource';
import MarkdownRenderer from './MarkdownRenderer.vue'
import Pagination from './Pagination.vue'
import { chat } from '~/api';

const props = defineProps<{
  data: PublicResource[],
  pageCount: number,
  currentPage: number,
}>()
const emit = defineEmits(['update:page'])

let activeCardId = ref<string | null>(null)
const activeResource = computed(() => props.data.find((i) => i.id === activeCardId.value))

const accessToken = useState<string | undefined>('access-token');

async function start(resource_id: string) {
  const data = await chat.create({
    prompt: '根据给出的课程进行设计',
  }, accessToken.value)
  navigateTo(`/chat/${data.chat_id}?new=${'根据给出的课程进行设计'}&resource_id=${resource_id}`)
}
</script>

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
