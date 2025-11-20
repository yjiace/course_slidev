# 贡献指南

感谢你考虑为本项目做出贡献！

## 🚀 快速开始

1. **Fork 本仓库**
2. **克隆到本地**
   ```bash
   git clone https://github.com/YOUR_USERNAME/courseware-system.git
   cd courseware-system
   ```
3. **安装依赖**
   ```bash
   npm install
   ```
4. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 贡献类型

### 添加新课程

1. 在 `courses/` 目录下创建课程文件夹
2. 创建 `slides.md` 文件
3. 填写完整的元数据
4. 本地预览测试
5. 提交 Pull Request

**课程质量标准**：
- ✅ 元数据完整（title, category, tags, description）
- ✅ 内容结构清晰
- ✅ 代码示例可运行
- ✅ 无拼写和语法错误
- ✅ 图片大小合理（< 500KB）

### 修复 Bug

1. 在 Issues 中描述问题
2. 创建修复分支
3. 编写测试（如适用）
4. 提交 Pull Request

### 改进文档

1. 找到需要改进的文档
2. 进行修改
3. 确保格式正确
4. 提交 Pull Request

### 添加新功能

1. 先在 Issues 中讨论
2. 获得维护者同意后开始开发
3. 遵循现有代码风格
4. 添加必要的文档
5. 提交 Pull Request

## 🔧 开发流程

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 预览单个课程
npx slidev courses/frontend/your-course/slides.md
```

### 测试构建

```bash
# 测试完整构建流程
npm run build:test

# 智能构建
npm run build:smart
```

### 代码检查

```bash
# 检查代码格式（如果配置了）
npm run lint

# 运行测试（如果有）
npm test
```

## 📋 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）**：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**：
```
feat(courses): 添加 React Hooks 课程

- 添加 useState 和 useEffect 示例
- 包含实践练习
- 添加封面图片

Closes #123
```

## 🎯 Pull Request 流程

1. **确保代码质量**
   - 通过所有测试
   - 遵循代码规范
   - 无明显错误

2. **更新文档**
   - 如果添加新功能，更新 README.md
   - 如果修改 API，更新相关文档

3. **描述清晰**
   - 说明改动内容
   - 解释为什么需要这个改动
   - 列出相关 Issue

4. **等待审核**
   - 维护者会尽快审核
   - 根据反馈进行修改
   - 获得批准后合并

## 📖 代码风格

### JavaScript/Node.js

- 使用 ES6+ 语法
- 使用 2 空格缩进
- 使用单引号
- 添加必要的注释
- 函数和变量命名清晰

### Markdown

- 使用标准 Markdown 语法
- 代码块指定语言
- 链接使用相对路径
- 图片添加 alt 文本

### 课程内容

- 使用 Slidev 语法
- 代码示例完整可运行
- 适当使用布局和主题
- 保持风格一致

## 🐛 报告 Bug

在 Issues 中报告 Bug 时，请包含：

1. **问题描述**：清晰描述问题
2. **复现步骤**：如何触发问题
3. **预期行为**：应该发生什么
4. **实际行为**：实际发生了什么
5. **环境信息**：
   - 操作系统
   - Node.js 版本
   - 浏览器版本（如适用）
6. **截图/日志**：如果有的话

## 💡 功能建议

在 Issues 中提出功能建议时，请包含：

1. **功能描述**：想要什么功能
2. **使用场景**：为什么需要这个功能
3. **替代方案**：考虑过的其他方案
4. **额外信息**：任何相关的参考资料

## 📞 获取帮助

如果你有任何问题：

1. 查看 [README.md](./README.md)
2. 查看 [QUICKSTART.md](./QUICKSTART.md)
3. 搜索现有 Issues
4. 创建新 Issue 提问

## 🙏 致谢

感谢所有贡献者！你们的贡献让这个项目变得更好。

## 📄 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。
