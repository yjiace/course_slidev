# 软件学院现代化课件系统

基于 VitePress + Slidev 的混合架构课件系统，为软件学院提供现代化的课堂演讲和课程管理解决方案。

## ✨ 特性

- 📚 **课程门户** - 自动扫描和展示所有课程
- 🎯 **演讲课件** - Slidev 构建的现代化幻灯片
- 🔍 **智能搜索** - 支持课程标题、描述、标签的全文搜索
- 🏷️ **分类标签** - 按教研室分类和标签组织课程
- ⚡ **增量构建** - 智能检测变更，减少构建时间
- 🚀 **自动部署** - GitHub Actions 自动构建和部署
- 🎨 **响应式设计** - 适配各种屏幕尺寸

## 📦 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 一键启动

```bash
npm start
```

访问 http://localhost:4173，查看课程门户并点击课程进入演讲模式。

## 🔧 开发模式

### 开发门户界面

```bash
npm run dev
```

访问 http://localhost:5173（注意：课程链接会 404，需要构建后才能访问）

### 开发课程内容（实时预览）

```bash
# 在门户中点击"💻 开发预览"按钮，复制命令运行
# 或手动运行：
npx slidev courses/frontend/vue-basics/slides.md
```

编辑 `slides.md` 文件，Slidev 会自动热重载。

## 📝 创建课程

### 1. 创建课程目录

```bash
mkdir -p courses/frontend/my-course
```

### 2. 创建 slides.md

```markdown
---
title: 我的课程
category: 前端开发
tags: [JavaScript, Vue]
description: 课程描述
author: 你的名字
date: 2024-01-20
---

# 我的课程

课程内容...

---

# 第二页

更多内容...
```

### 3. 预览课程

```bash
npx slidev courses/frontend/my-course/slides.md
```

课程会自动出现在门户列表中！

## 📦 构建和部署

### 本地构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 部署到 EdgeOne

推送代码到 GitHub，EdgeOne 会自动拉取、构建和部署。

详见 [部署指南](docs/deployment-guide.md)

## 📖 文档

- [使用指南](USAGE.md) - 详细的使用说明
- [课程创建指南](docs/course-guide.md) - 如何创建课程
- [部署配置指南](docs/deployment-guide.md) - 如何部署

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
