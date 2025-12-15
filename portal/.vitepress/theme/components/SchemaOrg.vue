<script setup lang="ts">
import { computed, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useHead } from '@unhead/vue'

const { frontmatter, site } = useData()
const route = useRoute()

// 站点基础信息
const siteUrl = 'https://www.smallyoung.cn'
const publisher = {
  '@type': 'Organization',
  name: 'SmallYoung',
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/favicon.png`
  }
}

// 处理封面图 URL
function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('http')) return url
  return `${siteUrl}${url}`
}

// 生成 Article Schema
const articleSchema = computed(() => {
  const fm = frontmatter.value
  // 非文章页面跳过（有特殊 layout 或没有 title）
  if (!fm.title || (fm.layout && fm.layout !== 'doc-detail')) return null
  // 课程类型跳过
  if (fm.type === 'course') return null
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description || '',
    image: normalizeImageUrl(fm.cover),
    datePublished: fm.date,
    dateModified: fm.dateModified || fm.date,
    author: {
      '@type': 'Person',
      name: fm.author || 'SmallYoung'
    },
    publisher,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}${route.path}`
    },
    keywords: fm.keywords?.join(', ') || fm.tags?.join(', ') || undefined
  }
})

// 生成 Course Schema（课程页面）
const courseSchema = computed(() => {
  const fm = frontmatter.value
  if (fm.type !== 'course') return null
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: fm.title,
    description: fm.description || '',
    provider: publisher,
    image: normalizeImageUrl(fm.cover),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online'
    }
  }
})

// 生成 FAQPage Schema（含 FAQ 的页面）
const faqSchema = computed(() => {
  const fm = frontmatter.value
  if (!fm.faq || !Array.isArray(fm.faq)) return null
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: fm.faq.map((item: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }
})

// 合并所有 Schema 并过滤空值
const schemas = computed(() => {
  return [articleSchema.value, courseSchema.value, faqSchema.value].filter(Boolean)
})

// 使用 watch 动态更新 head
watch(schemas, (newSchemas) => {
  if (newSchemas.length > 0) {
    useHead({
      script: newSchemas.map(schema => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema)
      }))
    })
  }
}, { immediate: true })
</script>

<template>
  <!-- Schema.org 结构化数据组件 - 无渲染输出 -->
</template>
