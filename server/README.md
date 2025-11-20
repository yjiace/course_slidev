# 导出服务

课件导出后端服务，提供 Slidev 课件的多格式导出功能。

## 功能

- 支持 PDF、PPTX、PNG、MD 四种导出格式
- 任务队列管理，支持并发控制
- 自动清理过期文件
- 中文错误消息
- RESTful API 接口

## 安装依赖

```bash
npm install
```

## 启动服务

### 仅启动导出服务
```bash
npm run dev:server
```

### 同时启动门户和导出服务
```bash
npm run dev:all
```

## API 端点

### 创建导出任务
```
POST /api/export
Content-Type: application/json

{
  "coursePath": "courses/frontend/vue-basics/slides.md",
  "format": "pdf",
  "courseId": "frontend-vue-basics"
}
```

### 查询任务状态
```
GET /api/export/status/:jobId
```

### 下载文件
```
GET /api/export/download/:filename
```

### 健康检查
```
GET /health
```

## 配置

配置文件位于 `server/config/export.config.js`

- `outputDir`: 导出文件输出目录
- `timeout`: 导出超时时间（默认 30 秒）
- `maxConcurrent`: 最大并发任务数（默认 3）
- `cleanupInterval`: 清理间隔（默认 1 小时）
- `fileRetention`: 文件保留时间（默认 24 小时）

## 目录结构

```
server/
├── config/           # 配置文件
├── models/           # 数据模型
├── routes/           # API 路由
├── services/         # 业务逻辑
├── utils/            # 工具函数
└── index.js          # 服务入口
```
