# 软件学院现代化课件系统

基于 VitePress + Slidev 的混合架构课件系统，为软件学院提供现代化的课程门户和演讲课件。

## ✨ 特性

- 📚 **课程门户** - 自动扫描和展示所有课程
- 🎯 **演讲课件** - Slidev 构建的现代化幻灯片
- 📥 **课件导出** - 支持 PDF、PPTX、PNG、MD 多种格式导出
- 🔍 **智能搜索** - 支持课程标题、描述、标签的全文搜索
- 🏷️ **分类筛选** - 按教研室分类组织课程
- ⚡ **增量构建** - 智能检测变更，减少构建时间
- 🎨 **现代化设计** - 响应式布局，支持深色模式

---

## 📦 快速开始

### 安装依赖

```bash
npm install
```

### 查看完整系统

```bash
npm start
```

访问 http://localhost:4173 查看课程门户并点击课程进入演讲模式。

---

## 🔧 开发模式

### ⚠️ 重要说明

- **开发模式** (`npm run dev`) - 只启动门户，课程链接会404（正常现象）
- **完整模式** (`npm start`) - 构建所有课程后预览，所有功能正常

### 开发课程内容

```bash
# 终端1：启动门户
npm run dev

# 终端2：预览单个课程
npx slidev courses/frontend/vue-basics/slides.md
```

**注意**：开发模式下导出功能不可用，需要先构建才能测试下载功能。

- 门户地址：http://localhost:5173
- 课程地址：http://localhost:3030

### 开发门户界面

```bash
npm run dev
```

访问 http://localhost:5173

---

## 📝 创建新课程

### 1. 创建课程目录

在 `courses` 目录下按照教研室分类创建课程目录：

```bash
mkdir -p courses/frontend/vue-basics
```

支持的分类：
- `frontend` - 前端开发
- `backend` - 后端开发
- `devops` - 运维开发
- 其他：数据结构、计算机基础、人工智能

### 2. 创建 slides.md

在课程目录下创建 `slides.md` 文件：

```markdown
---
title: Vue.js 基础教程
category: 前端开发
tags: [Vue, JavaScript, 组件化]
description: 从零开始学习Vue.js框架
author: 张老师
date: 2024-01-15
level: beginner
duration: 8
cover: cover.jpg
---

# Vue.js 基础教程

从零开始学习Vue.js框架

---

# 课程大纲

- Vue.js 简介
- 响应式数据绑定
- 组件化开发
- 生命周期钩子

---

# 更多内容...
```

### 3. 预览课程

```bash
npx slidev courses/frontend/vue-basics/slides.md
```

访问 http://localhost:3030 查看课程。

### 4. 查看门户

启动门户后，新课程会自动出现在列表中：

```bash
npm run dev
```

访问 http://localhost:5173

---

## 📋 课程元数据说明

### 必填字段

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 课程标题 | `Vue.js 基础教程` |
| `category` | 课程分类 | `前端开发` |
| `tags` | 标签数组 | `[Vue, JavaScript]` |
| `description` | 课程描述 | `从零开始学习Vue.js` |

### 可选字段

| 字段 | 说明 | 默认值 | 示例 |
|------|------|--------|------|
| `author` | 作者姓名 | `未知作者` | `张老师` |
| `date` | 创建日期 | 当前日期 | `2024-01-15` |
| `level` | 难度级别 | `beginner` | `intermediate` |
| `duration` | 课时数 | 无 | `8` |
| `cover` | 封面图片 | 默认封面 | `cover.jpg` |

### 难度级别

- `beginner` - 初级（蓝色标签）
- `intermediate` - 中级（绿色标签）
- `advanced` - 高级（红色标签）
- `expert` - 专家（紫色标签）

---

## 🖼️ 添加封面图

### 1. 准备封面图片

- **推荐尺寸**：640x360 像素（16:9 比例）
- **支持格式**：JPG、PNG、SVG
- **文件大小**：建议小于 500KB

### 2. 放置封面图片

将封面图片放在课程目录下：

```
courses/frontend/vue-basics/
├── slides.md
└── cover.jpg        # 封面图片
```

### 3. 在元数据中引用

```yaml
---
title: Vue.js 基础教程
cover: cover.jpg     # 相对于课程目录的路径
---
```

