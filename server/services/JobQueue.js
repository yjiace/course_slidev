import { exportConfig } from '../config/export.config.js'

/**
 * 导出任务队列管理器
 * 负责管理并发任务和任务状态
 */
export class JobQueue {
  constructor() {
    this.jobs = new Map() // 所有任务
    this.activeJobs = new Set() // 正在执行的任务
    this.maxConcurrent = exportConfig.maxConcurrent
  }

  /**
   * 添加任务到队列
   */
  addJob(job) {
    this.jobs.set(job.id, job)
    console.log(`✓ 任务已添加到队列: ${job.id} (${job.format})`)
    return job
  }

  /**
   * 获取任务
   */
  getJob(jobId) {
    return this.jobs.get(jobId)
  }

  /**
   * 检查是否可以执行新任务
   */
  canExecute() {
    return this.activeJobs.size < this.maxConcurrent
  }

  /**
   * 标记任务为活动状态
   */
  markActive(jobId) {
    this.activeJobs.add(jobId)
    console.log(`✓ 任务开始执行: ${jobId} (活动任务: ${this.activeJobs.size}/${this.maxConcurrent})`)
  }

  /**
   * 标记任务为完成状态
   */
  markComplete(jobId) {
    this.activeJobs.delete(jobId)
    console.log(`✓ 任务执行完成: ${jobId} (活动任务: ${this.activeJobs.size}/${this.maxConcurrent})`)
  }

  /**
   * 移除任务
   */
  removeJob(jobId) {
    this.activeJobs.delete(jobId)
    this.jobs.delete(jobId)
    console.log(`✓ 任务已移除: ${jobId}`)
  }

  /**
   * 获取所有任务
   */
  getAllJobs() {
    return Array.from(this.jobs.values())
  }

  /**
   * 获取活动任务数量
   */
  getActiveCount() {
    return this.activeJobs.size
  }

  /**
   * 清理旧任务
   */
  cleanupOldJobs(retentionTime) {
    const now = Date.now()
    let cleanedCount = 0

    for (const [jobId, job] of this.jobs.entries()) {
      if (job.completedAt) {
        const age = now - job.completedAt.getTime()
        if (age > retentionTime) {
          this.removeJob(jobId)
          cleanedCount++
        }
      }
    }

    if (cleanedCount > 0) {
      console.log(`✓ 清理了 ${cleanedCount} 个旧任务`)
    }

    return cleanedCount
  }
}

// 导出单例实例
export const jobQueue = new JobQueue()
