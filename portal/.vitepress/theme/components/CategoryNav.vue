<template>
  <div class="category-nav">
    <h3 class="category-nav-title">📚 课程分类</h3>
    
    <div class="category-list">
      <button
        class="category-item"
        :class="{ active: selectedCategory === null }"
        @click="selectCategory(null)"
      >
        <span class="category-name">全部课程</span>
        <span class="category-count">{{ totalCourses }}</span>
      </button>
      
      <button
        v-for="category in categories"
        :key="category.name"
        class="category-item"
        :class="{ active: selectedCategory === category.name }"
        @click="selectCategory(category.name)"
      >
        <span class="category-name">{{ category.name }}</span>
        <span class="category-count">{{ category.count }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CategoryInfo } from '../../../../scripts/generate-index'

const props = defineProps<{
  categories: CategoryInfo[]
  totalCourses: number
}>()

const emit = defineEmits<{
  'category-change': [category: string | null]
}>()

const selectedCategory = ref<string | null>(null)

function selectCategory(category: string | null) {
  selectedCategory.value = category
  emit('category-change', category)
}
</script>

<style scoped>
.category-nav {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.category-nav-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.category-item:hover {
  background: var(--category-hover);
  border-color: var(--vp-c-brand-light);
  transform: translateY(-2px);
}

.category-item.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
}

.category-item.active .category-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.category-name {
  font-weight: 500;
}

.category-count {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 1.5rem;
  text-align: center;
}

@media (max-width: 768px) {
  .category-nav {
    padding: 1rem;
  }
  
  .category-list {
    gap: 0.5rem;
  }
  
  .category-item {
    padding: 0.4rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
