<template>
  <div class="flex flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
    <CustomHeader @search="onSearch" />
    
    <!-- 主内容区 -->
    <div class="flex flex-1 items-center justify-center">
      <main class="w-full max-w-2xl p-6 lg:p-8">
        <!-- 标题 -->
        <div class="text-center mb-12">
          <h1 class="text-4xl lg:text-5xl font-black leading-tight tracking-tighter mb-4">SmallYoung</h1>
          <p class="text-lg text-text-light/70 dark:text-text-dark/70">现代化课程学习平台</p>
        </div>
        
        <!-- 菜单列表 -->
        <nav class="space-y-4">
          <!-- 课程演示菜单项 -->
          <a 
            href="/courses" 
            class="group flex items-center justify-between p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-primary hover:shadow-lg transition-all"
          >
            <div class="flex items-center gap-4">
              <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <span class="material-symbols-outlined text-2xl">school</span>
              </div>
              <div>
                <h2 class="text-xl font-bold">课程演示</h2>
                <p class="text-sm text-text-light/60 dark:text-text-dark/60">Slidev 演示课件 · {{ coursesData.stats.totalCourses }} 门课程</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-text-light/40 dark:text-text-dark/40 group-hover:text-primary transition-colors">chevron_right</span>
          </a>
          
          <!-- 技术文档菜单项 -->
          <a 
            href="/docs" 
            class="group flex items-center justify-between p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-primary hover:shadow-lg transition-all"
          >
            <div class="flex items-center gap-4">
              <div class="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <span class="material-symbols-outlined text-2xl">description</span>
              </div>
              <div>
                <h2 class="text-xl font-bold">技术文档</h2>
                <p class="text-sm text-text-light/60 dark:text-text-dark/60">深度技术文章 · {{ docsData.stats.totalDocs }} 篇文档</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-text-light/40 dark:text-text-dark/40 group-hover:text-primary transition-colors">chevron_right</span>
          </a>
        </nav>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { data as coursesData } from '../../data/courses.data'
import { data as docsData } from '../../data/docs.data'
import CustomHeader from './CustomHeader.vue'

function onSearch(query: string) {
  console.log('搜索:', query)
}
</script>
