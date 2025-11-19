---
title: Docker 容器化技术
category: 运维开发
tags: [Docker, 容器, DevOps, 部署]
description: 掌握Docker容器化技术，实现应用快速部署
author: 王老师
date: 2024-01-25
theme: default
highlighter: shiki
drawings: true
---

# Docker 容器化技术

现代应用部署的最佳实践

<div class="pt-12">
  <span class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    👨‍💻 王老师 · 运维开发教研室
  </span>
</div>

---

# 课程大纲

- 🐳 Docker 简介
- 📦 镜像与容器
- 🔧 Dockerfile 编写
- 🌐 Docker Compose
- 🚀 容器编排
- 📊 监控与日志

---

# Docker 简介

Docker 是一个开源的容器化平台

- **轻量级** - 比虚拟机更高效
- **可移植** - 一次构建，到处运行
- **隔离性** - 应用之间互不干扰
- **版本控制** - 镜像可以版本化管理

---

# Dockerfile 示例

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

---

# 谢谢观看

<div class="text-center">
  <a href="/" class="text-xl">
    ← 返回课程门户
  </a>
</div>
