import { spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { 
  exportConfig, 
  ExportFormat, 
  ExportStatus,
  ExportErrorType,
  ErrorMessages 
} from '../config/export.config.js'
import { ExportJob } from '../models/ExportJob.js'
import { jobQueue } from './JobQueue.js'
import { 
  createExportError, 
  validateFormat, 
  validateCoursePath,
  handleFileSystemError,
  handleTimeout
} from '../utils/errorHandler.js'

/**
 * 导出服务类
 * 负责执行实际的导出操作
 */
export class ExportService {
  /**
   * 创建导出任务
   */
  async createExportJob(courseId, coursePath, format) {
    try {
      // 验证格式
      validateFormat(format)

      // 验证课程路径
      validateCoursePath(coursePath)

      // 检查文件是否存在
      const fullPath = path.join(exportConfig.coursesDir, coursePath)
      try {
        await fs.access(fullPath)
      } catch (error) {
        handleFileSystemError(error)
      }

      // 创建任务
      const job = new ExportJob({
        courseId,
        coursePath,
        format
      })

      // 添加到队列
      jobQueue.addJob(job)

      // 如果可以执行，立即开始
      if (jobQueue.canExecute()) {
        this.executeJob(job)
      }

      return job
    } catch (error) {
      // 如果是我们的错误类型，直接抛出
      if (error.name === 'ExportError') {
        throw error
      }
      // 否则包装为导出错误
      throw createExportError(ExportErrorType.EXPORT_FAILED, error.message)
    }
  }

  /**
   * 执行导出任务
   */
  async executeJob(job) {
    try {
      jobQueue.markActive(job.id)
      job.updateStatus(ExportStatus.PROCESSING)

      console.log(`开始导出: ${job.courseId} (${job.format})`)

      let outputPath

      // 根据格式选择处理方式
      if (job.format === ExportFormat.MD) {
        // MD 格式直接复制文件
        outputPath = await this.exportMarkdown(job)
      } else {
        // 其他格式使用 Slidev CLI
        outputPath = await this.exportWithSlidev(job)
      }

      // 更新任务状态
      job.updateStatus(ExportStatus.COMPLETE, { outputPath })
      console.log(`✓ 导出完成: ${job.courseId} -> ${outputPath}`)

    } catch (error) {
      console.error(`❌ 导出失败: ${job.courseId}`, error)
      job.updateStatus(ExportStatus.ERROR, { 
        error: error.message || ErrorMessages[ExportErrorType.EXPORT_FAILED]
      })
    } finally {
      jobQueue.markComplete(job.id)
    }
  }

  /**
   * 使用 Slidev CLI 导出
   */
  async exportWithSlidev(job) {
    return new Promise((resolve, reject) => {
      const inputPath = path.join(exportConfig.coursesDir, job.coursePath)
      const outputFilename = this.generateOutputFilename(job)
      const outputPath = path.join(exportConfig.outputDir, outputFilename)

      // 构建 Slidev 命令
      const args = [
        'export',
        inputPath,
        '--format', job.format,
        '--output', outputPath
      ]

      console.log(`执行命令: npx slidev ${args.join(' ')}`)

      // 启动子进程
      const process = spawn('npx', ['slidev', ...args], {
        stdio: 'pipe',
        shell: true
      })

      job.process = process

      let stdout = ''
      let stderr = ''

      process.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      process.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      // 设置超时
      const timeout = setTimeout(() => {
        process.kill()
        reject(createExportError(ExportErrorType.TIMEOUT))
      }, exportConfig.timeout)

      process.on('close', (code) => {
        clearTimeout(timeout)

        if (code === 0) {
          resolve(outputFilename)
        } else {
          console.error('Slidev 导出错误:', stderr)
          reject(createExportError(ExportErrorType.EXPORT_FAILED, stderr))
        }
      })

      process.on('error', (error) => {
        clearTimeout(timeout)
        console.error('进程错误:', error)
        reject(createExportError(ExportErrorType.EXPORT_FAILED, error.message))
      })
    })
  }

  /**
   * 导出 Markdown 文件
   */
  async exportMarkdown(job) {
    try {
      const inputPath = path.join(exportConfig.coursesDir, job.coursePath)
      const outputFilename = this.generateOutputFilename(job)
      const outputPath = path.join(exportConfig.outputDir, outputFilename)

      // 直接复制文件
      await fs.copyFile(inputPath, outputPath)

      return outputFilename
    } catch (error) {
      handleFileSystemError(error)
    }
  }

  /**
   * 生成输出文件名
   */
  generateOutputFilename(job) {
    const timestamp = Date.now()
    const sanitizedId = job.courseId.replace(/[^a-zA-Z0-9-]/g, '_')
    
    // 根据格式确定文件扩展名
    let extension = job.format
    if (job.format === ExportFormat.PPTX) {
      extension = 'pptx'
    }
    
    return `${sanitizedId}_${timestamp}.${extension}`
  }

  /**
   * 获取任务状态
   */
  getJobStatus(jobId) {
    return jobQueue.getJob(jobId)
  }

  /**
   * 取消任务
   */
  cancelJob(jobId) {
    const job = jobQueue.getJob(jobId)
    
    if (!job) {
      throw new Error('任务不存在')
    }

    if (job.process) {
      job.process.kill()
    }

    job.updateStatus(ExportStatus.ERROR, { error: '任务已取消' })
    jobQueue.markComplete(jobId)

    return job
  }
}

// 导出单例实例
export const exportService = new ExportService()
