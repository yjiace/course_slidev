<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索课程标题、描述、标签..."
        @input="onSearchInput"
      />
      <button
        v-if="searchQuery"
        class="clear-button"
        @click="clearSearch"
      >
        ✕
      </button>
    </div>
    
    <div v-if="searchQuery && searchResults.length === 0" class="search-no-results">
      未找到匹配的课程
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Course } from '../../../../scripts/scan-courses'

const props = defineProps<{
  courses: Course[]
}>()

const emit = defineEmits<{
  'search': [query: string]
}>()

const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// 搜索结果
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.courses
  }
  
  const query = searchQuery.value.toLowerCase()
  
  return props.courses.filter(course => {
    return (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.tags.some(tag => tag.toLowerCase().includes(query)) ||
      course.author.toLowerCase().includes(query)
    )
  })
})

// 防抖搜索
function onSearchInput() {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    emit('search', searchQuery.value)
  }, 300)
}

function clearSearch() {
  searchQuery.value = ''
  emit('search', '')
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 2rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
}

.search-input-wrapper:focus-within {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.search-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  padding: 0;
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.clear-button {
  background: var(--vp-c-bg-mute);
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.clear-button:hover {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-dark);
}

.search-no-results {
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .search-input-wrapper {
    padding: 0.6rem 0.875rem;
  }
  
  .search-input {
    font-size: 0.9rem;
  }
}
</style>
