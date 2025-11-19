# 部署配置指南

本指南说明如何将课件系统部署到腾讯云 EdgeOne。

## 📦 本地构建

### 构建项目

```bash
npm run build
```

构建产物位于 `dist/portal/` 目录。

### 预览构建结果

```bash
npm run preview
```

访问 http://localhost:4173 查看构建结果。

---

## 🚀 部署到 EdgeOne

### 方式一：EdgeOne 自动拉取（推荐）

EdgeOne 支持从 Git 仓库自动拉取代码并构建部署。

#### 1. 在 EdgeOne 控制台配置

1. 登录腾讯云 EdgeOne 控制台
2. 创建新站点或选择现有站点
3. 配置 Git 仓库连接：
   - 仓库地址：你的 GitHub/GitLab 仓库
   - 分支：`main`
   - 构建命令：`npm run build`
   - 输出目录：`dist/portal`

#### 2. 配置 Webhook

EdgeOne 会自动配置 Webhook，当你推送代码到 `main` 分支时：
1. EdgeOne 自动拉取最新代码
2. 执行 `npm install`
3. 执行 `npm run build`
4. 部署 `dist/portal` 目录
5. 自动刷新 CDN 缓存

#### 3. 推送代码触发部署

```bash
git add .
git commit -m "Update courses"
git push origin main
```

EdgeOne 会自动开始构建和部署。

---

### 方式二：手动上传

如果不使用自动部署，可以手动上传构建产物。

#### 1. 本地构建

```bash
npm run build
```

#### 2. 上传到 COS

使用腾讯云 COS 控制台或 CLI 工具上传 `dist/portal/` 目录的内容。

#### 3. 刷新 CDN

在 EdgeOne 控制台手动刷新 CDN 缓存。

---

## ⚙️ EdgeOne 配置建议

### 构建配置

- **Node.js 版本**：18 或更高
- **包管理器**：npm
- **构建命令**：`npm run build`
- **输出目录**：`dist/portal`

### 缓存配置

建议的缓存规则：

| 文件类型 | 缓存时间 | 说明 |
|---------|---------|------|
| HTML 文件 | 5 分钟 | 确保内容及时更新 |
| JS/CSS 文件 | 1 年 | 文件名包含哈希值，可长期缓存 |
| 图片文件 | 1 个月 | 静态资源 |
| 字体文件 | 1 年 | 很少变化 |

### HTTPS 配置

1. 在 EdgeOne 控制台申请或上传 SSL 证书
2. 开启强制 HTTPS 跳转
3. 启用 HTTP/2 和 HTTP/3

---

## 📊 构建优化

### 增量构建

系统会自动检测文件变更，只构建修改过的课程，大幅减少构建时间。

### 构建缓存

GitHub Actions 会缓存 `.buildcache` 目录，加速后续构建。

---

## 🐛 故障排查

### 构建失败

1. 检查 Node.js 版本是否为 18+
2. 检查课程元数据格式是否正确
3. 查看 EdgeOne 构建日志

### 部署后 404

1. 确认输出目录配置为 `dist/portal`
2. 检查 CDN 缓存是否已刷新
3. 确认所有课程都已成功构建

### 课程内容未更新

1. 清除浏览器缓存
2. 在 EdgeOne 控制台刷新 CDN 缓存
3. 检查是否触发了新的构建

---

## 📝 最佳实践

1. **提交前测试**：运行 `npm run build` 确保构建成功
2. **增量更新**：只修改需要更新的课程，利用增量构建
3. **监控构建**：关注 EdgeOne 构建日志，及时发现问题
4. **定期清理**：定期清理旧的构建缓存
