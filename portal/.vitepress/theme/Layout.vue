<template>
  <!-- 首页布局 -->
  <div v-if="frontmatter.layout === 'home'" class="min-h-screen flex flex-col">
    <HomePage class="flex-1" />
    <GlobalFooter />
  </div>
  
  <!-- 课程列表页布局 -->
  <div v-else-if="frontmatter.layout === 'courses'" class="min-h-screen flex flex-col">
    <CoursesPage class="flex-1" />
    <GlobalFooter />
  </div>
  
  <!-- 文档列表页布局 -->
  <div v-else-if="frontmatter.layout === 'docs'" class="min-h-screen flex flex-col">
    <DocsPage class="flex-1" />
    <GlobalFooter />
  </div>
  
  <!-- 文档详情页布局 -->
  <div v-else-if="frontmatter.layout === 'doc-detail'" class="min-h-screen flex flex-col">
    <DocDetailPage class="flex-1" :doc="currentDoc" />
    <GlobalFooter />
  </div>
  
  <!-- 默认 VitePress 布局 -->
  <DefaultTheme.Layout v-else>
    <template #doc-footer-before>
      <GlobalFooter />
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import CoursesPage from './components/CoursesPage.vue'
import DocsPage from './components/DocsPage.vue'
import DocDetailPage from './components/DocDetailPage.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import { data as docsData } from '../data/docs.data'

const { frontmatter } = useData()
const route = useRoute()

// 获取当前文档
const currentDoc = computed(() => {
  const path = route.path
  // 从 /docs/frontend/vue-basic 提取 frontend-vue-basic
  const match = path.match(/^\/docs\/(.+)$/)
  if (match && docsData.docs) {
    const docId = match[1].replace(/\//g, '-')
    return docsData.docs.find(d => d.id === docId) || null
  }
  return null
})
</script>
