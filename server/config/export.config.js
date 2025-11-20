import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 导出服务配置
 */
export const exportConfig = {
  // 导出文件输出目录
  outputDir: path.resolve(__dirname, '../../dist/exports'),
  
  // 导出超时时间（毫秒）
  timeout: 30000, // 30 秒
  
  // 最大并发导出任务数
  maxConcurrent: 3,
  
  // 清理旧文件的间隔（毫秒）
  cleanupInterval: 3600000, // 1 小时
  
  // 文件保留时间（毫秒）
  fileRetention: 86400000, // 24 小时
  
  // 课程根目录
  coursesDir: path.resolve(__dirname, '../../courses')
}

/**
 * 导出格式枚举
 */
export const ExportFormat = {
  PDF: 'pdf',
  PPTX: 'pptx',
  PNG: 'png',
  MD: 'md'
}

/**
 * 导出格式中文标签
 */
export const ExportFormatLabels = {
  [ExportFormat.PDF]: 'PDF 文档',
  [ExportFormat.PPTX]: 'PowerPoint 演示文稿',
  [ExportFormat.PNG]: 'PNG 图片',
  [ExportFormat.MD]: 'Markdown 源文件'
}

/**
 * 导出格式图标
 */
export const ExportFormatIcons = {
  [ExportFormat.PDF]: '📄',
  [ExportFormat.PPTX]: '📊',
  [ExportFormat.PNG]: '🖼️',
  [ExportFormat.MD]: '📝'
}

/**
 * 导出状态枚举
 */
export const ExportStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  ERROR: 'error',
  TIMEOUT: 'timeout'
}

/**
 * 导出错误类型
 */
export const ExportErrorType = {
  INVALID_PATH: 'invalid_path',
  FILE_NOT_FOUND: 'file_not_found',
  EXPORT_FAILED: 'export_failed',
  TIMEOUT: 'timeout',
  UNSUPPORTED_FORMAT: 'unsupported_format',
  DISK_FULL: 'disk_full',
  PERMISSION_DENIED: 'permission_denied'
}

/**
 * 中文错误消息映射
 */
export const ErrorMessages = {
  [ExportErrorType.INVALID_PATH]: '课程路径无效，请检查课程是否存在',
  [ExportErrorType.FILE_NOT_FOUND]: '找不到课程文件，请确认课程已正确创建',
  [ExportErrorType.EXPORT_FAILED]: '导出失败，请稍后重试',
  [ExportErrorType.TIMEOUT]: '导出超时，课程内容可能过大，请稍后重试',
  [ExportErrorType.UNSUPPORTED_FORMAT]: '不支持的导出格式',
  [ExportErrorType.DISK_FULL]: '服务器磁盘空间不足，请联系管理员',
  [ExportErrorType.PERMISSION_DENIED]: '权限不足，无法执行导出操作'
}
