<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
    <CustomHeader @search="onSearch" />
    
    <!-- 开发模式提示 -->
    <div v-if="isDevMode" class="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-6 py-3">
      <div class="mx-auto max-w-7xl flex items-center gap-3">
        <span class="text-yellow-600 dark:text-yellow-400">⚠️</span>
        <p class="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>开发模式：</strong>文档链接可能无法访问。请运行 <code class="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 rounded">npm start</code> 查看完整系统。
        </p>
      </div>
    </div>
    
    <div class="flex flex-1">
      <main class="w-full flex-1 p-6 lg:p-8">
        <div class="mx-auto max-w-7xl">
          <div class="mb-6">
            <h1 class="text-4xl font-black leading-tight tracking-tighter">技术文档</h1>
            <p class="mt-2 text-text-light/60 dark:text-text-dark/60">深入学习各类技术知识</p>
            <!-- 分类导航 -->
            <DocCategoryNav 
              v-if="docsData && docsData.docs && docsData.docs.length > 0"
              :categories="docsData.categories"
              :total-docs="docsData.stats.totalDocs"
              :selected-category="selectedCategory"
              @category-change="onCategoryChange"
            />
          </div>
          
          <div v-if="docsData && docsData.docs && docsData.docs.length > 0">
            <!-- 文档列表 -->
            <div v-if="filteredDocs.length > 0" class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              <DocCard 
                v-for="doc in filteredDocs"
                :key="doc.id"
                :doc="doc"
              />
            </div>
            
            <!-- 无结果提示 -->
            <div v-else class="text-center py-16">
              <div class="text-6xl mb-4">😕</div>
              <p class="text-xl font-semibold text-text-light dark:text-text-dark mb-2">没有找到匹配的文档</p>
              <p class="text-text-light/60 dark:text-text-dark/60">试试调整筛选条件或搜索关键词</p>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-else class="text-center py-16">
            <div class="text-8xl mb-4 opacity-50">📄</div>
            <p class="text-xl font-semibold text-text-light/70 dark:text-text-dark/70 mb-2">暂无文档</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { data as docsData } from '../../data/docs.data'
import CustomHeader from './CustomHeader.vue'
import DocCard from './DocCard.vue'
import DocCategoryNav from './DocCategoryNav.vue'

// 状态管理
const selectedCategory = ref<string | null>(null)
const searchQuery = ref('')

// 检测是否为开发模式
const isDevMode = import.meta.env.DEV

// 过滤后的文档列表
const filteredDocs = computed(() => {
  let docs = docsData.docs || []
  
  // 按分类筛选
  if (selectedCategory.value) {
    docs = docs.filter(d => d.category === selectedCategory.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    docs = docs.filter(doc => {
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.category.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
        doc.author.toLowerCase().includes(query)
      )
    })
  }
  
  return docs
})

// 事件处理
function onCategoryChange(category: string | null) {
  selectedCategory.value = category
}

function onSearch(query: string) {
  searchQuery.value = query
}

function reloadPage() {
  window.location.reload()
}
</script>
