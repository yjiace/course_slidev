import { ExportErrorType, ErrorMessages } from '../config/export.config.js'

/**
 * 导出错误类
 */
export class ExportError extends Error {
  constructor(type, details = null) {
    super(ErrorMessages[type] || '未知错误')
    this.type = type
    this.details = details
    this.name = 'ExportError'
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      details: this.details
    }
  }
}

/**
 * 创建导出错误
 */
export function createExportError(type, details = null) {
  return new ExportError(type, details)
}

/**
 * 错误处理中间件
 */
export function errorHandler(err, req, res, next) {
  console.error('错误:', err)

  // 如果是导出错误
  if (err instanceof ExportError) {
    return res.status(400).json({
      success: false,
      error: err.message,
      type: err.type,
      details: err.details
    })
  }

  // 其他错误
  res.status(500).json({
    success: false,
    error: err.message || '服务器内部错误'
  })
}

/**
 * 验证导出格式
 */
export function validateFormat(format) {
  const validFormats = ['pdf', 'pptx', 'png', 'md']
  if (!validFormats.includes(format)) {
    throw createExportError(ExportErrorType.UNSUPPORTED_FORMAT)
  }
  return true
}

/**
 * 验证课程路径
 */
export function validateCoursePath(coursePath) {
  // 检查路径遍历攻击
  if (coursePath.includes('..') || coursePath.startsWith('/')) {
    throw createExportError(ExportErrorType.INVALID_PATH)
  }

  // 检查是否是 slides.md 文件
  if (!coursePath.endsWith('slides.md')) {
    throw createExportError(ExportErrorType.INVALID_PATH, '路径必须指向 slides.md 文件')
  }

  return true
}

/**
 * 处理超时错误
 */
export function handleTimeout(job) {
  if (job.process) {
    job.process.kill()
  }
  throw createExportError(ExportErrorType.TIMEOUT)
}

/**
 * 处理文件系统错误
 */
export function handleFileSystemError(error) {
  if (error.code === 'ENOENT') {
    throw createExportError(ExportErrorType.FILE_NOT_FOUND)
  } else if (error.code === 'EACCES') {
    throw createExportError(ExportErrorType.PERMISSION_DENIED)
  } else if (error.code === 'ENOSPC') {
    throw createExportError(ExportErrorType.DISK_FULL)
  } else {
    throw createExportError(ExportErrorType.EXPORT_FAILED, error.message)
  }
}
