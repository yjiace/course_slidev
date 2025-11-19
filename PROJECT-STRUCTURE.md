# 项目结构说明

```
courseware-system/
├── courses/                        # 课程目录
│   ├── frontend/                   # 前端开发教研室
│   │   └── vue-basics/
│   │       └── slides.md          # Slidev 课程文件
│   ├── backend/                    # 后端开发教研室
│   │   └── nodejs-intro/
│   │       └── slides.md
│   └── devops/                     # 运维开发教研室
│       └── docker-basics/
│           └── slides.md
├── docs/                           # 文档目录
│   ├── course-guide.md            # 课程创建指南
│   └── deployment-guide.md        # 部署配置指南
├── portal/                         # VitePress 门户
│   ├── .vitepress/
│   │   ├── config.ts              # VitePress 配置
│   │   ├── theme/                 # 自定义主题
│   │   │   ├── index.ts           # 主题入口
│   │   │   ├── components/        # Vue 组件
│   │   │   │   ├── HomePage.vue   # 首页组件
│   │   │   │   ├── CourseCard.vue # 课程卡片
│   │   │   │   ├── CategoryNav.vue# 分类导航
│   │   │   │   ├── TagCloud.vue   # 标签云
│   │   │   │   └── SearchBar.vue  # 搜索栏
│   │   │   └── styles/
│   │   │       └── custom.css     # 自定义样式
│   │   └── data/
│   │       └── courses.data.ts    # 课程数据加载器
│   ├── index.md                    # 门户首页
│   └── public/                     # 静态资源
├── scripts/                        # 构建脚本
│   ├── build-all.js               # 完整构建脚本
│   ├── incremental-build.js       # 增量构建脚本
│   ├── scan-courses-simple.js     # 课程扫描器（JavaScript）
│   ├── generate-index.ts          # 索引生成器（TypeScript）
│   └── scan-courses.ts            # 课程扫描器（TypeScript）
├── dist/                           # 构建输出（自动生成）
│   └── portal/
│       ├── index.html             # 门户首页
│       └── courses/               # 构建后的课程
├── .buildcache/                    # 构建缓存（自动生成）
├── .gitignore                      # Git 忽略配置
├── .vscode/
│   └── extensions.json            # VS Code 扩展推荐
├── package.json                    # 项目配置
├── tsconfig.json                   # TypeScript 配置
├── README.md                       # 项目说明
├── USAGE.md                        # 使用指南
└── PROJECT-STRUCTURE.md            # 本文件
```

## 核心文件说明

### 配置文件

- **package.json** - 项目依赖和脚本配置
- **tsconfig.json** - TypeScript 编译配置
- **.gitignore** - Git 忽略规则
- **.vscode/extensions.json** - VS Code 扩展推荐

### 门户相关

- **portal/.vitepress/config.ts** - VitePress 配置（站点信息、主题、搜索等）
- **portal/.vitepress/theme/** - 自定义主题和组件
- **portal/.vitepress/data/courses.data.ts** - 课程数据加载器（自动扫描课程）

### 构建脚本

- **scripts/build-all.js** - 完整构建流程（门户 + 课程）
- **scripts/incremental-build.js** - 增量构建（只构建修改的课程）
- **scripts/scan-courses-simple.js** - 课程扫描（JavaScript，供构建脚本使用）
- **scripts/scan-courses.ts** - 课程扫描（TypeScript，供 VitePress 使用）
- **scripts/generate-index.ts** - 索引生成（分类、标签统计）

### 课程目录

- **courses/** - 所有课程的根目录
- **courses/{教研室}/{课程名}/slides.md** - Slidev 课程文件

### 文档

- **README.md** - 项目介绍和快速开始
- **USAGE.md** - 详细使用指南
- **docs/course-guide.md** - 课程创建指南
- **docs/deployment-guide.md** - 部署配置指南

## 工作流程

### 开发流程

1. 创建课程：在 `courses/` 下创建 `slides.md`
2. 实时预览：`npx slidev courses/{path}/slides.md`
3. 自动发现：课程自动出现在门户列表

### 构建流程

1. 扫描课程：`scan-courses-simple.js` 扫描所有课程
2. 生成索引：`generate-index.ts` 生成分类和标签索引
3. 构建门户：VitePress 构建门户网站
4. 构建课程：Slidev 构建每个课程的静态文件
5. 增量优化：只构建修改过的课程

### 部署流程

1. 推送代码到 Git 仓库
2. EdgeOne 通过 Webhook 自动拉取代码
3. EdgeOne 执行构建命令（`npm run build`）
4. 自动部署到 CDN 并刷新缓存
