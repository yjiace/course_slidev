<template>
  <div class="relative flex h-auto min-h-screen w-full bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
    <!-- 主内容区 -->
    <main class="flex-1 p-6 lg:p-8 lg:pr-80">
      <div class="mx-auto max-w-4xl">
        <!-- 返回按钮 -->
        <a href="/docs" class="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
          返回文档列表
        </a>
        
        <!-- 文档头部 -->
        <header class="mb-8">
          <div class="flex flex-wrap gap-2 mb-4">
            <span :class="getCategoryClass()">{{ doc?.category }}</span>
            <span 
              v-for="(tag, index) in doc?.tags?.slice(0, 5)" 
              :key="tag"
              :class="getTagClass(index)"
            >
              {{ tag }}
            </span>
          </div>
          <h1 class="text-4xl font-black leading-tight tracking-tighter mb-4">{{ doc?.title }}</h1>
          <p class="text-lg text-text-light/70 dark:text-text-dark/70 mb-4">{{ doc?.description }}</p>
          <div class="flex items-center gap-4 text-sm text-text-light/60 dark:text-text-dark/60">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">person</span>
              {{ doc?.author }}
            </span>
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">calendar_today</span>
              {{ formatDate(doc?.date) }}
            </span>
          </div>
        </header>
        
        <!-- 文档内容 -->
        <article class="doc-content prose prose-lg dark:prose-invert max-w-none" v-html="renderedContent">
        </article>
      </div>
    </main>
    
    <!-- 右侧目录 -->
    <aside class="hidden lg:block fixed right-0 top-0 w-72 h-screen border-l border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark overflow-y-auto p-6">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-text-light/60 dark:text-text-dark/60 mb-4">
        目录
      </h3>
      <nav class="toc">
        <ul class="space-y-2">
          <li 
            v-for="item in toc" 
            :key="item.slug"
            :style="{ paddingLeft: `${(item.level - 1) * 0.75}rem` }"
          >
            <a 
              :href="`#${item.slug}`"
              :class="[
                'block py-1 text-sm transition-colors',
                activeSlug === item.slug 
                  ? 'text-primary font-medium' 
                  : 'text-text-light/70 dark:text-text-dark/70 hover:text-primary'
              ]"
              @click.prevent="scrollToHeading(item.slug)"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import type { Doc, TocItem } from '../../../../scripts/generate-docs-index'

const props = defineProps<{
  doc: Doc | null
}>()

const activeSlug = ref('')

// 预定义的颜色样式数组（用于自动分配）
const colorStyles = [
  { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900', darkText: 'dark:text-blue-200' },
  { bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900', darkText: 'dark:text-red-200' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900', darkText: 'dark:text-yellow-200' },
  { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900', darkText: 'dark:text-green-200' },
  { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900', darkText: 'dark:text-purple-200' },
  { bg: 'bg-pink-100', text: 'text-pink-800', darkBg: 'dark:bg-pink-900', darkText: 'dark:text-pink-200' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800', darkBg: 'dark:bg-indigo-900', darkText: 'dark:text-indigo-200' },
  { bg: 'bg-teal-100', text: 'text-teal-800', darkBg: 'dark:bg-teal-900', darkText: 'dark:text-teal-200' },
  { bg: 'bg-orange-100', text: 'text-orange-800', darkBg: 'dark:bg-orange-900', darkText: 'dark:text-orange-200' },
  { bg: 'bg-cyan-100', text: 'text-cyan-800', darkBg: 'dark:bg-cyan-900', darkText: 'dark:text-cyan-200' },
]

// 根据字符串生成哈希值
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// 根据分类名称自动生成颜色类
function getCategoryClass() {
  const category = props.doc?.category || ''
  const hash = hashString(category)
  const colorIndex = hash % colorStyles.length
  const color = colorStyles[colorIndex]
  return `inline-block rounded px-2 py-0.5 text-xs font-medium ${color.bg} ${color.text} ${color.darkBg} ${color.darkText}`
}

// 根据标签索引生成颜色类
function getTagClass(index: number) {
  const color = colorStyles[(index + 3) % colorStyles.length]
  return `inline-block rounded px-2 py-0.5 text-xs font-medium ${color.bg} ${color.text} ${color.darkBg} ${color.darkText}`
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN')
  } catch {
    return dateStr
  }
}

// 获取目录
const toc = computed<TocItem[]>(() => {
  return props.doc?.toc || []
})

// 渲染 Markdown 内容（由 VitePress 自动处理）
const renderedContent = computed(() => {
  // 内容由 VitePress 渲染后传入 或使用原始 markdown
  return props.doc?.meta?.content || ''
})

// 滚动到指定标题
function scrollToHeading(slug: string) {
  const element = document.getElementById(slug)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSlug.value = slug
  }
}

// 监听滚动更新当前目录项
function handleScroll() {
  const headings = document.querySelectorAll('.doc-content h1, .doc-content h2, .doc-content h3')
  let currentSlug = ''
  
  for (const heading of headings) {
    const rect = heading.getBoundingClientRect()
    if (rect.top <= 100) {
      currentSlug = heading.id
    }
  }
  
  if (currentSlug) {
    activeSlug.value = currentSlug
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 初始化高亮第一个
  if (toc.value.length > 0) {
    activeSlug.value = toc.value[0].slug
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* 文档内容样式 */
.doc-content h1,
.doc-content h2,
.doc-content h3,
.doc-content h4,
.doc-content h5,
.doc-content h6 {
  scroll-margin-top: 5rem;
}

.doc-content h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.doc-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.doc-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.doc-content p {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.doc-content pre {
  background-color: #1e1e1e;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.doc-content code {
  font-family: 'Fira Code', 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
}

.doc-content :not(pre) > code {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}

.dark .doc-content :not(pre) > code {
  background-color: rgba(255, 255, 255, 0.1);
}

.doc-content ul,
.doc-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.doc-content li {
  margin-bottom: 0.5rem;
}

.doc-content blockquote {
  border-left: 4px solid var(--vp-c-brand);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--vp-c-text-2);
}
</style>
