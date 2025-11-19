<template>
  <div class="course-card">
    <div class="course-card-header">
      <h3 class="course-title">{{ course.title }}</h3>
      <span class="course-category">{{ course.category }}</span>
    </div>
    
    <p class="course-description">{{ course.description }}</p>
    
    <div class="course-meta">
      <span class="course-author">👤 {{ course.author }}</span>
      <span class="course-date">📅 {{ course.date }}</span>
    </div>
    
    <div class="course-tags">
      <span 
        v-for="tag in course.tags" 
        :key="tag" 
        class="course-tag"
        @click="$emit('tag-click', tag)"
      >
        {{ tag }}
      </span>
    </div>
    
    <div class="course-actions">
      <a 
        :href="course.slideUrl" 
        target="_blank" 
        class="btn btn-primary"
        rel="noopener noreferrer"
        title="需要先构建课程（npm run build）"
      >
        🎯 进入演讲模式
      </a>
      <button 
        class="btn btn-secondary"
        @click="copyDevCommand"
        title="复制 Slidev 开发命令"
      >
        💻 开发预览
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from '../../../../scripts/scan-courses'

const props = defineProps<{
  course: Course
}>()

defineEmits<{
  'tag-click': [tag: string]
}>()

function copyDevCommand() {
  const command = `npx slidev ${props.course.path}`
  
  // 复制到剪贴板
  if (navigator.clipboard) {
    navigator.clipboard.writeText(command).then(() => {
      alert(`已复制开发命令到剪贴板：\n\n${command}\n\n请在终端中运行此命令来预览课程`)
    }).catch(() => {
      alert(`开发命令：\n\n${command}\n\n请在终端中运行此命令来预览课程`)
    })
  } else {
    alert(`开发命令：\n\n${command}\n\n请在终端中运行此命令来预览课程`)
  }
}
</script>

<style scoped>
.course-card {
  background: var(--course-card-bg);
  border: 1px solid var(--course-card-border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.course-card:hover {
  background: var(--course-card-hover);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.course-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.course-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
  flex: 1;
  line-height: 1.4;
}

.course-category {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-dark);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.course-description {
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  flex: 1;
}

.course-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

.course-author,
.course-date {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.course-tag {
  background: var(--tag-bg);
  color: var(--tag-text);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.course-tag:hover {
  background: var(--vp-c-brand);
  color: white;
  transform: scale(1.05);
}

.course-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  white-space: nowrap;
}

.btn-primary {
  background: var(--vp-c-brand);
  color: white;
}

.btn-primary:hover {
  background: var(--vp-c-brand-dark);
  transform: scale(1.02);
}

.btn-secondary {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.btn-secondary:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

@media (max-width: 768px) {
  .course-card {
    padding: 1rem;
  }
  
  .course-title {
    font-size: 1.25rem;
  }
  
  .course-card-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .course-category {
    align-self: flex-start;
  }
  
  .course-actions {
    flex-direction: column;
  }
  
  .btn {
    font-size: 0.9rem;
    padding: 0.6rem 0.875rem;
  }
}
</style>
