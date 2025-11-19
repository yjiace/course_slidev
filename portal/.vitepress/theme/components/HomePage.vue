<template>
  <div class="home-page">
    <div class="hero-section">
      <h1 class="hero-title">欢迎来到软件学院课程门户</h1>
      <p class="hero-description">
        这里汇集了软件学院各教研室的精品课程，使用现代化的演讲课件替代传统PPT，为您提供更好的学习体验。
      </p>
    </div>

    <div class="course-portal">
      <div v-if="coursesData && coursesData.courses && coursesData.courses.length > 0">
        <!-- 搜索栏 -->
        <SearchBar 
          :courses="coursesData.courses"
          @search="onSearch"
        />
        
        <!-- 分类导航 -->
        <CategoryNav 
          :categories="coursesData.categories"
          :total-courses="coursesData.stats.totalCourses"
          @category-change="onCategoryChange"
        />
        
        <!-- 标签云 -->
        <TagCloud 
          :tags="coursesData.tags"
          @tag-change="onTagChange"
        />
        
        <!-- 筛选提示 -->
        <div v-if="selectedCategory || selectedTag || searchQuery" class="filter-info">
          <span v-if="selectedCategory">
            📚 分类: <strong>{{ selectedCategory }}</strong>
          </span>
          <span v-if="selectedTag">
            🏷️ 标签: <strong>{{ selectedTag }}</strong>
          </span>
          <span v-if="searchQuery">
            🔍 搜索: <strong>{{ searchQuery }}</strong>
          </span>
          <span class="filter-result">
            找到 <strong>{{ filteredCourses.length }}</strong> 门课程
          </span>
        </div>
        
        <!-- 课程列表 -->
        <div v-if="filteredCourses.length > 0" class="course-grid">
          <CourseCard 
            v-for="course in filteredCourses"
            :key="course.id"
            :course="course"
            @tag-click="onTagClick"
          />
        </div>
        
        <!-- 无结果提示 -->
        <div v-else class="no-results">
          <div class="no-results-icon">😕</div>
          <p class="no-results-text">没有找到匹配的课程</p>
          <p class="no-results-hint">试试调整筛选条件或搜索关键词</p>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-state-icon">📚</div>
        <p class="empty-state-text">暂无课程</p>
        <p class="empty-state-hint">请在 courses 目录下创建 Slidev 课程</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { data as coursesData } from '../../data/courses.data'
import CourseCard from './CourseCard.vue'
import CategoryNav from './CategoryNav.vue'
import TagCloud from './TagCloud.vue'
import SearchBar from './SearchBar.vue'

// 状态管理
const selectedCategory = ref<string | null>(null)
const selectedTag = ref<string | null>(null)
const searchQuery = ref('')

// 过滤后的课程列表
const filteredCourses = computed(() => {
  let courses = coursesData.courses || []
  
  // 按分类筛选
  if (selectedCategory.value) {
    courses = courses.filter(c => c.category === selectedCategory.value)
  }
  
  // 按标签筛选
  if (selectedTag.value) {
    courses = courses.filter(c => c.tags.includes(selectedTag.value))
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

// 事件处理
function onCategoryChange(category: string | null) {
  selectedCategory.value = category
  selectedTag.value = null
}

function onTagChange(tag: string | null) {
  selectedTag.value = tag
  selectedCategory.value = null
}

function onTagClick(tag: string) {
  selectedTag.value = tag
  selectedCategory.value = null
}

function onSearch(query: string) {
  searchQuery.value = query
}
</script>

<style scoped>
.home-page {
  width: 100%;
}

.hero-section {
  text-align: center;
  padding: 3rem 1rem 2rem;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-brand);
  margin: 0 0 1rem 0;
}

.hero-description {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.course-portal {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.filter-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
}

.filter-info strong {
  color: var(--vp-c-brand);
}

.filter-result {
  margin-left: auto;
  font-weight: 600;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-results-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem 0;
}

.no-results-hint {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin: 0 0 0.5rem 0;
}

.empty-state-hint {
  font-size: 1rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem 1.5rem;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .course-portal {
    padding: 0 0.5rem 1.5rem;
  }
  
  .course-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .filter-result {
    margin-left: 0;
  }
}
</style>
