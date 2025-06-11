<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import rehypeShiki from '@shikijs/rehype'
import 'katex/dist/katex.min.css'

const props = defineProps<{
  content: string | undefined
}>()

const defaultContent = `
# Markdown 全面测试

## 1. 标题

# 一级标题
## 二级标题
### 三级标题

## 2. 强调
**加粗**
*斜体*
~~删除线~~

## 3. 列表
- 无序列表项 1
- 无序列表项 2
  - 嵌套项
1. 有序列表项 1
2. 有序列表项 2

## 4. 任务列表（GFM）
- [x] 已完成任务
- [ ] 未完成任务

## 5. 链接与图片
[百度](https://www.baidu.com)
<https://www.github.com>
![图片](https://picsum.photos/200/300)

## 6. 引用
> 这是一段引用文本。

## 7. 代码
行内代码：\`console.log('Hello')\`
代码块：
\`\`\`js
console.log('Hello, Markdown!')
\`\`\`

## 8. 表格（GFM）
| 姓名   | 年龄 | 城市   |
| ------ | ---- | ------ |
| 张三   | 18   | 北京   |
| 李四   | 22   | 上海   |

## 9. 分割线
---
***
___

## 10. 自动编号
- [ ] 任务1
- [x] 任务2

## 11. Emoji（GFM）
:smile: :rocket: :+1:

## 12. LaTeX 数学公式
行内公式：$E=mc^2$

块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## 13. KaTeX 测试
$$
\\frac{a^2 + b^2}{c^2}
$$
`

const html = ref('')

async function renderMarkdown(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkEmoji)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeShiki, {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      }
    })
    .use(rehypeStringify)
    .process(markdown)
  html.value = String(file)
}

watch(() => props.content, (val) => {
  renderMarkdown(val || defaultContent)
}, { immediate: true })

onMounted(() => {
  renderMarkdown(props.content || defaultContent)
})
</script>

<template>
  <div class="markdown-container" v-html="html"></div>
</template>