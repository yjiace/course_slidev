# 故障排除指南

本文档列出了常见问题及其解决方案。

## 🚨 GitHub Actions 问题

### 问题 1: 权限被拒绝（403 错误）

**错误信息**：
```
remote: Permission to username/repo.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/username/repo.git/': The requested URL returned error: 403
```

**原因**：GitHub Actions 没有写入权限

**解决方案**：

**方法 1：检查工作流文件**（推荐）

确认 `.github/workflows/build-and-deploy.yml` 包含：
```yaml
permissions:
  contents: write
```

**方法 2：修改仓库设置**

1. 访问 GitHub 仓库
2. Settings → Actions → General
3. 滚动到 "Workflow permissions"
4. 选择 "Read and write permissions"
5. 点击 "Save"

### 问题 2: npm ci 失败

**错误信息**：
```
npm ci can only install packages when your package.json and package-lock.json are in sync
```

**原因**：package.json 和 package-lock.json 不同步

**解决方案**：

```bash
# 本地更新锁文件
npm install

# 提交更改
git add package-lock.json
git commit -m "chore: 更新 package-lock.json"
git push origin main
```

### 问题 3: Playwright 安装失败

**错误信息**：
```
Error: Failed to install browsers
```

**原因**：网络问题或版本不兼容

**解决方案**：

1. **重新运行工作流**
   - 访问 Actions 页面
   - 点击失败的工作流
   - 点击 "Re-run all jobs"

2. **检查 Playwright 版本**
   - 确认 package.json 中的版本
   - 更新到最新稳定版

3. **本地测试**
   ```bash
   npx playwright install chromium
   npm run build
   ```

### 问题 4: 构建超时

**错误信息**：
```
Error: The operation was canceled.
```

**原因**：构建时间超过 30 分钟

**解决方案**：

1. **优化课程内容**
   - 压缩图片（< 500KB）
   - 减少大文件
   - 拆分大型课程

2. **增加超时时间**
   
   在 `.github/workflows/build-and-deploy.yml` 中：
   ```yaml
   - name: Smart build
     run: node scripts/smart-build.js
     timeout-minutes: 45  # 增加到 45 分钟
   ```

3. **使用增量构建**
   - 确保智能构建正常工作
   - 只修改必要的文件

### 问题 5: 构建产物不存在

**错误信息**：
```
Error: dist/portal directory not found
```

**原因**：构建失败但没有报错

**解决方案**：

1. **查看构建日志**
   - 找到 "Smart build" 步骤
   - 查看详细输出
   - 找到失败原因

2. **本地测试**
   ```bash
   npm run build:test
   ```

3. **检查课程文件**
   - 确认所有课程格式正确
   - 检查元数据完整性

## 📦 构建问题

### 问题 6: PDF 生成失败

**错误信息**：
```
PDF export failed
```

**原因**：Playwright 问题或课程格式错误

**解决方案**：

1. **检查课程格式**
   ```bash
   # 本地测试单个课程
   npx slidev export courses/frontend/your-course/slides.md --format pdf
   ```

2. **检查 Playwright**
   ```bash
   npx playwright install chromium
   ```

3. **查看详细日志**
   - 在构建日志中搜索 "PDF"
   - 查看具体错误信息

### 问题 7: 增量构建不工作

**症状**：每次都执行完整构建

**原因**：缓存被清除或变更检测失败

**解决方案**：

1. **检查 git 历史**
   ```bash
   git log --oneline -5
   ```

2. **手动触发增量构建**
   ```bash
   node scripts/smart-build.js
   ```

3. **清除缓存重新构建**
   ```bash
   rm -rf .buildcache
   npm run build
   ```

### 问题 8: 依赖安装慢

**症状**：npm install 需要很长时间

**解决方案**：

1. **检查缓存**
   - GitHub Actions 应该自动缓存
   - 查看 "Cache npm dependencies" 步骤

2. **使用 npm ci**
   - 工作流已配置使用 npm ci
   - 比 npm install 更快