### 4. 默认封面

如果不指定封面图，系统会根据课程分类自动使用默认封面：

- **前端开发** - 蓝色渐变
- **后端开发** - 绿色渐变
- **数据结构** - 橙色渐变
- **计算机基础** - 紫色渐变
- **人工智能** - 紫罗兰渐变
- **运维开发** - 青色渐变

---

## 📥 课件导出功能

### 功能概述

系统支持将 Slidev 课件导出为多种格式，方便教师分享和学生离线学习。

### 支持的导出格式

| 格式 | 说明 | 适用场景 |
|------|------|----------|
| **PDF 文档** 📄 | 通用文档格式 | 打印、分享、存档 |
| **Markdown 源文件** 📝 | 原始 MD 文件 | 源码学习、二次编辑 |

> **注意**：PPTX 和 PNG 格式由于会生成多个文件，暂不支持直接下载。如需这些格式，请使用 Slidev CLI 手动导出：
> ```bash
> npx slidev export courses/frontend/vue-basics/slides.md --format pptx
> ```

### 使用方法

#### 方法 1：从课程门户下载

1. 访问课程门户首页
2. 找到想要下载的课程卡片
3. 点击"下载课件"按钮
4. 选择导出格式
5. 文件会立即开始下载

#### 方法 2：从演示页面下载

1. 打开课件演示页面
2. 点击右下角的"下载"按钮
3. 选择导出格式
4. 文件会立即开始下载

### 工作原理

导出文件在**构建时预先生成**，用户点击下载时直接获取已生成的文件，无需等待：

```bash
# 构建时会自动生成所有格式的导出文件
npm run build

# 导出文件位于 dist/portal/exports/ 目录
```

每门课程会生成 2 个文件：
- `课程ID.pdf` - PDF 文档
- `课程ID.md` - Markdown 源文件

### 注意事项

- 导出文件在构建时生成，首次构建可能需要较长时间
- 修改课程后需要重新构建才能更新导出文件
- PDF 导出依赖 Slidev CLI 和 Playwright
- 导出文件随静态站点一起部署，无需额外的后端服务
- 目前仅支持 PDF 和 MD 格式，PPTX 和 PNG 需手动导出

### 故障排除

**文件下载失败（404）**
- 确认已执行完整构建（`npm run build`）
- 检查 `dist/portal/exports/` 目录是否有导出文件
- 确认课程 ID 与文件名匹配

**构建时导出失败**
- 检查 Slidev CLI 是否正确安装（`npx slidev --version`）
- 确认 Playwright 浏览器已安装（`npx playwright install`）
- 查看构建日志中的错误信息

**文件下载被浏览器拦截**
- 检查浏览器下载设置
- 允许来自该站点的下载
- 尝试右键"另存为"

---

## 📖 Slidev 语法

### 基本语法

```markdown
# 标题

内容...

---

# 下一页

更多内容...
```

### 代码高亮

````markdown
```javascript
const message = 'Hello World'
console.log(message)
```
````

### 布局

```markdown
---
layout: center
---

# 居中布局
```

### 更多语法

