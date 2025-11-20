# 快速开始指南

本指南帮助你快速了解如何使用本课件系统。

## 🚀 5 分钟快速上手

### 1. 克隆并安装

```bash
git clone <your-repo-url>
cd courseware-system
npm install
```

### 2. 本地开发

```bash
# 启动开发服务器
npm run dev

# 在浏览器中访问 http://localhost:5173
```

### 3. 创建新课程

```bash
# 创建课程目录
mkdir -p courses/frontend/my-course

# 创建课程文件
# 在 courses/frontend/my-course/slides.md 中编写课程内容
```

**最小课程模板**：

```markdown
---
title: 我的课程
category: 前端开发
tags: [JavaScript, Vue]
description: 课程简介
---

# 我的课程

课程内容...

---

# 第二页

更多内容...
```

### 4. 预览课程

```bash
# 预览单个课程
npx slidev courses/frontend/my-course/slides.md
```

### 5. 推送到 GitHub

```bash
git add .
git commit -m "Add new course"
git push origin main
```

GitHub Actions 会自动构建并部署！

## 📚 常用操作

### 开发课程

```bash
# 终端 1：启动门户
npm run dev

# 终端 2：预览课程
npx slidev courses/frontend/my-course/slides.md
```

### 构建和预览

```bash
# 智能构建（推荐）
npm run build:smart

# 预览构建结果
npm run preview
```

### 推送前测试

```bash
# 完整测试构建
npm run build:test

# 如果测试通过，推送代码
git push origin main
```

## 🎯 核心概念

### 智能构建

系统会自动检测你的变更：

- **只修改课程** → 增量构建（30-60秒）
- **修改门户或脚本** → 完整构建（3-5分钟）
- **无相关变更** → 仅构建门户（<30秒）

### 自动部署

推送到 `main` 分支后：

1. GitHub Actions 自动构建
2. 生成 PDF 和 MD 导出文件
3. 推送到 gh-pages 分支
4. EdgeOne 自动部署到生产环境

整个过程约 3-5 分钟。

## 📖 课程元数据

### 必填字段

```yaml
---
title: 课程标题          # 必填
category: 课程分类      # 必填（前端开发、后端开发等）
tags: [标签1, 标签2]    # 必填
description: 课程描述   # 必填
---
```

### 可选字段

```yaml
author: 张老师          # 作者
date: 2024-01-20       # 日期
level: beginner        # 难度（beginner/intermediate/advanced/expert）
duration: 8            # 课时数
cover: cover.jpg       # 封面图片
```

## 🔧 故障排除

### 课程不显示？

1. 检查文件名是否为 `slides.md`
2. 检查元数据是否包含所有必填字段
3. 重启开发服务器

### 构建失败？

```bash
# 清除缓存
rm -rf .buildcache dist

# 重新构建
npm run build
```

### PDF 生成失败？

```bash
# 安装 Playwright
npx playwright install chromium

# 重新构建
npm run build
```

## 📞 获取帮助

- **详细文档**：查看 [README.md](./README.md)
- **部署指南**：查看 [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Slidev 语法**：访问 [Slidev 官方文档](https://sli.dev/)

## 🎓 下一步

- 📖 阅读完整的 [README.md](./README.md)
- 🚀 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解部署流程
- 🎨 自定义门户主题（`portal/.vitepress/theme/`）
- 📦 添加更多课程

---

**提示**：大多数情况下，你只需要：
1. 编辑课程文件
2. `git push`
3. 等待自动部署完成

就这么简单！🎉
