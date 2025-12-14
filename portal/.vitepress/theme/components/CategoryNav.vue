<template>
  <div class="category-nav">
    <div class="category-list">
      <button
        class="category-item"
        :class="{ active: selectedCategory === null }"
        @click="selectCategory(null)"
      >
        全部
      </button>
      
      <button
        v-for="category in categories"
        :key="category.name"
        class="category-item"
        :class="{ active: selectedCategory === category.name }"
        @click="selectCategory(category.name)"
      >
        {{ category.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CategoryInfo } from '../../data/courses.data'

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
  margin-top: 1.5rem;
  margin-bottom: 2rem;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-item {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.category-item:hover {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand);
  transform: translateY(-1px);
}

.category-item.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
}

@media (max-width: 768px) {
  .category-nav {
    margin-top: 1rem;
  }
  
  .category-list {
    gap: 0.375rem;
  }
  
  .category-item {
    padding: 0.4rem 0.875rem;
    font-size: 0.875rem;
  }
}
</style>
