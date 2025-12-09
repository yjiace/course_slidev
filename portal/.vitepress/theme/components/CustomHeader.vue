<template>
  <header class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-solid border-border-light dark:border-border-dark bg-card-light/80 dark:bg-card-dark/80 px-6 backdrop-blur-sm">
    <div class="flex items-center gap-6">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span class="material-symbols-outlined text-primary text-3xl">school</span>
        <h1 class="text-xl font-bold tracking-tight">软件学院</h1>
      </a>
      
      <!-- 导航菜单 -->
      <nav class="hidden md:flex items-center gap-1">
        <a href="/" class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          文档
        </a>
        <a href="/courses" class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          课程
        </a>
      </nav>
    </div>
    <div class="flex flex-1 justify-end gap-4">
      <div class="relative flex w-full max-w-sm items-center">
        <div class="pointer-events-none absolute left-0 flex h-full w-10 items-center justify-center text-slate-400">
          <span class="material-symbols-outlined">search</span>
        </div>
        <input 
          v-model="searchQuery"
          :style="{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }"
          class="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 pl-10 pr-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
          placeholder="搜索课程或文档" 
          type="text"
          @input="onSearchInput"
        />
      </div>
      <button 
        class="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        @click="toggleTheme"
        :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
      >
        <span class="material-symbols-outlined dark:hidden">dark_mode</span>
        <span class="material-symbols-outlined hidden dark:inline">light_mode</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 搜索状态
const searchQuery = ref('')
let searchTimeout: NodeJS.Timeout | null = null

// 主题状态
const isDark = ref(false)

// 发出事件
const emit = defineEmits<{
  'search': [query: string]
}>()

// 防抖搜索
function onSearchInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    emit('search', searchQuery.value)
  }, 300)
}

// 主题切换
function toggleTheme() {
  isDark.value = !isDark.value
  const htmlElement = document.documentElement
  
  if (isDark.value) {
    htmlElement.classList.add('dark')
    saveTheme('dark')
  } else {
    htmlElement.classList.remove('dark')
    saveTheme('light')
  }
}

// 保存主题到 localStorage
function saveTheme(theme: 'light' | 'dark') {
  try {
    localStorage.setItem('theme', theme)
  } catch (error) {
    console.warn('Failed to save theme preference:', error)
  }
}

// 加载主题
function loadTheme() {
  try {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }
  } catch (error) {
    console.warn('Failed to load theme preference:', error)
    // 默认使用浅色主题
    isDark.value = false
  }
}

// 组件挂载时加载主题
onMounted(() => {
  loadTheme()
})
</script>
