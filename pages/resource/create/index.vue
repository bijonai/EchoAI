<template>
  <div class="resource-create bg-[#FEFFE4] m-4 p-4 rounded-lg overflow-y-scroll">
    <h1>新增资源</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>名称：</label>
        <input v-model="form.name" required />
      </div>
      <div>
        <label>标签（逗号分隔）：</label>
        <input v-model="form.tags" />
      </div>
      <div>
        <label>作者：</label>
        <input v-model="form.author" />
      </div>
      <div>
        <label>描述：</label>
        <textarea v-model="form.description" />
      </div>
      <div>
        <label>Readme：</label>
        <input type="file" accept=".md" @change="handleReadmeUpload" />
        <div v-if="form.readme" style="color: #888; font-size: 12px;">已上传</div>
      </div>
      <div>
        <label>资源（逗号分隔）：</label>
        <input v-model="form.sources" />
      </div>
      <div>
        <label>章节：</label>
        <input type="file" accept=".md" @change="handleSectionsUpload" />
        <div v-if="form.sections.length > 0" style="color: #888; font-size: 12px;">已上传并分段，共{{ form.sections.length }}段
        </div>
      </div>
      <button type="submit">提交</button>
    </form>
    <div v-if="successMsg" style="color: green;">{{ successMsg }}</div>
    <div v-if="errorMsg" style="color: red;">{{ errorMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  type: '',
  name: '',
  tags: '',
  author: '',
  description: '',
  readme: '',
  sources: '',
  sections: [] as string[],
})

const successMsg = ref('')
const errorMsg = ref('')
const accessToken = useState<string | undefined>('access-token');

const handleReadmeUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    form.value.readme = (ev.target?.result as string).trim() || ''
  }
  reader.readAsText(file)
}

const handleSectionsUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    const content = ev.target?.result as string || ''
    form.value.sections = content.split(/\n\s*---+\s*\n/).map(s => s.trim()).filter(Boolean)
  }
  reader.readAsText(file)
}

const addSection = () => {
  // 不再需要手动添加章节
}

const handleSubmit = async () => {
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const res = await fetch('/api/resource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify({
        ...form.value,
        tags: form.value.tags ? form.value.tags.split(',').map((t, idx) => {
          return {
            name: t.trim(),
            id: idx.toString(),
          }
        }) : [],
        sources: form.value.sources ? form.value.sources.split(',').map(s => {
          return {
            text: s.trim(),
          }
        }) : [],
      }),
    })
    if (!res.ok) throw new Error('提交失败')
    const data = await res.json()
    successMsg.value = `资源创建成功，ID: ${data.id}`
    // 可选：跳转到资源详情页
    // router.push(`/resource/${data.id}`)
  } catch (e: any) {
    errorMsg.value = e.message || '发生错误'
  }
}
</script>

<style scoped>
.resource-create form>div {
  margin-bottom: 16px;
}

.resource-create label {
  display: inline-block;
  width: 100px;
}

.resource-create input,
.resource-create textarea {
  width: 80%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.resource-create button {
  padding: 8px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.resource-create button:hover {
  background: #66b1ff;
}
</style>
