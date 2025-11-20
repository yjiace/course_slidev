import fs from 'fs/promises'
import path from 'path'
import { exportConfig } from '../config/export.config.js'
import { jobQueue } from './JobQueue.js'

/**
 * 清理过期的导出文件
 */
async function cleanupExpiredFiles() {
  try {
    const outputDir = exportConfig.outputDir
    
    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true })
    
    const files = await fs.readdir(outputDir)
    const now = Date.now()
    let cleanedCount = 0

    for (const file of files) {
      const filePath = path.join(outputDir, file)
      
      try {
        const stats = await fs.stat(filePath)
        const age = now - stats.mtimeMs

        // 删除超过保留时间的文件
        if (age > exportConfig.fileRetention) {
          await fs.unlink(filePath)
          cleanedCount++
          console.log(`✓ 清理过期文件: ${file}`)
        }
      } catch (error) {
        console.warn(`⚠️  无法处理文件: ${file}`, error.message)
      }
    }

    if (cleanedCount > 0) {
      console.log(`✓ 文件清理完成，共清理 ${cleanedCount} 个文件`)
    }

    // 同时清理任务队列中的旧任务
    jobQueue.cleanupOldJobs(exportConfig.fileRetention)

  } catch (error) {
    console.error('❌ 文件清理失败:', error)
  }
}

/**
 * 启动定时清理任务
 */
export function startCleanupScheduler() {
  console.log(`✓ 启动文件清理调度器 (间隔: ${exportConfig.cleanupInterval / 1000 / 60} 分钟)`)
  
  // 立即执行一次清理
  cleanupExpiredFiles()
  
  // 定时执行清理
  setInterval(cleanupExpiredFiles, exportConfig.cleanupInterval)
}

/**
 * 手动触发清理
 */
export async function triggerCleanup() {
  console.log('✓ 手动触发文件清理')
  await cleanupExpiredFiles()
}
