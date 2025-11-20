# 部署迁移指南

本文档提供从 EdgeOne 直接构建迁移到 GitHub Actions + EdgeOne 部署的详细步骤。

## 📋 迁移前检查清单

在开始迁移之前，请确认以下事项：

- [ ] 已备份当前 EdgeOne 配置
- [ ] 已记录当前部署流程
- [ ] 本地测试构建成功（`npm run build`）
- [ ] 所有课程都能正常构建
- [ ] Playwright 在本地环境可以正常工作
- [ ] 已创建 GitHub 仓库并推送代码
- [ ] 了解 GitHub Actions 的基本使用

## 🚀 迁移步骤

### 步骤 1: 准备 GitHub 仓库

1. **确认代码已推送到 GitHub**
   ```bash
   git remote -v  # 确认远程仓库
   git push origin main  # 推送最新代码
   ```

2. **确认工作流文件存在**
   - 检查 `.github/workflows/build-and-deploy.yml` 文件是否存在
   - 确认文件内容正确

### 步骤 2: 测试 GitHub Actions 工作流

1. **手动触发工作流**
   - 访问 GitHub 仓库的 Actions 页面
   - 选择 "Build and Deploy" 工作流
   - 点击 "Run workflow"
   - 选择 main 分支并运行

2. **监控构建过程**
   - 查看实时日志
   - 确认所有步骤成功完成
   - 特别关注 Playwright 安装和 PDF 生成步骤

3. **验证 gh-pages 分支**
   - 确认 gh-pages 分支已创建
   - 检查分支内容包含所有构建产物
   - 确认 exports 目录包含 PDF 文件

**预期结果**：
- ✅ 工作流成功完成
- ✅ gh-pages 分支包含完整的静态文件
- ✅ PDF 文件正确生成

### 步骤 3: 配置 EdgeOne

1. **登录 EdgeOne 控制台**
   - 访问 https://console.cloud.tencent.com/edgeone

2. **修改项目配置**
   
   **构建配置**：
   - 框架预设：`Other`（其他）
   - 构建命令：留空或输入 `echo "Skip build"`
   - 安装命令：留空
   - 输出目录：`.` 或 `/`
   
   **部署配置**：
   - 部署分支：`gh-pages`
   - 自动部署：启用
   
   **Node.js 配置**（可选，因为不需要构建）：
   - Node.js 版本：18.x 或更高

3. **保存配置**
   - 点击保存
   - 确认配置已更新

### 步骤 4: 触发首次部署

1. **方式 1：推送代码触发**
   ```bash
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
   ```

2. **方式 2：手动触发 GitHub Actions**
   - 访问 Actions 页面
   - 手动运行工作流

3. **等待部署完成**
   - GitHub Actions 构建（3-5 分钟）
   - EdgeOne 检测更新（1-2 分钟）
   - EdgeOne 部署（1-2 分钟）

### 步骤 5: 验证部署结果

1. **访问生产环境**
   - 打开 EdgeOne 提供的域名
   - 确认课程门户正常显示

2. **测试核心功能**
   - [ ] 课程列表正常显示
   - [ ] 课程搜索功能正常
   - [ ] 课程分类筛选正常
   - [ ] 点击课程可以进入详情页
   - [ ] Slidev 演示正常加载
   - [ ] PDF 下载功能正常
   - [ ] Markdown 下载功能正常

3. **验证 PDF 文件**
   - 下载几个 PDF 文件
   - 确认 PDF 内容完整
   - 确认 PDF 格式正确

4. **测试更新流程**
   - 修改一个课程文件
   - 推送到 GitHub
   - 等待自动部署
   - 确认更新生效

## ✅ 迁移完成检查

- [ ] GitHub Actions 工作流正常运行
- [ ] gh-pages 分支自动更新
- [ ] EdgeOne 自动检测并部署
- [ ] 所有课程正常显示
- [ ] PDF 下载功能正常工作
- [ ] 增量构建正常工作（只构建修改的课程）
- [ ] 构建时间符合预期（增量 < 1 分钟）
- [ ] 团队成员了解新的部署流程

## 🔄 回滚计划

