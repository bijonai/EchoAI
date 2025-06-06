<script setup lang="ts">
import type { LessonSummary } from '~/types'

const lessons = ref<LessonSummary[]>([
  {
    id: '1',
    title: 'Lesson 1',
    description: 'Lesson 1 description',
    author: 'John Doe',
    tags: ['tag1', 'tag2', 'tag3'],
    price: 100,
  },
])
</script>

<template>
  <div class="w-full">
    <div class="flex flex-col items-center justify-center gap-10 py-10">
      <div class="text-4xl">
        Community
      </div>
      <div class="w-full px-24 flex flex-row gap-2">
        <Input placeholder="Search for a lesson, examination or topic" />
        <div class="flex h-full">
          <Button color="#EBEBDB" size="lg">
            <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-gray-700" />
          </Button>
        </div>
      </div>
    </div>
    <div class="w-full px-24">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="(lesson, index) in lessons" :key="index" class="flex size-full">
          <LessonCard :id="lesson.id" :title="lesson.title" :description="lesson.description" :author="lesson.author"
            :tags="lesson.tags" :price="lesson.price" />
        </div>
      </div>
    </div>
  </div>
</template>