3. **减少依赖**
   - 检查是否有不必要的依赖
   - 移除未使用的包

## 🌐 EdgeOne 问题

### 问题 9: EdgeOne 未检测到更新

**症状**：gh-pages 已更新但 EdgeOne 没有部署

**解决方案**：

1. **检查 EdgeOne 配置**
   - 确认部署分支为 gh-pages
   - 确认自动部署已启用

2. **手动触发部署**
   - 登录 EdgeOne 控制台
   - 找到项目
   - 点击 "立即部署"

3. **检查 Webhook**
   - 确认 GitHub Webhook 正常
   - 查看 Webhook 日志

### 问题 10: 部署后内容未更新

**症状**：访问网站看到的是旧内容

**解决方案**：

1. **清除浏览器缓存**
   ```
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

2. **清除 CDN 缓存**
   - 登录 EdgeOne 控制台
   - 找到缓存管理
   - 刷新全部缓存

3. **等待传播**
   - CDN 更新需要时间
   - 通常 5-10 分钟

4. **检查部署时间**
   - 确认 EdgeOne 部署时间
   - 与 gh-pages 更新时间对比

## 🔍 调试技巧

### 查看详细日志

**GitHub Actions**：
1. 访问 Actions 页面
2. 点击失败的工作流
3. 点击 "build-and-deploy" 作业
4. 展开每个步骤查看日志

**本地调试**：
```bash
# 详细模式构建
node scripts/smart-build.js --verbose

# 测试构建
npm run build:test

# 查看缓存
cat .buildcache/cache.json
```

### 常用命令

```bash
# 检查 git 状态
git status

# 查看最近提交
git log --oneline -5

# 查看文件变更
git diff HEAD~1

# 清除所有缓存
rm -rf .buildcache dist node_modules
npm install

# 完整重新构建
npm run build
```

### 获取帮助

如果以上方法都无法解决问题：

1. **查看文档**
   - [README.md](./README.md)
   - [DEPLOYMENT.md](./DEPLOYMENT.md)
   - [.github/README.md](./.github/README.md)

2. **搜索 Issues**
   - 在 GitHub Issues 中搜索类似问题
   - 查看已关闭的 Issues

3. **创建 Issue**
   - 描述问题
   - 提供错误日志
   - 说明已尝试的解决方案

4. **联系支持**
   - GitHub Actions 支持
   - EdgeOne 技术支持

## 📊 性能优化

### 减少构建时间

1. **使用增量构建**
   - 只修改需要更新的文件
   - 让智能构建自动选择策略

2. **优化图片**
   - 压缩图片大小
   - 使用适当的格式（WebP、JPEG）

3. **利用缓存**
   - 不要清除 .buildcache
   - 让 GitHub Actions 缓存生效

4. **并行处理**
   - 系统已自动并行处理
   - 无需额外配置

### 减少 Actions 额度消耗

1. **批量提交**
   - 多个更改一次性提交
   - 避免频繁推送

2. **使用草稿分支**
   - 在其他分支开发
   - 完成后合并到 main

3. **手动触发**
   - 使用 workflow_dispatch
   - 需要时手动运行

## 🆘 紧急情况

### 生产环境故障

如果生产环境出现严重问题：

1. **立即回滚**
   ```bash
   # 回滚到上一个版本
   git revert HEAD
   git push origin main
   ```

2. **使用旧版本**
   - 在 EdgeOne 中切换到旧的提交
   - 或临时切换回 main 分支

3. **禁用自动部署**
   - 在 EdgeOne 中暂时禁用
   - 修复问题后再启用

### 构建完全失败

如果无法构建：

1. **使用本地构建**
   ```bash
   npm run build
   # 手动上传 dist/portal 到服务器
   ```

2. **恢复旧配置**
   - 查看 git 历史
   - 恢复到最后一个可用版本

3. **寻求帮助**
   - 创建紧急 Issue
   - 联系维护者

---

**记住**：大多数问题都有简单的解决方案。保持冷静，仔细阅读错误信息，逐步排查。