如果迁移后出现问题，可以按以下步骤回滚：

### 立即回滚（紧急情况）

1. **恢复 EdgeOne 配置**
   - 登录 EdgeOne 控制台
   - 修改部署分支为 `main`
   - 修改构建命令为 `npm run build`
   - 修改输出目录为 `dist/portal`
   - 保存配置

2. **触发重新部署**
   - 在 EdgeOne 控制台手动触发部署
   - 或推送一个空提交到 main 分支

### 回滚触发条件

以下情况建议回滚：

- GitHub Actions 构建持续失败（> 3 次）
- PDF 生成功能完全不可用
- 构建时间超过 10 分钟
- 部署失败率 > 50%
- 关键功能损坏

## 📊 监控和维护

### 日常监控

1. **GitHub Actions 状态**
   - 定期检查 Actions 页面
   - 关注失败的工作流
   - 查看构建时间趋势

2. **EdgeOne 状态**
   - 监控部署成功率
   - 检查 CDN 缓存命中率
   - 关注访问日志

3. **构建性能**
   - 记录平均构建时间
   - 监控 GitHub Actions 额度使用
   - 优化缓存策略

### 定期维护

**每周**：
- 检查 GitHub Actions 工作流状态
- 清理旧的 gh-pages 分支历史（可选）

**每月**：
- 审查构建日志，查找潜在问题
- 更新依赖包（包括 Playwright）
- 检查 GitHub Actions 额度使用情况

**每季度**：
- 评估构建性能，优化构建策略
- 更新文档，反映最新的最佳实践
- 培训团队成员使用新流程

## 🆘 故障排除

### GitHub Actions 构建失败

**问题**：工作流运行失败

**排查步骤**：
1. 查看 Actions 日志，定位失败步骤
2. 检查是否是网络问题（Playwright 下载失败）
3. 本地运行 `npm run build` 测试
4. 检查 package.json 依赖版本

**常见解决方案**：
- Playwright 安装失败：重新运行工作流
- 依赖安装失败：检查 package-lock.json
- 构建超时：优化构建脚本或增加超时时间

### PDF 生成失败

**问题**：PDF 文件无法生成或损坏

**排查步骤**：
1. 检查 Playwright 是否正确安装
2. 查看 PDF 生成的详细日志
3. 检查课程 slides.md 格式
4. 本地测试 PDF 生成

**常见解决方案**：
- 课程格式错误：修复 slides.md 语法
- Playwright 版本问题：更新到最新版本
- 内存不足：优化课程内容或增加资源

### EdgeOne 部署失败

**问题**：EdgeOne 无法检测或部署更新

**排查步骤**：
1. 确认 gh-pages 分支已更新
2. 检查 EdgeOne 配置是否正确
3. 查看 EdgeOne 部署日志
4. 手动触发 EdgeOne 部署

**常见解决方案**：
- 分支配置错误：确认部署分支为 gh-pages
- 权限问题：检查 GitHub token 权限
- 缓存问题：清除 EdgeOne CDN 缓存

### 构建时间过长

**问题**：构建时间超过预期

**排查步骤**：
1. 检查是否使用了增量构建
2. 查看缓存是否生效
3. 分析哪些步骤耗时最长
4. 检查课程数量和大小

**优化方案**：
- 确保智能构建正常工作
- 优化课程内容（减少大图片）
- 增加并行处理
- 使用更好的缓存策略

## 📞 获取帮助

如果遇到无法解决的问题：

1. **查看文档**
   - README.md - 基本使用说明
   - DEPLOYMENT.md - 本文档
   - .github/workflows/build-and-deploy.yml - 工作流配置

2. **查看日志**
   - GitHub Actions 日志
   - EdgeOne 部署日志
   - 本地构建日志

3. **联系支持**
   - GitHub Issues
   - 团队技术支持
   - EdgeOne 技术支持

## 📚 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Playwright 文档](https://playwright.dev/)
- [Slidev 文档](https://sli.dev/)
- [VitePress 文档](https://vitepress.dev/)
- [EdgeOne 文档](https://cloud.tencent.com/document/product/1552)

---

**最后更新**：2024-01-20
**版本**：1.0.0
