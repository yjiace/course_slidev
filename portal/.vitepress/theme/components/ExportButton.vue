<template>
  <div class="export-button-container">
    <button
      @click.stop="handleClick"
      class="export-button rounded-full bg-white/60 hover:bg-white/80 dark:bg-gray-800/60 dark:hover:bg-gray-800/80 shadow-md hover:shadow-lg transition-all text-gray-700 dark:text-gray-200"
      title="下载课件"
    >
      <span class="material-symbols-outlined text-lg">download</span>
    </button>

    <!-- 格式选择器 -->
    <ExportFormatSelector
      :visible="showFormatSelector"
      @select="handleFormatSelect"
      @close="showFormatSelector = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ExportFormatSelector from './ExportFormatSelector.vue'

interface Props {
  courseId: string
  coursePath: string
  courseTitle: string
}

const props = defineProps<Props>()

const showFormatSelector = ref(false)
const selectedFormat = ref<string>('')

function handleClick(event: Event) {
  // 阻止事件冒泡，避免触发课程卡片的跳转
  event.stopPropagation()
  event.preventDefault()
  
  showFormatSelector.value = true
}

async function handleFormatSelect(format: string) {
  selectedFormat.value = format
  showFormatSelector.value = false
  
  // 直接下载预生成的文件
  downloadPrebuiltFile(format)
}

function downloadPrebuiltFile(format: string) {
  // 构建文件路径（服务器上的文件名使用 courseId）
  const serverFilename = `${props.courseId}.${format}`
  const downloadUrl = `/exports/${serverFilename}`
  
  // 下载时使用课程标题作为文件名
  const downloadFilename = `${props.courseTitle}.${format}`
  
  // 创建下载链接
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = downloadFilename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


</script>



<style scoped>
.export-button {
  border: none;
  cursor: pointer;
  backdrop-filter: blur(4px);
  /* 确保按钮是正圆形 */
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.export-button:active {
  transform: scale(0.95);
}
</style>
