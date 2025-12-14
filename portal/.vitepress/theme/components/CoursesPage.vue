<template>
  <div class="flex flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
    <CustomHeader @search="onSearch" />
    
    <div class="flex flex-1">
      <main class="w-full flex-1 p-6 lg:p-8">
        <div class="mx-auto max-w-7xl">
          <div class="mb-6">
            <h1 class="text-4xl font-black leading-tight tracking-tighter">所有课程</h1>
            <!-- 分类导航 -->
            <CategoryNav 
              v-if="coursesData && coursesData.courses && coursesData.courses.length > 0"
              :categories="coursesData.categories"
              :total-courses="coursesData.stats.totalCourses"
              :selected-category="selectedCategory"
              @category-change="onCategoryChange"
            />
          </div>
          
          <div v-if="coursesData && coursesData.courses && coursesData.courses.length > 0">
            <!-- 课程列表 -->
            <div v-if="filteredCourses.length > 0">
              <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                <CourseCard 
                  v-for="course in paginatedCourses"
                  :key="course.id"
                  :course="course"
                />
              </div>
              
              <!-- 分页 -->
              <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
                <button 
                  @click="currentPage = 1" 
                  :disabled="currentPage === 1"
                  class="px-3 py-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="material-symbols-outlined text-sm">first_page</span>
                </button>
                <button 
                  @click="currentPage--" 
                  :disabled="currentPage === 1"
                  class="px-3 py-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                
                <div class="flex items-center gap-1">
                  <template v-for="page in displayedPages" :key="page">
                    <button 
                      v-if="page !== '...'"
                      @click="currentPage = page as number"
                      :class="[
                        'px-4 py-2 rounded-lg border transition-colors',
                        currentPage === page 
                          ? 'bg-primary text-white border-primary' 
                          : 'border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-2 text-text-light/50 dark:text-text-dark/50">...</span>
                  </template>
                </div>
                
                <button 
                  @click="currentPage++" 
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="material-symbols-outlined text-sm">chevron_right</span>
                </button>
                <button 
                  @click="currentPage = totalPages" 
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="material-symbols-outlined text-sm">last_page</span>
                </button>
                
                <span class="ml-4 text-sm text-text-light/60 dark:text-text-dark/60">
                  共 {{ filteredCourses.length }} 门课程
                </span>
              </div>
            </div>
            
            <!-- 无结果提示 -->
            <div v-else class="text-center py-16">
              <div class="text-6xl mb-4">😕</div>
              <p class="text-xl font-semibold text-text-light dark:text-text-dark mb-2">没有找到匹配的课程</p>
              <p class="text-text-light/60 dark:text-text-dark/60">试试调整筛选条件或搜索关键词</p>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-else class="flex flex-col items-center justify-center py-20">
            <div class="text-8xl mb-6 opacity-50">📚</div>
            <p class="text-2xl font-semibold text-text-light/70 dark:text-text-dark/70 mb-2">暂无课程</p>
            <p class="text-text-light/50 dark:text-text-dark/50">课程正在准备中，敬请期待</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { data as coursesData } from '../../data/courses.data'
import CustomHeader from './CustomHeader.vue'
import CourseCard from './CourseCard.vue'
import CategoryNav from './CategoryNav.vue'

// 状态管理
const selectedCategory = ref<string | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 12 // 每页显示数量

// 过滤后的课程列表
const filteredCourses = computed(() => {
  let courses = coursesData.courses || []
  
  // 按分类筛选
  if (selectedCategory.value) {
    courses = courses.filter(c => c.category === selectedCategory.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    courses = courses.filter(course => {
      return (
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query)) ||
        course.author.toLowerCase().includes(query)
      )
    })
  }
  
  return courses
})

// 总页数
const totalPages = computed(() => Math.ceil(filteredCourses.value.length / pageSize))

// 当前页数据
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredCourses.value.slice(start, end)
})

// 显示的页码
const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 筛选条件变化时重置页码
watch([selectedCategory, searchQuery], () => {
  currentPage.value = 1
})

// 事件处理
function onCategoryChange(category: string | null) {
  selectedCategory.value = category
}

function onSearch(query: string) {
  searchQuery.value = query
}
</script>
