<template>
  <div class="tag-cloud">
    <h3 class="tag-cloud-title">🏷️ 热门标签</h3>
    
    <div class="tag-list">
      <button
        v-for="tag in sortedTags"
        :key="tag.name"
        class="tag-item"
        :class="{ active: selectedTag === tag.name }"
        :style="{ fontSize: getTagSize(tag.count) }"
        @click="selectTag(tag.name)"
      >
        {{ tag.name }}
        <span class="tag-count">({{ tag.count }})</span>
      </button>
    </div>
    
    <button
      v-if="selectedTag"
      class="clear-tag"
      @click="clearTag"
    >
      ✕ 清除筛选
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TagInfo } from '../../../../scripts/generate-index'

const props = defineProps<{
  tags: TagInfo[]
}>()

const emit = defineEmits<{
  'tag-change': [tag: string | null]
}>()

const selectedTag = ref<string | null>(null)

// 按使用频率排序标签
const sortedTags = computed(() => {
  return [...props.tags].sort((a, b) => b.count - a.count)
})

// 计算标签字体大小（基于使用频率）
function getTagSize(count: number): string {
  const maxCount = Math.max(...props.tags.map(t => t.count))
  const minCount = Math.min(...props.tags.map(t => t.count))
  
  // 字体大小范围：0.875rem - 1.5rem
  const minSize = 0.875
  const maxSize = 1.5
  
  if (maxCount === minCount) {
    return `${minSize}rem`
  }
  
  const ratio = (count - minCount) / (maxCount - minCount)
  const size = minSize + ratio * (maxSize - minSize)
  
  return `${size.toFixed(3)}rem`
}

function selectTag(tag: string) {
  if (selectedTag.value === tag) {
    clearTag()
  } else {
    selectedTag.value = tag
    emit('tag-change', tag)
  }
}

function clearTag() {
  selectedTag.value = null
  emit('tag-change', null)
}
</script>

<style scoped>
.tag-cloud {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.tag-cloud-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.tag-item {
  background: var(--tag-bg);
  color: var(--tag-text);
  padding: 0.375rem 0.875rem;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  white-space: nowrap;
}

.tag-item:hover {
  background: var(--vp-c-brand-light);
  color: white;
  transform: scale(1.05);
}

.tag-item.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand-dark);
}

.tag-count {
  font-size: 0.75em;
  opacity: 0.8;
  margin-left: 0.25rem;
}

.clear-tag {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-dark);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.clear-tag:hover {
  background: var(--vp-c-danger);
  color: white;
}

@media (max-width: 768px) {
  .tag-cloud {
    padding: 1rem;
  }
  
  .tag-list {
    gap: 0.5rem;
  }
  
  .tag-item {
    padding: 0.3rem 0.7rem;
  }
}
</style>
