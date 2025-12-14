# 软件学院现代化课件系统

基于 VitePress + Slidev 的混合架构课件系统，支持**课程演示**和**技术文档**两大模块，具备自动构建、PDF 导出和智能增量更新功能。

## ✨ 核心特性

- 📚 **课程演示** - Slidev 幻灯片课件，支持在线预览和 PDF 导出
- 📄 **技术文档** - Markdown 文档专栏，自动生成目录导航
- 🎯 **统一门户** - 自动扫描和展示所有内容
- ⚡ **智能构建** - 增量构建，节省 80% 构建时间
- 🔄 **自动部署** - GitHub Actions + EdgeOne 自动化部署

## 🚀 快速开始

### 安装和运行

```bash
# 安装依赖
npm install

# 门户/文档开发（热更新）
npm run dev

# 构建并预览
npm start
```

## 📁 项目结构

```
courseware-system/
├── .github/workflows/    # GitHub Actions 配置
├── courses/              # 📚 课程源文件目录
│   ├── frontend/         # 前端开发课程
│   ├── backend/          # 后端开发课程
│   └── devops/           # 运维开发课程
├── docs/                 # 📄 文档源文件目录（主要编辑位置）
│   ├── frontend/         # 前端开发文档
│   ├── backend/          # 后端开发文档
│   └── devops/           # 运维开发文档
├── portal/               # 🌐 VitePress 门户（构建配置）
│   ├── .vitepress/       # VitePress 配置和主题
│   │   ├── config.ts     # 站点配置（导航、侧边栏等）
│   │   ├── data/         # 数据加载器
│   │   └── theme/        # 自定义主题和组件
│   ├── docs/             # 构建时自动生成（勿手动编辑）
│   ├── index.md          # 首页入口
│   └── courses.md        # 课程列表页入口
├── scripts/              # 📦 构建脚本
├── dist/                 # 构建输出
└── .buildcache/          # 构建缓存
```

> ⚠️ **重要提示**：
> - 课程文件编辑位置：`courses/` 目录
> - 文档文件编辑位置：`docs/` 目录
> - `portal/docs/` 是构建时自动生成的，请勿直接编辑

---

## 📚 课程模块

### 创建新课程

```bash
# 1. 创建课程目录
mkdir -p courses/frontend/my-course

# 2. 创建课程文件
# 文件名可以是：slides.md、课程名.md 或任何 .md 文件
```

### 课程元数据（必填）

```yaml
---
title: 我的课程           # 课程标题
category: 前端开发        # 分类（见下方分类列表）
tags: [JavaScript, Vue]   # 标签数组
description: 课程简介     # 课程描述
---

# 课程内容

第一页内容...

---

# 第二页

更多内容...
```

### 课程分类

| 分类 | 说明 | 颜色标识 |
|------|------|----------|
| `前端开发` | Web 前端相关 | 🔵 蓝色 |
| `后端开发` | 服务端开发 | 🔴 红色 |
| `运维开发` | DevOps、部署 | 🟡 黄色 |
| `数据结构` | 算法与数据结构 | 🟢 绿色 |
| `计算机基础` | 基础理论 | ⚪ 灰色 |
| `人工智能` | AI/ML 相关 | 🟣 紫色 |

### 添加新分类

**分类颜色是自动生成的**，无需修改任何代码！

只需在 Markdown 文件的 `category` 字段中填写任意分类名称，系统会自动为其分配一个唯一的颜色。

```yaml
---
category: 我的新分类    # 自动分配颜色，无需额外配置
---
```

> 💡 **颜色分配原理**：系统使用分类名称的哈希值来确定颜色，同一分类名称总是显示相同的颜色。

### 可选元数据

```yaml
author: 张老师           # 作者
date: 2024-01-20        # 日期
level: beginner         # 难度：beginner/intermediate/advanced
duration: 8             # 课时数
cover: cover.jpg        # 封面图片（放在课程目录下）
```

### 预览课程

```bash
npx slidev courses/frontend/my-course/slides.md
```

---

## 📄 文档模块

### 创建新文档

```bash
# 1. 创建文档文件
# 直接在 docs/ 目录下创建 .md 文件
```

**示例结构**：
```
docs/
├── frontend/
│   └── vue-basic.md      # Vue 教程
├── backend/
│   └── spring-boot.md    # Spring Boot 教程
└── devops/
    └── docker-guide.md   # Docker 指南
```

### 文档元数据（必填）

```yaml
---
title: Vue 3 基础教程      # 文档标题
category: 前端开发         # 分类（与课程分类一致）
tags: [Vue, JavaScript]   # 标签数组
description: Vue 3 核心概念入门指南  # 描述
author: 技术文档组         # 作者
date: 2024-12-01          # 日期
---

# 文档标题

正文内容...

## 章节一

章节内容...

### 子章节

子章节内容...
```

### 文档分类

使用与课程相同的分类体系，文档构建时会自动：
- 提取文档目录（TOC）
- 按分类组织侧边栏
- 生成可点击的导航

### 文档特有字段

```yaml
cover: cover.jpg    # 可选：文档封面图
```

---

## 🌐 Portal 门户目录说明

`portal/` 目录是 VitePress 网站的核心配置目录：

