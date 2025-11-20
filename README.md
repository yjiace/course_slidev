# 软件学院现代化课件系统

基于 VitePress + Slidev 的混合架构课件系统，支持自动构建、PDF 导出和智能增量更新。

## ✨ 核心特性

- 📚 **课程门户** - 自动扫描和展示所有课程
- 🎯 **Slidev 演示** - 现代化的演讲课件
- 📥 **PDF 导出** - 自动生成 PDF 和 Markdown 文件
- ⚡ **智能构建** - 增量构建，节省 80% 构建时间
- 🔄 **自动部署** - GitHub Actions + EdgeOne 自动化部署

## 🚀 快速开始

### 安装和运行

```bash
# 安装依赖
npm install

# 开发模式（仅门户）
npm run dev

# 完整构建和预览
npm start
```

### 创建新课程

```bash
# 1. 创建课程目录
mkdir -p courses/frontend/my-course

# 2. 创建课程文件（支持任意 .md 文件名，包括中文）
# 可以是 slides.md, 课程名.md, 或任何其他 .md 文件
```

**最小课程模板**：

```markdown
---
title: 我的课程
category: 前端开发
tags: [JavaScript]
description: 课程简介
---

# 我的课程

课程内容...

---

# 第二页

更多内容...
```

**支持的文件名**：
- `slides.md` - 传统命名
- `Vue基础.md` - 中文文件名
- `react-hooks.md` - 英文文件名
- 任何 `.md` 文件（只要包含完整的元数据）

### 预览课程

```bash
# 预览任意 .md 文件
npx slidev courses/frontend/my-course/slides.md
npx slidev courses/frontend/my-course/Vue基础.md
```

访问 http://localhost:3030 查看课程演示。

### 忽略文件

在项目根目录的 `.courseignore` 文件中配置需要忽略的文件和目录：

```
# 忽略特定文件
README.md
TODO.md

# 忽略目录
node_modules/
dist/

# 使用通配符
*.tmp
*~
```

## 📦 部署流程

### 架构说明

```
GitHub (main) → GitHub Actions 构建 → gh-pages 分支 → EdgeOne 部署
```

本项目采用 GitHub Actions 进行构建（支持 Playwright 生成 PDF），然后将构建产物推送到 gh-pages 分支，EdgeOne 从该分支拉取静态文件进行部署。

### 配置步骤

#### 1. 配置 GitHub Actions 权限

访问 GitHub 仓库设置：

1. Settings → Actions → General
2. 滚动到 "Workflow permissions"
3. 选择 **"Read and write permissions"**
4. 保存

#### 2. 推送代码触发构建

```bash
git add .
git commit -m "Update courses"
git push origin main
```

GitHub Actions 会自动：
- 安装依赖（包括 Playwright）
- 执行智能构建
- 生成 PDF 和 MD 导出文件
- 推送到 gh-pages 分支

#### 3. 配置 EdgeOne

在 EdgeOne 控制台配置：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **部署分支** | `gh-pages` | ⚠️ 重要 |
| **构建命令** | （留空） | 跳过构建 |
| **输出目录** | `.` | 根目录 |
| **自动部署** | 启用 | 自动检测更新 |

#### 4. 验证部署

1. 访问 GitHub Actions 页面查看构建状态
2. 确认 gh-pages 分支已创建并包含构建产物
3. 等待 EdgeOne 自动部署（1-2 分钟）
4. 访问网站验证功能

## ⚡ 智能构建

系统自动检测变更类型并选择最优构建策略：

- **仅课程变更** → 增量构建（30-60秒）
- **门户/脚本变更** → 完整构建（3-5分钟）

```bash
# 智能构建（自动检测）
npm run build:smart

# 测试构建（推送前验证）
npm run build:test

# 强制完整构建
npm run build
```

## 📖 课程元数据

### 必填字段

```yaml
---
title: 课程标题        # 必填
category: 课程分类    # 必填（前端开发、后端开发、运维开发等）
tags: [标签]          # 必填
description: 课程描述 # 必填
---
```

### 可选字段

```yaml
author: 作者          # 可选
date: 2024-01-20     # 可选
level: beginner      # 可选：beginner/intermediate/advanced/expert
duration: 8          # 可选：课时数
cover: cover.jpg     # 可选：封面图片（放在课程目录下）
```

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发门户（课程链接会 404） |
| `npm start` | 构建并预览完整系统 |
| `npm run build` | 完整构建 |
| `npm run build:smart` | 智能构建（推荐） |
| `npm run build:test` | 测试构建（推送前验证） |
| `npx slidev <path>` | 预览单个课程 |

## 🐛 常见问题

### Q: 课程点击后显示 404？

**A:** 开发模式下这是正常的。运行 `npm start` 查看完整系统。

### Q: PDF 下载失败？

**A:** 确保：
1. GitHub Actions 构建成功
2. gh-pages 分支包含 `exports/` 目录
3. EdgeOne 已完成部署

### Q: GitHub Actions 构建失败？

**A:** 检查：
1. 仓库是否启用了 "Read and write permissions"
2. package.json 和 package-lock.json 是否同步（运行 `npm install`）
3. 课程元数据格式是否正确

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

### Q: 如何手动触发构建？

**A:**
1. 访问 GitHub 仓库的 Actions 页面
2. 选择 "Build and Deploy" 工作流
3. 点击 "Run workflow"
4. 选择 main 分支并运行

## 📁 项目结构

```
courseware-system/
├── .github/workflows/    # GitHub Actions 配置
├── courses/              # 课程目录
│   ├── frontend/        # 前端开发课程
│   ├── backend/         # 后端开发课程
│   └── devops/          # 运维开发课程
├── portal/              # VitePress 门户
├── scripts/             # 构建脚本
└── dist/                # 构建输出
```

## 🎓 最佳实践

### 开发流程

1. 使用 `npm run dev` 启动门户
2. 使用 `npx slidev` 预览单个课程
3. 修改课程内容，实时查看效果
4. 完成后运行 `npm run build:test` 验证
5. 提交并推送到 GitHub

### 提交规范

```bash
git add .
git commit -m "feat: 添加 React Hooks 课程"
git push origin main
```

推荐使用语义化提交信息：
- `feat:` 新功能
- `fix:` 修复
- `docs:` 文档更新
- `style:` 样式调整

### 性能优化

1. **图片优化**：压缩图片，建议 < 500KB
2. **增量构建**：只修改需要更新的文件
3. **批量提交**：多个更改一次性提交，减少构建次数

## 📊 构建时间

| 场景 | 时间 | 说明 |
|------|------|------|
| 完整构建 | 3-5 分钟 | 所有课程 + PDF 导出 |
| 增量构建（1-2 门课程） | 30-60 秒 | 只构建修改的课程 |
| 增量构建（5-10 门课程） | 1-2 分钟 | 部分课程更新 |
| 仅门户更新 | < 30 秒 | 无课程变更 |

## 🔗 相关资源

- [Slidev 官方文档](https://sli.dev/) - Slidev 语法和功能
- [VitePress 官方文档](https://vitepress.dev/) - VitePress 配置
- [GitHub Actions 文档](https://docs.github.com/en/actions) - CI/CD 配置

## 📄 许可证

MIT License

---

**提示**：首次部署时，构建可能需要 5-8 分钟（下载 Playwright 浏览器）。后续构建会利用缓存，通常只需 1-3 分钟。
