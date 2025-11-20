import express from 'express'
import path from 'path'
import { jobQueue } from '../services/JobQueue.js'
import { exportService } from '../services/ExportService.js'
import { exportConfig } from '../config/export.config.js'

const router = express.Router()

/**
 * POST /api/export
 * 创建导出任务
 */
router.post('/', async (req, res) => {
  try {
    const { coursePath, format, courseId } = req.body

    // 验证请求参数
    if (!coursePath || !format || !courseId) {
      return res.status(400).json({
        success: false,
        error: '缺少必需参数: coursePath, format, courseId'
      })
    }

    // 创建导出任务
    const job = await exportService.createExportJob(courseId, coursePath, format)

    res.json({
      success: true,
      message: '导出任务已创建',
      jobId: job.id,
      job: job.toJSON()
    })

  } catch (error) {
    console.error('创建导出任务失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '服务器内部错误'
    })
  }
})

/**
 * GET /api/export/status/:jobId
 * 查询导出任务状态
 */
router.get('/status/:jobId', (req, res) => {
  try {
    const { jobId } = req.params
    const job = jobQueue.getJob(jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      })
    }

    res.json({
      success: true,
      job: job.toJSON()
    })

  } catch (error) {
    console.error('查询任务状态失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
})

/**
 * GET /api/export/download/:filename
 * 下载导出文件
 */
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params
    
    // 验证文件名（防止路径遍历攻击）
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        error: '无效的文件名'
      })
    }

    const filePath = path.join(exportConfig.outputDir, filename)

    // 检查文件是否存在
    try {
      await import('fs/promises').then(fs => fs.access(filePath))
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: '文件不存在'
      })
    }

    // 设置响应头
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Type', 'application/octet-stream')

    // 发送文件
    res.sendFile(filePath, (error) => {
      if (error) {
        console.error('文件发送失败:', error)
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: '文件下载失败'
          })
        }
      }
    })

  } catch (error) {
    console.error('文件下载失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
})

/**
 * DELETE /api/export/:jobId
 * 取消导出任务
 */
router.delete('/:jobId', (req, res) => {
  try {
    const { jobId } = req.params
    const job = exportService.cancelJob(jobId)

    res.json({
      success: true,
      message: '任务已取消',
      job: job.toJSON()
    })

  } catch (error) {
    console.error('取消任务失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '服务器内部错误'
    })
  }
})

export default router
