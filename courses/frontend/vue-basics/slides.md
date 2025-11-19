---
title: Vue.js 基础教程
category: 前端开发
tags: [Vue, JavaScript, 组件化, 响应式]
description: 从零开始学习Vue.js框架，掌握现代前端开发技术
author: 张老师
date: 2024-01-15
theme: default
highlighter: shiki
drawings: true
---

# Vue.js 基础教程

从零开始学习Vue.js框架

<div class="pt-12">
  <span class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    👨‍💻 张老师 · 前端开发教研室
  </span>
</div>

---

# 课程大纲

- 📝 Vue.js 简介
- 🎯 响应式数据绑定
- 🧩 组件化开发
- 🔄 生命周期钩子
- 🎨 模板语法
- 🚀 实战项目

---

# Vue.js 简介

Vue.js 是一个渐进式JavaScript框架

- **易学易用** - 简单的API设计
- **灵活渐进** - 可以逐步集成到项目中
- **高性能** - 虚拟DOM和优化的渲染
- **生态丰富** - Vue Router、Vuex、Vite等

---

# 响应式数据绑定

```vue
<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="updateMessage">更新消息</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello Vue!')

function updateMessage() {
  message.value = 'Vue is awesome!'
}
</script>
```

---

# 谢谢观看

<div class="text-center">
  <a href="/" class="text-xl">
    ← 返回课程门户
  </a>
</div>
