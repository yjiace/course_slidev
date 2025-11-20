<template>
  <Teleport to="body">
    <div 
      v-if="visible" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div 
        class="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
      >
        <!-- 处理中状态 -->
        <div v-if="status === 'pending' || status === 'processing'" class="text-center">
          <div class="mb-4">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
          <h3 class="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
            {{ getStatusMessage() }}
          </h3>
          <p class="text-sm text-text-light/60 dark:text-text-dark/60 mb-4">
            {{ message || '请稍候，这可能需要一些时间...' }}
          </p>
          <button
            v-if="showCancel"
            @click="$emit('cancel')"
            class="px-4 py-2 text-sm text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark transition-colors"
          >
            取消
          </button>
        </div>

        <!-- 完成状态 -->
        <div v-else-if="status === 'complete'" class="text-center">
          <div class="mb-4">
            <span class="text-6xl">✅</span>
          </div>
          <h3 class="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
            导出成功
          </h3>
          <p class="text-sm text-text-light/60 dark:text-text-dark/60 mb-4">
            {{ message || '文件已准备好下载' }}
          </p>
          <button
            @click="$emit('close')"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            关闭
          </button>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="status === 'error'" class="text-center">
          <div class="mb-4">
            <span class="text-6xl">❌</span>
          </div>
          <h3 class="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
            导出失败
          </h3>
          <p class="text-sm text-text-light/60 dark:text-text-dark/60 mb-4">
            {{ message || '导出过程中发生错误，请稍后重试' }}
          </p>
          <div class="flex gap-2 justify-center">
            <button
              @click="$emit('retry')"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              重试
            </button>
            <button
              @click="$emit('close')"
              class="px-6 py-2 border border-border-light dark:border-border-dark text-text-light dark:text-text-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible: boolean
  format?: string
  status: 'pending' | 'processing' | 'complete' | 'error'
  message?: string
  showCancel?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'cancel'): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  showCancel: true
})

const emit = defineEmits<Emits>()

const formatLabels: Record<string, string> = {
  pdf: 'PDF',
  pptx: 'PowerPoint',
  png: 'PNG',
  md: 'Markdown'
}

function getStatusMessage() {
  if (props.status === 'pending') {
    return '准备导出...'
  }
  
  if (props.status === 'processing' && props.format) {
    const formatLabel = formatLabels[props.format] || props.format.toUpperCase()
    return `正在生成 ${formatLabel}...`
  }
  
  return '正在处理...'
}
</script>