详见 [Slidev 官方文档](https://sli.dev/)

---

## 🚀 部署流程

### 架构说明

本项目采用 **GitHub Actions + EdgeOne** 的部署架构：

1. **GitHub Actions** 负责构建（支持 Playwright，可生成 PDF）
2. **gh-pages 分支** 存储构建产物
3. **EdgeOne** 从 gh-pages 分支拉取并部署静态文件

这种架构解决了 EdgeOne 不支持 Playwright 依赖的问题，确保 PDF 导出功能正常工作。

### GitHub Actions 配置

项目已配置自动化工作流（`.github/workflows/build-and-deploy.yml`），包含以下特性：

**触发条件**：
- 推送到 `main` 分支自动触发
- 支持手动触发（workflow_dispatch）

**智能构建策略**：
- 只有课程变更 → 增量构建（30-60秒）
- 门户/脚本变更 → 完整构建（3-5分钟）
- 自动检测变更类型，选择最优构建策略

**缓存优化**：
- npm 依赖缓存
- Playwright 浏览器缓存
- 大幅减少构建时间

**自动部署**：
- 构建完成后自动推送到 `gh-pages` 分支
- EdgeOne 自动检测更新并部署

### EdgeOne 配置

在 EdgeOne 控制台配置以下参数：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **框架预设** | Other（其他） | 不使用预设框架 |
| **构建命令** | （留空或 `echo "Skip build"`） | 跳过构建，使用预构建文件 |
| **输出目录** | `.` 或 `/` | 使用根目录 |
| **部署分支** | `gh-pages` | 从 gh-pages 分支拉取 |
| **自动部署** | 启用 | 检测到更新自动部署 |

### 部署流程

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Update courses"
   git push origin main
   ```

2. **GitHub Actions 自动构建**
   - 检测变更类型
   - 安装依赖（包括 Playwright）
   - 执行智能构建（增量或完整）
   - 生成 PDF 和 MD 导出文件
   - 推送构建产物到 gh-pages 分支

3. **EdgeOne 自动部署**
   - 检测 gh-pages 分支更新
   - 拉取预构建的静态文件
   - 部署到 CDN
   - 自动刷新缓存

> 📖 **详细部署指南**：查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解完整的迁移步骤、故障排除和回滚计划。

### 构建时间

| 场景 | 时间 | 说明 |
|------|------|------|
| **完整构建** | 3-5 分钟 | 所有课程 + PDF 导出 |
| **增量构建（1-2门课程）** | 30-60 秒 | 只构建修改的课程 |
| **增量构建（5-10门课程）** | 1-2 分钟 | 部分课程更新 |
| **仅门户更新** | < 30 秒 | 无课程变更 |

### 监控构建状态

**查看 GitHub Actions 日志**：
1. 访问 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看最新的工作流运行状态
4. 点击查看详细日志

**构建状态徽章**（可选）：
```markdown
![Build Status](https://github.com/your-username/your-repo/workflows/Build%20and%20Deploy/badge.svg)
```

### CDN 缓存配置

推荐的 EdgeOne 缓存规则：

| 路径 | 缓存时间 | 说明 |
|------|---------|------|
| `/*.html` | 5 分钟 | HTML 文件 |
| `/assets/*.js` | 1 年 | JS 文件（带哈希值） |
| `/assets/*.css` | 1 年 | CSS 文件（带哈希值） |
| `/courses/**/*` | 1 天 | 课程内容 |
| `/exports/**/*` | 1 天 | 导出文件（PDF/MD） |
| `/images/**/*` | 1 个月 | 图片资源 |

---

## ⚡ 智能构建系统

### 功能特性

项目采用智能构建系统，根据文件变更类型自动选择最优构建策略：

**增量构建**（仅课程变更）：
- 只构建修改过的课程
- 复用未修改课程的构建产物
- 构建时间：30-60 秒（1-2 门课程）

**完整构建**（门户/脚本变更）：
- 重新构建所有内容
- 确保系统一致性
- 构建时间：3-5 分钟

### 工作原理

1. **变更检测**：通过 git diff 检测修改的文件
2. **策略选择**：
   - `courses/` 目录变更 → 增量构建
   - `portal/` 或 `scripts/` 变更 → 完整构建
   - `package.json` 变更 → 完整构建
3. **缓存管理**：使用 `.buildcache/` 存储构建缓存
4. **智能导出**：只为修改的课程重新生成 PDF

### 本地使用

```bash
# 智能构建（自动检测变更）
node scripts/smart-build.js

# 强制完整构建
npm run build

# 增量构建课程
node scripts/incremental-build.js

# 增量导出文件
node scripts/incremental-exports.js
```

### 缓存管理

```bash
# 查看缓存状态
cat .buildcache/cache.json

# 清除缓存（强制重新构建）
rm -rf .buildcache

# Windows 清除缓存
rmdir /s /q .buildcache
```

---

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm start` | 构建并预览完整系统 |
| `npm run dev` | 开发门户（课程链接会404，下载功能不可用） |
| `npm run build` | 完整构建所有内容 |
| `npm run preview` | 预览构建结果 |
| `node scripts/smart-build.js` | 智能构建（推荐） |
| `npx slidev <path>` | 预览单个课程 |

---

## 📁 项目结构

```
courseware-system/
├── courses/                    # 课程目录
│   ├── frontend/              # 前端开发
│   ├── backend/               # 后端开发
│   └── devops/                # 运维开发
├── portal/                    # VitePress 门户
│   ├── .vitepress/
│   │   ├── config.ts         # 配置文件
│   │   ├── theme/            # 自定义主题
│   │   └── data/             # 数据加载器
│   └── index.md              # 首页
├── scripts/                   # 构建脚本
├── dist/                      # 构建输出
└── package.json              # 项目配置
```

---

## 🐛 常见问题

### Q: 点击课程卡片显示404？

**A:** 需要先构建课程。运行 `npm start` 查看完整系统。

开发模式（`npm run dev`）不会构建课程，这是正常的。

### Q: 修改课程后没有更新？

**A:** 
- **开发模式**：Slidev 会自动热重载
- **预览模式**：需要重新运行 `npm run build`

### Q: 课程没有出现在门户中？

**A:** 检查以下几点：
1. 文件名必须是 `slides.md`
2. 元数据包含所有必填字段（title、category、tags、description）
3. 重启开发服务器

### Q: 封面图片不显示？

**A:** 
1. 检查图片路径是否正确
2. 确保图片文件存在
3. 检查图片格式是否支持（JPG、PNG、SVG）

### Q: GitHub Actions 构建失败？

**A:** 
1. 访问 GitHub Actions 页面查看详细日志
2. 检查是否是 Playwright 安装失败（网络问题）
3. 检查课程元数据格式是否正确
4. 本地运行 `npm run build` 测试
5. 如果是首次运行，可能需要等待 Playwright 下载完成

### Q: PDF 导出失败？

**A:**
1. 检查 GitHub Actions 日志中的错误信息
2. 确认 Playwright 已成功安装
3. 检查课程 slides.md 文件格式是否正确
4. 本地测试：`npx playwright install chromium` 然后 `npm run build`

### Q: 部署后课程内容未更新？

**A:** 
1. 检查 GitHub Actions 是否成功完成
2. 确认 gh-pages 分支已更新
3. 清除浏览器缓存
4. 在 EdgeOne 控制台刷新 CDN 缓存
5. 等待 1-2 分钟让 EdgeOne 同步更新

### Q: 如何手动触发构建？

**A:**
1. 访问 GitHub 仓库的 Actions 页面
2. 选择 "Build and Deploy" 工作流
3. 点击 "Run workflow" 按钮
4. 选择 main 分支并确认运行

### Q: 如何清除构建缓存？

**A:**
```bash
# Windows
rmdir /s /q .buildcache dist

# Linux/Mac
rm -rf .buildcache dist

# 重新构建
npm run build
```

---

## 🎓 最佳实践

### 日常开发

1. 使用 `npm run dev` + `npx slidev` 组合开发
2. 门户查看课程列表，Slidev 实时预览课程内容
3. 修改课程后自动热重载

### 提交前检查

```bash
# 1. 本地构建测试（可选，GitHub Actions 会自动构建）
npm run build

# 2. 预览构建结果（可选）
npm run preview

# 3. 确认无误后提交
git add .
git commit -m "Update courses"
git push
```

### 课程创建

1. **标题简洁** - 使用简短、清晰的标题
2. **描述详细** - 提供足够的课程描述信息
3. **标签准确** - 使用准确的标签便于搜索
4. **封面美观** - 使用高质量的封面图片
5. **内容结构** - 合理组织课程内容结构
6. **代码示例** - 提供清晰的代码示例

### 部署优化

1. **增量更新** - 只修改需要更新的课程，智能构建会自动检测
2. **监控构建** - 关注 GitHub Actions 构建日志
3. **定期维护** - 定期清理旧的构建缓存（`.buildcache` 目录）
4. **元数据完整** - 确保填写所有必填字段
5. **命名规范** - 使用小写字母和连字符（如 `vue-basics`）
6. **批量更新** - 多个课程修改可以一次性提交，减少构建次数

### GitHub Actions 使用建议

1. **查看构建日志** - 每次推送后检查 Actions 页面确认构建成功
2. **利用缓存** - 工作流已配置依赖和浏览器缓存，无需额外操作
3. **手动触发** - 需要重新部署时可以手动触发工作流
4. **监控额度** - GitHub Actions 免费账户有 2000 分钟/月的额度
5. **优化构建** - 智能构建策略已自动优化，通常只需 30-60 秒

---

## 📄 许可证

MIT License
