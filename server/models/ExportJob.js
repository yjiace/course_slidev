import { ExportStatus } from '../config/export.config.js'

/**
 * 导出任务类
 */
export class ExportJob {
  constructor(data) {
    this.id = data.id || this.generateId()
    this.courseId = data.courseId
    this.coursePath = data.coursePath
    this.format = data.format
    this.status = data.status || ExportStatus.PENDING
    this.createdAt = data.createdAt || new Date()
    this.completedAt = data.completedAt || null
    this.outputPath = data.outputPath || null
    this.error = data.error || null
    this.process = null // 子进程引用
  }

  /**
   * 生成唯一任务 ID
   */
  generateId() {
    return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 更新任务状态
   */
  updateStatus(status, data = {}) {
    this.status = status
    
    if (status === ExportStatus.COMPLETE || status === ExportStatus.ERROR || status === ExportStatus.TIMEOUT) {
      this.completedAt = new Date()
    }
    
    if (data.outputPath) {
      this.outputPath = data.outputPath
    }
    
    if (data.error) {
      this.error = data.error
    }
  }

  /**
   * 转换为 JSON 对象
   */
  toJSON() {
    return {
      id: this.id,
      courseId: this.courseId,
      coursePath: this.coursePath,
      format: this.format,
      status: this.status,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
      outputPath: this.outputPath,
      error: this.error
    }
  }
}
