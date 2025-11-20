# GitHub Actions 工作流

本目录包含项目的 CI/CD 工作流配置。

## 工作流说明

### build-and-deploy.yml

自动构建和部署工作流，在以下情况触发：

- 推送到 `main` 分支
- 手动触发（workflow_dispatch）

**主要步骤**：

1. **Checkout** - 检出代码（获取最近 2 次提交用于 diff）
2. **Setup Node.js** - 设置 Node.js 20 环境
3. **Cache dependencies** - 缓存 npm 依赖
4. **Install dependencies** - 安装项目依赖
5. **Cache Playwright** - 缓存 Playwright 浏览器
6. **Install Playwright** - 安装 Chromium 浏览器
7. **Smart build** - 执行智能构建（增量或完整）
8. **Deploy** - 部署到 gh-pages 分支

**构建时间**：
- 首次构建（无缓存）：5-8 分钟
- 后续构建（有缓存）：1-3 分钟
- 增量构建：30-60 秒

## 状态徽章

在 README.md 中添加构建状态徽章：

```markdown
![Build Status](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Build%20and%20Deploy/badge.svg)
```

替换 `YOUR_USERNAME` 和 `YOUR_REPO` 为你的实际值。

## 手动触发工作流

1. 访问 GitHub 仓库的 Actions 页面
2. 选择 "Build and Deploy" 工作流
3. 点击 "Run workflow" 按钮
4. 选择分支（通常是 main）
5. 点击 "Run workflow" 确认

## 查看构建日志

1. 访问 Actions 页面
2. 点击最近的工作流运行
3. 点击 "build-and-deploy" 作业
4. 展开各个步骤查看详细日志

## 故障排除

### Playwright 安装失败

**症状**：`Install Playwright browsers` 步骤失败

**解决方案**：
- 通常是网络问题，重新运行工作流
- 检查 Playwright 版本是否兼容

### 构建超时

**症状**：构建步骤超过 30 分钟

**解决方案**：
- 检查是否有课程文件过大
- 优化课程内容（压缩图片等）
- 增加 timeout-minutes 配置

### 部署失败

**症状**：`Deploy to gh-pages` 步骤失败

**解决方案**：
- 检查 GITHUB_TOKEN 权限
- 确认 gh-pages 分支没有保护规则
- 查看详细错误日志

## 优化建议

### 减少构建时间

1. **利用缓存**：工作流已配置缓存，无需额外操作
2. **增量构建**：智能构建会自动使用增量策略
3. **并行处理**：考虑拆分大型课程

### 节省 Actions 额度

1. **避免频繁推送**：批量提交多个更改
2. **使用草稿分支**：在其他分支开发，完成后合并到 main
3. **手动触发**：需要时手动触发而非自动触发

## 监控

### GitHub Actions 额度

- **免费账户**：2,000 分钟/月
- **Pro 账户**：3,000 分钟/月
- **本项目预估**：50-100 分钟/月（20-30 次构建）

查看使用情况：Settings → Billing → Actions

### 构建统计

在 Actions 页面可以查看：
- 构建成功率
- 平均构建时间
- 失败原因分析

## 相关文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [工作流语法](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
