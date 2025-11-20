import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import exportRouter from './routes/export.js'
import { startCleanupScheduler } from './services/cleanup.js'
import { initializeDirectories } from './utils/init.js'
import { errorHandler } from './utils/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 请求日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// 静态文件服务 - 用于下载导出的文件
app.use('/exports', express.static(path.join(__dirname, '../dist/exports')))

// API 路由
app.use('/api/export', exportRouter)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '导出服务运行正常' })
})

// 错误处理中间件（必须放在最后）
app.use(errorHandler)

// 启动服务器
app.listen(PORT, async () => {
  console.log(`✓ 导出服务已启动: http://localhost:${PORT}`)
  console.log(`✓ 导出文件目录: dist/exports`)
  
  // 初始化目录
  await initializeDirectories()
  
  // 启动定时清理任务
  startCleanupScheduler()
})

export default app
