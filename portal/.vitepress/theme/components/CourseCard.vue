<template>
  <a 
    :href="course.slideUrl" 
    target="_blank"
    rel="noopener noreferrer"
    class="flex cursor-pointer flex-col gap-3 rounded-xl border border-solid border-transparent bg-card-light p-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 dark:bg-card-dark dark:hover:border-primary/50"
  >
    <div 
      class="aspect-video w-full rounded-lg bg-cover bg-center bg-no-repeat"
      :style="getCoverStyle()"
      @error="onImageError"
    ></div>
    <div class="flex flex-1 flex-col">
      <p class="text-base font-semibold leading-normal">{{ course.title }}</p>
      <p class="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-300">{{ course.description }}</p>
    </div>
    <div class="mt-2 flex flex-wrap gap-1">
      <span :class="getCategoryClass()">{{ course.category }}</span>
      <span 
        v-for="(tag, index) in course.tags.slice(0, 3)" 
        :key="tag"
        :class="getTagClass(index)"
      >
        {{ tag }}
      </span>
    </div>
  </a>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Course } from '../../../../scripts/scan-courses'

const props = defineProps<{
  course: Course
}>()

const imageError = ref(false)

// 分类到颜色的映射
const categoryColors: Record<string, string> = {
  '前端开发': 'inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  '后端开发': 'inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200',
  '运维开发': 'inline-block rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  '数据结构': 'inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200',
  '计算机基础': 'inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  '人工智能': 'inline-block rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200',
}

// 标签颜色数组（多色）
const tagColors = [
  'inline-block rounded bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'inline-block rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'inline-block rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  'inline-block rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'inline-block rounded bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
]

function getCategoryClass() {
  return categoryColors[props.course.category] || 'inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

function getTagClass(index: number) {
  return tagColors[index % tagColors.length]
}

function getCoverStyle() {
  if (imageError.value) {
    // 使用渐变背景作为备用
    return {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  }
  
  // 使用默认的占位图片或课程封面
  const defaultImages: Record<string, string> = {
    '前端': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRSEXY--Hk7J2XlV4dBEpAfn3UCQekdd7xQnNeo1SR7BAjxEAfmxNCZjLrFm9usH_TVvDtKze4AqbOa2Q3-LFxAn6jvdWGuK5R8yRNiVJWev8Zxb1aUUTKQJ-uypQFJccGHKuOuIJnDkNLO24BAHBa_y2cy9qosL2TZMQBjSLqP5tRnY_gPc25WzhB3U7YXQWDOdHF5VBd4DqyQ0bQHysZHY2urj8Sie_2YuBaJEumg5yWzMdsebnYoDbSeIzCr2PMKJb5M7_f0HI',
    '数据结构': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg70SJZt7wjRqDRaXoPDQmZUI0OXc2ZD4NlzDAHVEYXMp6Nweh1_2RPtEcqUimQM8mUlopiK_jdL_OP_w1lYWqBipZb_XGQkWfUUdgMOeBDIQEi_97A8IwX-f1EKZb4ZaGIwDK13mGaTNnIWZUK6fxSF0vA7ee9zJCnRnd4CMxGU60EmmVYhc61R09mR0VlPwPEIB7n6yMen-o3SlBUz-ixCXrYJZHutrt9-YFcK3f1S-_qDiW4fT6MtbAwTlKAomGlfMjrYzQnBU',
    '后端': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuV5CHD57Gp-9tG4WyPkAqbzMojatT8xDnCH0CzK9-RvdCWvdRx9yYqaAsywJPCd8IrR4uw-maRQVxk84ARzW9Z-P5VJnG1PvuvYPoM9fHSc3s04KX60rzwUpc1RWxpCqd576F7ERUD7ca87MM040jGmabXZxaUhj1hNjNXUo8-yE6JCAI0IDlVHqT4yvha5ZV62kq9cAK8iHsc5l8iYtahOHouhdNxB59WqKC764rvABRd0rRna7G6HOuzVsD0MZcILyW4232T9E',
    '计算机基础': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEJaobfqb5gaGY-IQoPHdWPKbdn9bgaf5CCROx3s5yyieX9xXdqZ4FKmCHxRavtW6n6ls03RQyVQ9B-4KlYilRzLHGJ8l66c4r8aJq_jOzN2PDsX804ElcCKYsEu40X2t-A1E0Uf-4kzC0AD90nvtYjYoc44rkvTJgp8GroC9DgCe6K0MHakJMRo2UorJWEc2RqCXRRORGevMVtgc0QXyg0BWjvv6dia31dPTUm9TPEidpFiN1xxjcL3_mMdckcDbvImGNMaFWgEw',
    '人工智能': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4TnhrrWQ7z6SsV70vOVYk_5yS5jilZ2whlhXilx7Hy1ayM2q4kfpZo4EEMY3tqg8CtblKO11cFZzZn1jb665W-mbmZtq2Jjtd4xV5nD2xfrB3fb0yu91X0oJvpn42ylUiCsPaQKL-a6RJtm1E71TbjZThPsZUuXtjslfo6Pue-6KlMIwOlwqh0SEz8fKb7Y1SGQa2wM8TBXxlioQivFa_ZzJKVzysSE2SZ7wErGEfFnM_ZynLVbkPdSXBa6DSm5n6iMZBdbI8Q5c',
  }
  
  const imageUrl = props.course.coverImage || defaultImages[props.course.category] || defaultImages['计算机基础']
  
  return {
    backgroundImage: `url("${imageUrl}")`,
    backgroundColor: '#e5e7eb'
  }
}

function onImageError() {
  imageError.value = true
}
</script>

