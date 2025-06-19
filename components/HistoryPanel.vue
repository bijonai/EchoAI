<template>
  <div class="flex flex-col flex-grow gap-5 p-2 items-stretch h-full">
    <div
      class="h-14 mb-2 flex justify-center items-center bg-[#E7E3C5] text-[#605F54] rounded-md hover:shadow-lg transition-all duration-100"
      @click="navigateTo('/')">
      <span class="opacity-60">New Chat</span>
    </div>
    <div class="flex h-full flex-col gap-2 scroll-smooth text-[#8B8876] overflow-y-scroll scrollbar-hide">
      <template v-for="groupName in Object.keys(groupedHistory)" :key="groupName">
        <template v-if="groupedHistory[groupName as keyof typeof groupedHistory].length">
          <div class="flex items-center mt-2">
            <span class="text-sm text-[#A6A28B] opacity-40 whitespace-nowrap">{{ groupLabels[groupName as keyof typeof
              groupLabels] }}</span>
          </div>
          <div v-for="item in groupedHistory[groupName as keyof typeof groupedHistory]" :key="item.id"
            class="h-16 flex flex-col justify-between p-2 bg-[#E7E3C5] rounded-md hover:shadow-lg transition-all duration-100"
            @click="navigateTo(`/chat/${item.id}`)">
            <span class="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {{ item.title }}
            </span>
            <span class="flex items-center gap-2">
              <Icon name="humbleicons:bookmark" class="!w-4 !h-4" />
              <span class="text-sm">{{ item.date }}</span>
            </span>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface HistoryItem {
  id: string
  title: string
  date: string
}

const accessToken = useState<string | undefined>('access-token');

const history = ref<HistoryItem[]>([])

const groupLabels = {
  recent: 'Recent',
  week: 'Last 7 days',
  month: 'Last 30 days',
  older: 'Older',
}

function parseDate(str: string) {
  return new Date(str)
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

const groupedHistory = computed(() => {
  const now = new Date()
  const groups: Record<string, any[]> = {
    recent: [],
    week: [],
    month: [],
    older: []
  }
  history.value
    .slice()
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
    .forEach(item => {
      const diff = (now.getTime() - parseDate(item.date).getTime()) / 1000
      if (diff < 60 * 60 * 24) {
        groups.recent.push(item)
      } else if (diff < 60 * 60 * 24 * 7) {
        groups.week.push(item)
      } else if (diff < 60 * 60 * 24 * 30) {
        groups.month.push(item)
      } else {
        groups.older.push(item)
      }
    })
  return groups
})

onMounted(async () => {
  const data = await $fetch('/api/chat/history', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken.value}`
    }
  })
  history.value = data.map((item: any) => ({
    id: item.id,
    title: item.id,
    date: formatDate(item.updated_at)
  }))
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

