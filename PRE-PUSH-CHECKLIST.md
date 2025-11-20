# 推送前检查清单

在推送代码到 GitHub 之前，请确认以下事项：

## ✅ 必须检查项

### 1. 代码质量

- [ ] 所有新增代码已测试
- [ ] 没有明显的语法错误
- [ ] 没有遗留的 console.log 或调试代码
- [ ] 代码符合项目规范

### 2. 依赖同步

- [ ] package.json 和 package-lock.json 已同步
  ```bash
  # 如果修改了 package.json，运行：
  npm install
  git add package-lock.json
  ```

### 3. 构建测试

- [ ] 本地构建成功
  ```bash
  npm run build:test
  # 或
  npm run build:smart
  ```

### 4. Git 状态

- [ ] 所有更改已暂存
  ```bash
  git status
  ```

- [ ] 提交信息清晰
  ```bash
  git commit -m "type: 清晰的提交信息"
  ```

## 📋 推荐检查项

### 5. 文档更新

- [ ] 如果添加新功能，更新了 README.md
- [ ] 如果修改 API，更新了相关文档
- [ ] 更新了 CHANGELOG.md（如果是重要更新）

### 6. 课程内容

- [ ] 课程元数据完整（title, category, tags, description）
- [ ] 课程内容无拼写错误
- [ ] 图片大小合理（< 500KB）
- [ ] 代码示例可运行

### 7. 性能检查

- [ ] 没有添加过大的文件（> 5MB）
- [ ] 图片已优化
- [ ] 没有不必要的依赖

## 🚀 推送步骤

完成所有检查后：

```bash
# 1. 查看将要推送的提交
git log origin/main..HEAD --oneline

# 2. 推送到 GitHub
git push origin main

# 3. 访问 GitHub Actions 页面
# https://github.com/YOUR_USERNAME/YOUR_REPO/actions

# 4. 监控构建状态
# 等待构建完成（通常 1-5 分钟）

# 5. 检查 gh-pages 分支
# 确认构建产物已推送

# 6. 等待 EdgeOne 部署
# 通常需要 1-2 分钟

# 7. 验证生产环境
# 访问你的网站，测试功能
```

## ⚠️ 常见问题

### Q: npm ci 失败？

**原因**：package.json 和 package-lock.json 不同步

**解决**：
```bash
npm install
git add package-lock.json
git commit -m "chore: 更新 package-lock.json"
```

### Q: Playwright 安装失败？

**原因**：网络问题或版本不兼容

**解决**：
- 重新运行工作流
- 检查 Playwright 版本
- 查看详细日志

### Q: 构建超时？

**原因**：课程文件过大或数量过多

**解决**：
- 优化图片大小
- 检查是否有不必要的大文件
- 考虑拆分大型课程

### Q: PDF 生成失败？

**原因**：课程格式错误或 Playwright 问题

**解决**：
- 检查课程 slides.md 格式
- 本地测试 PDF 生成
- 查看构建日志

## 📊 推送后监控

### 立即检查（0-5 分钟）

- [ ] GitHub Actions 工作流已触发
- [ ] 所有步骤正在执行或已完成
- [ ] 没有错误日志

### 短期检查（5-10 分钟）

- [ ] gh-pages 分支已更新
- [ ] EdgeOne 已检测到更新
- [ ] EdgeOne 部署成功

### 最终验证（10-15 分钟）

- [ ] 生产环境可访问
- [ ] 课程内容已更新
- [ ] PDF 下载功能正常
- [ ] 所有功能正常工作

## 🔄 如果出现问题

### 构建失败

1. 查看 GitHub Actions 日志
2. 找到失败的步骤
3. 根据错误信息修复
4. 重新推送或手动触发工作流

### 部署失败

1. 检查 gh-pages 分支是否更新
2. 检查 EdgeOne 配置
3. 查看 EdgeOne 部署日志
4. 必要时手动触发 EdgeOne 部署

### 功能异常

1. 清除浏览器缓存
2. 刷新 EdgeOne CDN 缓存
3. 等待 5-10 分钟让更新传播
4. 如果问题持续，考虑回滚

## 📞 获取帮助

如果遇到问题：

1. 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 故障排除部分
2. 查看 GitHub Actions 日志
3. 查看 EdgeOne 部署日志
4. 在 Issues 中提问

---

**记住**：推送前的检查可以避免 90% 的问题！花 2 分钟检查，可以节省 20 分钟的调试时间。
