# 使用指南

## 🚀 快速开始

### 一键启动

```bash
npm start
```

这个命令会自动构建所有内容并启动预览服务器。

访问 http://localhost:4173

## 📝 开发工作流

### 场景1：开发课程内容

编辑课程并实时预览：

```bash
# 终端1：启动门户（查看课程列表）
npm run dev

# 终端2：启动课程实时预览
npx slidev courses/frontend/vue-basics/slides.md
```

- 门户：http://localhost:5173
- 课程：http://localhost:3030

**提示**：在门户中点击"💻 开发预览"按钮可以复制对应课程的命令。

### 场景2：开发门户界面

修改门户组件、样式：

```bash
npm run dev
```

访问 http://localhost:5173

### 场景3：测试完整系统

测试从门户点击进入课程的完整流程：

```bash
npm start
```

## 📚 创建新课程

### 1. 创建课程目录和文件

```bash
mkdir -p courses/frontend/my-new-course
cd courses/frontend/my-new-course
```

### 2. 创建 slides.md

```markdown
---
title: 我的新课程
category: 前端开发
tags: [JavaScript, Vue, 入门]
description: 这是一个新课程的描述
author: 你的名字
date: 2024-01-20
---

# 我的新课程

欢迎来到新课程！

---

# 第二页

课程内容...
```

### 3. 预览课程

```bash
npx slidev courses/frontend/my-new-course/slides.md
```

### 4. 查看门户

刷新门户页面，新课程会自动出现！

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm start` | 构建并预览完整系统 |
| `npm run dev` | 开发门户界面 |
| `npm run build` | 构建所有内容 |
| `npm run preview` | 预览构建结果 |
| `npx slidev <path>` | 实时预览课程 |

## 💡 开发技巧

### 快速预览课程

在门户中点击"💻 开发预览"按钮，自动复制 Slidev 命令到剪贴板。

### 增量构建

系统会自动检测文件变更，只构建修改过的课程。

### 清除缓存

如果遇到缓存问题：

```bash
# Windows
rmdir /s /q .buildcache
rmdir /s /q dist

# Linux/Mac
rm -rf .buildcache dist

# 重新构建
npm run build
```

## 🐛 常见问题

### Q: 门户显示课程，但点击后 404？

A: 需要先构建课程。运行 `npm start`

### Q: 修改课程后没有更新？

A: 
- 开发模式：Slidev 会自动热重载
- 预览模式：需要重新运行 `npm run build`

### Q: 如何同时开发多个课程？

A: 在不同终端启动多个 Slidev 实例：

```bash
# 终端1
npx slidev courses/frontend/vue-basics/slides.md --port 3030

# 终端2
npx slidev courses/backend/nodejs-intro/slides.md --port 3031
```

### Q: 构建很慢怎么办？

A: 系统已实现增量构建，只会构建修改过的课程。第一次构建会比较慢，后续构建会快很多。

## 🎓 最佳实践

1. **日常开发**：使用 `npm run dev` + `npx slidev` 组合
2. **测试验证**：使用 `npm start` 测试完整流程
3. **提交前**：运行 `npm run build` 确保构建成功
4. **课程元数据**：确保填写完整的 frontmatter
5. **命名规范**：使用小写字母和连字符命名课程目录（如 `vue-basics`）
