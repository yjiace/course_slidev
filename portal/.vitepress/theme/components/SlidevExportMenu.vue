<template>
  <div class="slidev-export-menu">
    <!-- 导出按钮 -->
    <button
      @click="showFormatSelector = true"
      class="export-trigger-button fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      title="下载课件"
    >
      <span class="material-symbols-outlined">download</span>
      <span class="text-sm font-medium">下载</span>
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
import { ref, onMounted } from 'vue'
import ExportFormatSelector from './ExportFormatSelector.vue'

const showFormatSelector = ref(false)
const selectedFormat = ref<string>('')

// 从 URL 获取课程信息
const courseInfo = ref({
  courseId: '',
  coursePath: '',
  courseTitle: ''
})

onMounted(() => {
  // 从 URL 路径推断课程信息
  const path = window.location.pathname
  const match = path.match(/\/courses\/(.+)\/$/)
  
  if (match) {
    const coursePath = match[1]
    courseInfo.value = {
      courseId: coursePath.replace(/\//g, '-'),
      coursePath: `${coursePath}/slides.md`,
      courseTitle: document.title || '课件'
    }
  }
})

async function handleFormatSelect(format: string) {
  selectedFormat.value = format
  showFormatSelector.value = false
  
  // 直接下载预生成的文件
  downloadPrebuiltFile(format)
}

function downloadPrebuiltFile(format: string) {
  // 构建文件路径（服务器上的文件名使用 courseId）
  const serverFilename = `${courseInfo.value.courseId}.${format}`
  const downloadUrl = `/exports/${serverFilename}`
  
  // 下载时使用课程标题作为文件名
  const downloadFilename = `${courseInfo.value.courseTitle}.${format}`
  
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
.export-trigger-button {
  font-family: 'Inter', sans-serif;
}
</style>
