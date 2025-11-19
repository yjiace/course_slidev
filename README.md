# 软件学院现代化课件系统

基于 VitePress + Slidev 的混合架构课件系统，为软件学院提供现代化的课堂演讲和课程管理解决方案。

## ✨ 特性

- 📚 **课程门户** - 自动扫描和展示所有课程
- 🎯 **演讲课件** - Slidev 构建的现代化幻灯片
- 🔍 **智能搜索** - 支持课程标题、描述、标签的全文搜索
- 🏷️ **分类标签** - 按教研室分类和标签组织课程
- ⚡ **增量构建** - 智能检测变更，减少构建时间
- 🚀 **自动部署** - EdgeOne 自动拉取和部署
- 🎨 **响应式设计** - 适配各种屏幕尺寸

---

## 📦 快速开始

### 安装依赖

```bash
npm install
```

### 一键启动

```bash
npm start
```

访问 http://localhost:4173，查看课程门户并点击课程进入演讲模式。

---

## 🔧 开发模式

### 场景1：开发课程内容（推荐）

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

---

## 📝 创建新课程

### 1. 创建课程目录

```bash
mkdir -p courses/frontend/my-new-course
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

---

## 🚀 部署到 EdgeOne

### EdgeOne 配置

在 EdgeOne 控制台配置以下参数：

| 配置项 | 值 |
|--------|-----|
| **框架预设** | Other（其他） |
| **Node.js 版本** | 18.x 或更高 |
| **包管理器** | npm |
| **构建命令** | `npm run build` |
| **输出目录** | `dist/portal` |

### 部署流程

1. 推送代码到 Git 仓库
2. EdgeOne 自动拉取代码
3. 执行 `npm install`
4. 执行 `npm run build`
5. 部署 `dist/portal` 目录
6. 自动刷新 CDN 缓存

### 构建说明

- **首次构建**：约 1-2 分钟（需要构建所有课程）
- **增量构建**：约 30-60 秒（只构建修改的课程）
- **构建缓存**：系统自动使用 `.buildcache` 目录加速构建

### 推荐的 CDN 缓存规则

| 路径 | 缓存时间 | 说明 |
|------|---------|------|
| `/*.html` | 5 分钟 | HTML 文件 |
| `/assets/*.js` | 1 年 | JS 文件（带哈希） |
| `/assets/*.css` | 1 年 | CSS 文件（带哈希） |
| `/courses/**/*` | 1 天 | 课程内容 |

---

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm start` | 构建并预览完整系统 |
| `npm run dev` | 开发门户界面 |
| `npm run build` | 构建所有内容 |
| `npm run preview` | 预览构建结果 |
| `npx slidev <path>` | 实时预览课程 |

---

## 📁 项目结构

```
courseware-system/
├── courses/                        # 课程目录
│   ├── frontend/                   # 前端开发教研室
│   ├── backend/                    # 后端开发教研室
│   └── devops/                     # 运维开发教研室
├── portal/                         # VitePress 门户
│   ├── .vitepress/
│   │   ├── config.ts              # VitePress 配置
│   │   ├── theme/                 # 自定义主题
│   │   │   ├── components/        # Vue 组件
│   │   │   └── styles/            # 自定义样式
│   │   └── data/
│   │       └── courses.data.ts    # 课程数据加载器
│   └── index.md                    # 门户首页
├── scripts/                        # 构建脚本
│   ├── build-all.js               # 完整构建脚本
│   ├── incremental-build.js       # 增量构建脚本
│   └── scan-courses-simple.js     # 课程扫描器
├── docs/                           # 文档目录
├── dist/                           # 构建输出（自动生成）
├── .buildcache/                    # 构建缓存（自动生成）
├── package.json                    # 项目配置
└── tsconfig.json                   # TypeScript 配置
```

---

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

### 同时开发多个课程

在不同终端启动多个 Slidev 实例：

```bash
# 终端1
npx slidev courses/frontend/vue-basics/slides.md --port 3030

# 终端2
npx slidev courses/backend/nodejs-intro/slides.md --port 3031
```

---

## 🐛 常见问题

### Q: 门户显示课程，但点击后 404？

A: 需要先构建课程。运行 `npm start`

### Q: 修改课程后没有更新？

A: 
- 开发模式：Slidev 会自动热重载
- 预览模式：需要重新运行 `npm run build`

### Q: EdgeOne 构建失败？

A: 
1. 检查 Node.js 版本是否为 18 或更高
2. 检查课程元数据格式是否正确
3. 查看 EdgeOne 构建日志获取详细错误

### Q: 课程内容没有更新？

A: 
1. 检查 EdgeOne 构建日志，确认构建成功
2. 清除浏览器缓存
3. 在 EdgeOne 控制台刷新 CDN 缓存

### Q: 构建时间过长？

A: 首次构建需要构建所有课程，后续构建会使用增量构建，速度会快很多。

---

## 🎓 最佳实践

1. **日常开发**：使用 `npm run dev` + `npx slidev` 组合
2. **测试验证**：使用 `npm start` 测试完整流程
3. **提交前**：运行 `npm run build` 确保构建成功
4. **课程元数据**：确保填写完整的 frontmatter（title、category、tags、description）
5. **命名规范**：使用小写字母和连字符命名课程目录（如 `vue-basics`）

---

## 📖 更多文档

- [课程创建指南](docs/course-guide.md) - 详细的课程创建说明
- [部署配置指南](docs/deployment-guide.md) - 完整的部署文档

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
