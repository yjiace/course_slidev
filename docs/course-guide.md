# 课程创建指南

本指南将帮助你创建和管理 Slidev 课程。

## 创建新课程

### 1. 创建课程目录

在 `courses` 目录下按照教研室分类创建课程目录：

```
courses/
├── frontend/          # 前端开发教研室
│   └── vue-basics/   # Vue.js 基础课程
│       └── slides.md
├── backend/          # 后端开发教研室
│   └── nodejs-intro/ # Node.js 入门课程
│       └── slides.md
└── devops/           # 运维开发教研室
    └── docker-basics/# Docker 基础课程
        └── slides.md
```

### 2. 编写课程元数据

在 `slides.md` 文件开头添加 frontmatter 元数据：

```yaml
---
title: 课程标题（必填）
category: 教研室名称（必填）
tags: [标签1, 标签2]（必填）
description: 课程描述（必填）
author: 作者姓名（可选）
date: 2024-01-15（可选）
theme: default（可选）
highlighter: shiki（可选）
drawings: true（可选）
---
```

### 3. 编写课程内容

使用 Markdown 和 Slidev 语法编写幻灯片内容：

```markdown
# 第一页标题

内容...

---

# 第二页标题

内容...
```

### 4. 预览课程

```bash
npx slidev courses/教研室/课程名称/slides.md
```

## 课程元数据说明

### 必填字段

- `title`: 课程标题，显示在门户卡片上
- `category`: 教研室分类，用于分组展示
- `tags`: 标签数组，用于筛选和搜索
- `description`: 课程描述，显示在卡片上

### 可选字段

- `author`: 作者姓名，默认为"未知作者"
- `date`: 创建日期，默认为当前日期
- `theme`: Slidev 主题，默认为 default
- `highlighter`: 代码高亮器，默认为 shiki
- `drawings`: 是否启用绘图工具，默认为 true

## Slidev 语法参考

详见 [Slidev 官方文档](https://sli.dev/)

## 常见问题

### 课程没有出现在门户中？

1. 检查 `slides.md` 文件名是否正确
2. 检查元数据是否包含所有必填字段
3. 重启开发服务器

### 如何添加代码高亮？

使用代码块语法并指定语言：

\`\`\`javascript
const message = 'Hello World'
console.log(message)
\`\`\`
