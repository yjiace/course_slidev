<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  title?: string
}>()

const isOpen = ref(false)
const isVisible = ref(false)
const scale = ref(1)
const minScale = 0.3
const maxScale = 3

// 按钮位置（动态计算）
const buttonRight = ref('32px')

// 计算按钮位置：基于 VitePress 内容区域
const calculateButtonPosition = () => {
  // 查找 VitePress 内容区域
  const contentEl = document.querySelector('.VPDoc .content-container') as HTMLElement
  if (contentEl) {
    const rect = contentEl.getBoundingClientRect()
    // 按钮应该在内容区域右边缘内侧
    const rightOffset = window.innerWidth - rect.right
    buttonRight.value = `${Math.max(32, rightOffset)}px`
  } else {
    // 如果找不到内容区域，使用默认值
    buttonRight.value = '32px'
  }
}

// 打开弹框
const openModal = () => {
  isOpen.value = true
  scale.value = 1 // 重置缩放
  // 延迟添加 visible 类，触发动画
  setTimeout(() => {
    isVisible.value = true
  }, 10)
}

// 关闭弹框
const closeModal = () => {
  isVisible.value = false
  // 等待动画完成后再关闭
  setTimeout(() => {
    isOpen.value = false
  }, 300)
}

// 缩放控制
const zoomIn = () => {
  scale.value = Math.min(maxScale, scale.value + 0.2)
}

const zoomOut = () => {
  scale.value = Math.max(minScale, scale.value - 0.2)
}

const resetZoom = () => {
  scale.value = 1
}

// 滚轮缩放
const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }
}

// ESC 键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', calculateButtonPosition)
  // 初始计算位置
  calculateButtonPosition()
  // 延迟再次计算，确保 DOM 完全渲染
  setTimeout(calculateButtonPosition, 500)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', calculateButtonPosition)
})
</script>

<template>
  <div class="mindmap-float-container">
    <!-- 浮动按钮 -->
    <button 
      class="mindmap-float-btn"
      :style="{ right: buttonRight }"
      @click="openModal"
      :title="title || '查看思维导图'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <circle cx="4" cy="6" r="2"></circle>
        <circle cx="20" cy="6" r="2"></circle>
        <circle cx="4" cy="18" r="2"></circle>
        <circle cx="20" cy="18" r="2"></circle>
        <line x1="9.5" y1="10" x2="5.5" y2="7"></line>
        <line x1="14.5" y1="10" x2="18.5" y2="7"></line>
        <line x1="9.5" y1="14" x2="5.5" y2="17"></line>
        <line x1="14.5" y1="14" x2="18.5" y2="17"></line>
      </svg>
    </button>

    <!-- 弹框遮罩 -->
    <Teleport to="body">
      <div 
        v-if="isOpen"
        class="mindmap-modal-overlay"
        :class="{ visible: isVisible }"
        @click.self="closeModal"
      >
        <!-- 弹框内容 -->
        <div class="mindmap-modal">
          <div class="modal-header">
            <h3>{{ title || '📋 文档结构思维导图' }}</h3>
            <div class="header-actions">
              <!-- 缩放控制 -->
              <div class="zoom-controls">
                <button class="zoom-btn" @click="zoomOut" title="缩小" :disabled="scale <= minScale">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>
                <span class="zoom-value" @click="resetZoom" title="点击重置">{{ Math.round(scale * 100) }}%</span>
                <button class="zoom-btn" @click="zoomIn" title="放大" :disabled="scale >= maxScale">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>
              </div>
              <button class="close-btn" @click="closeModal" title="关闭 (ESC)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <div class="modal-body" @wheel="handleWheel">
            <div class="mindmap-content" :style="{ transform: `scale(${scale})` }">
              <slot></slot>
            </div>
          </div>
          <div class="modal-footer">
            <span class="hint">按住 Ctrl + 滚轮缩放 · 按 ESC 键或点击外部关闭</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* 浮动按钮 - 定位在文章内容区域的右下角 */
.mindmap-float-btn {
  position: fixed;
  /* right 值通过 JavaScript 动态计算 */
  right: 32px; /* 默认值，会被 JS 覆盖 */
  bottom: 32px;
  z-index: 100;
  
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  
  cursor: pointer;
  transition: all 0.3s ease;
}

.mindmap-float-btn:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.mindmap-float-btn:active {
  transform: translateY(0) scale(1);
}

.mindmap-float-btn svg {
  flex-shrink: 0;
}

/* 响应式：小屏幕 */
@media (max-width: 768px) {
  .mindmap-float-btn {
    right: 16px !important; /* 小屏幕强制使用固定位置 */
    bottom: 80px;
    width: 40px;
    height: 40px;
  }
  
  .mindmap-float-btn svg {
    width: 18px;
    height: 18px;
  }
}

/* 弹框遮罩 */
.mindmap-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
  
  transition: all 0.3s ease;
}

.mindmap-modal-overlay.visible {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* 弹框内容 */
.mindmap-modal {
  width: 90%;
  max-width: 1200px;
  max-height: 85vh;
  
  background: var(--vp-c-bg);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  display: flex;
  flex-direction: column;
  
  opacity: 0;
  transform: scale(0.9) translateY(20px);
  transition: all 0.3s ease;
}

.mindmap-modal-overlay.visible .mindmap-modal {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* 弹框头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 缩放控制 */
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-btn:hover:not(:disabled) {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-value {
  min-width: 48px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s ease;
}

.zoom-value:hover {
  color: var(--vp-c-brand-1);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* 弹框内容 */
.modal-body {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

/* 思维导图内容容器 */
.mindmap-content {
  transform-origin: center top;
  transition: transform 0.2s ease;
  will-change: transform;
}

/* Mermaid 图表样式覆盖 */
.mindmap-content :deep(.mermaid) {
  display: flex;
  justify-content: center;
}

.mindmap-content :deep(svg) {
  max-width: none;
  height: auto;
}

/* 弹框底部 */
.modal-footer {
  padding: 12px 24px;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

/* 暗色模式适配 */
.dark .mindmap-modal {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
