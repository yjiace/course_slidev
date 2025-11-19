---
title: Node.js 入门教程
category: 后端开发
tags: [Node.js, JavaScript, 服务器, API]
description: 学习使用Node.js构建服务器端应用程序
author: 李老师
date: 2024-01-20
theme: default
highlighter: shiki
drawings: true
---

# Node.js 入门教程

构建高性能服务器端应用

<div class="pt-12">
  <span class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    👨‍💻 李老师 · 后端开发教研室
  </span>
</div>

---

# 课程内容

- 🌐 Node.js 简介
- 📦 NPM 包管理
- 🔧 Express 框架
- 🗄️ 数据库集成
- 🔐 身份认证
- 🚀 部署上线

---

# Node.js 简介

Node.js 是基于Chrome V8引擎的JavaScript运行时

- **事件驱动** - 非阻塞I/O模型
- **高性能** - 适合I/O密集型应用
- **跨平台** - 支持Windows、Linux、macOS
- **生态丰富** - NPM拥有海量包

---

# Express 快速开始

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'Hello Node.js!' })
})

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000')
})
```

---

# 谢谢观看

<div class="text-center">
  <a href="/" class="text-xl">
    ← 返回课程门户
  </a>
</div>
