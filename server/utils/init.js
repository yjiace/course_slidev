import fs from 'fs/promises'
import { exportConfig } from '../config/export.config.js'

/**
 * 初始化导出服务所需的目录
 */
export async function initializeDirectories() {
  try {
    // 创建导出输出目录
    await fs.mkdir(exportConfig.outputDir, { recursive: true })
    console.log(`✓ 导出目录已创建: ${exportConfig.outputDir}`)

    // 创建 .gitignore 文件，忽略导出的文件
    const gitignorePath = `${exportConfig.outputDir}/.gitignore`
    await fs.writeFile(gitignorePath, '*\n!.gitignore\n')
    console.log(`✓ .gitignore 已创建`)

    return true
  } catch (error) {
    console.error('❌ 初始化目录失败:', error)
    return false
  }
}
