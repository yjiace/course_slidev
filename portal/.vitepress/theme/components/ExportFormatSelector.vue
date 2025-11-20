<template>
  <Teleport to="body">
    <div 
      v-if="visible" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click="handleClose"
    >
      <div 
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            选择导出格式
          </h3>
          <button
            @click="handleClose"
            class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="space-y-2">
          <button
            v-for="format in formats"
            :key="format.value"
            @click="handleSelect(format.value)"
            class="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
          >
            <span class="text-2xl">{{ format.icon }}</span>
            <div class="flex-1">
              <div class="font-medium text-gray-900 dark:text-gray-100">
                {{ format.label }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ format.description }}
              </div>
            </div>
            <span class="material-symbols-outlined text-gray-400 dark:text-gray-500">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'select', format: string): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formats = computed(() => [
  {
    value: 'pdf',
    label: 'PDF 文档',
    icon: '📄',
    description: '适合打印和分享的通用格式'
  },
  {
    value: 'md',
    label: 'Markdown 源文件',
    icon: '📝',
    description: '原始 Markdown 格式'
  }
])

function handleSelect(format: string) {
  emit('select', format)
}

function handleClose() {
  emit('close')
}
</script>
