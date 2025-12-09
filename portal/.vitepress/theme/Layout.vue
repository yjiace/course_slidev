<template>
  <HomePage v-if="frontmatter.layout === 'home'" />
  <CoursesPage v-else-if="frontmatter.layout === 'courses'" />
  <DocsPage v-else-if="frontmatter.layout === 'docs'" />
  <DocDetailPage v-else-if="frontmatter.layout === 'doc-detail'" :doc="currentDoc" />
  <DefaultTheme.Layout v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import CoursesPage from './components/CoursesPage.vue'
import DocsPage from './components/DocsPage.vue'
import DocDetailPage from './components/DocDetailPage.vue'
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