```
portal/
├── .vitepress/
│   ├── config.ts         # 🔧 站点配置
│   │   ├── 导航栏配置 (nav)
│   │   ├── 侧边栏配置 (sidebar)  
│   │   └── 搜索配置 (search)
│   ├── data/
│   │   ├── courses.data.ts   # 课程数据加载器
│   │   └── docs.data.ts      # 文档数据加载器
│   └── theme/
│       ├── Layout.vue        # 主布局
│       ├── index.ts          # 主题入口
│       └── components/       # 自定义组件
│           ├── HomePage.vue       # 首页
│           ├── CoursesPage.vue    # 课程列表
│           ├── DocsPage.vue       # 文档列表
│           ├── CourseCard.vue     # 课程卡片
│           ├── DocCard.vue        # 文档卡片
│           └── CustomHeader.vue   # 顶部导航
├── docs/                 # ⚠️ 构建时自动生成
├── index.md              # 首页（layout: docs）
└── courses.md            # 课程列表页（layout: courses）
```

### 配置侧边栏

编辑 `portal/.vitepress/config.ts` 的 `sidebar` 配置：

```typescript
sidebar: {
  '/docs/': [
    {
      text: '前端开发',
      collapsed: false,
      items: [
        { text: 'Vue 3 教程', link: '/docs/frontend/vue-basic' }
      ]
    },
    {
      text: '后端开发', 
      items: [
        { text: 'Spring Boot', link: '/docs/backend/spring-boot' }
      ]
    }
  ]
}
```

---

## 🔧 开发命令

### 📄 门户/文档开发

```bash
npm run dev
```

| 特性 | 说明 |
|------|------|
| **适用场景** | 开发首页、文档列表、文档详情页面 |
| **访问地址** | http://localhost:5173 |
| **热更新** | ✅ 修改 `docs/` 或 `portal/` 后自动刷新 |

### 📚 课程开发

```bash
npx slidev courses/分类/课程目录/slides.md
```

| 特性 | 说明 |
|------|------|
| **适用场景** | 编写 Slidev 幻灯片课程 |
| **访问地址** | http://localhost:3030 |
| **热更新** | ✅ 实时刷新 |

**示例**：
```bash
npx slidev courses/frontend/vue-basics/slides.md
```

---

## 🚀 构建部署

### 构建命令

| 命令 | 说明 |
|------|------|
| `npm run build` | 增量构建（仅构建变更的课程） |
| `npm run build:all` | 完整构建（重新构建所有内容） |
| `npm run start` | 增量构建 + 本地预览 |

### 部署上线

```bash
git add .
git commit -m "更新内容"
git push origin main
```

推送后自动触发 GitHub Actions 构建，部署到 EdgeOne。

---

## ⚡ 命令速查表

| 我想要... | 使用命令 |
|-----------|----------|
| 📄 开发门户/文档 | `npm run dev` |
| 📚 开发课程幻灯片 | `npx slidev courses/.../slides.md` |
| 🔨 增量构建 | `npm run build` |
| 🔨 完整构建 | `npm run build:all` |
| 👀 构建并预览 | `npm run start` |
| 🚀 部署上线 | `git push origin main` |

---

## 📦 构建流程

运行 `npm run build` 或 `npm run start` 时的构建流程：

```
1. 复制文档      docs/ → portal/docs/
2. 构建门户      VitePress 构建
3. 构建课程      Slidev 增量构建
4. 生成导出      PDF 和 Markdown 导出
5. 启动预览      http://localhost:4173 (仅 npm start)
```

## 📦 部署流程

### 架构说明

```
GitHub (main) → GitHub Actions 构建 → gh-pages 分支 → EdgeOne 部署
```

### 配置步骤

1. **配置 GitHub Actions 权限**
   - Settings → Actions → General
   - 选择 "Read and write permissions"

2. **推送代码触发构建**
   ```bash
   git push origin main
   ```

3. **配置 EdgeOne**
   | 配置项 | 值 |
   |--------|-----|
   | 部署分支 | `gh-pages` |
   | 构建命令 | （留空） |
   | 输出目录 | `.` |

## 🐛 常见问题

### Q: 课程/文档点击后显示 404？
**A:** 开发模式下正常。运行 `npm start` 查看完整系统。

### Q: 文档修改后不生效？
**A:** 确保修改的是 `docs/` 目录而非 `portal/docs/`。重新运行 `npm start`。

### Q: 如何添加新分类？
**A:** 编辑以下文件添加分类颜色映射：
- `portal/.vitepress/theme/components/CourseCard.vue`
- `portal/.vitepress/theme/components/DocCard.vue`

### Q: 如何清除构建缓存？
```bash
# Windows
rmdir /s /q .buildcache dist portal\docs

# Linux/Mac
rm -rf .buildcache dist portal/docs
```

## 📊 构建时间

| 场景 | 时间 |
|------|------|
| 完整构建 | 3-5 分钟 |
| 增量构建（1-2 门课程） | 30-60 秒 |
| 仅门户更新 | < 30 秒 |

## 🔗 相关资源

- [Slidev 官方文档](https://sli.dev/)
- [VitePress 官方文档](https://vitepress.dev/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## 📄 许可证

MIT License
