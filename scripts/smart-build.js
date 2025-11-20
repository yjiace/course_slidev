import { execSync } from 'child_process'
import fs from 'fs'

/**
 * 智能构建脚本
 * 根据 git 变更类型自动选择构建策略：
 * - 只有课程变更 → 增量构建（快速）
 * - 门户或脚本变更 → 完整构建
 * - 无相关变更 → 仅构建门户
 */

console.log('🧠 智能构建调度器启动...\n')

try {
  // 检测是否在 git 仓库中
  let changedFiles = ''
  let isGitRepo = true
  
  try {
    // 尝试获取变更的文件列表
    changedFiles = execSync('git diff --name-only HEAD~1 HEAD', { 
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim()
  } catch (error) {
    console.log('⚠️  无法检测 git 变更（可能是首次构建或非 git 环境）')
    console.log('   将执行完整构建\n')
    isGitRepo = false
  }
  
  // 如果不是 git 仓库或无法获取变更，执行完整构建
  if (!isGitRepo || !changedFiles) {
    console.log('📦 执行完整构建（无变更信息）\n')
    execSync('node scripts/build-all.js', { stdio: 'inherit' })
    process.exit(0)
  }
  
  // 分析变更的文件
  const changedFilesList = changedFiles.split('\n').filter(f => f.trim())
  
  console.log('📋 检测到以下文件变更:')
  changedFilesList.forEach(file => console.log(`   - ${file}`))
  console.log('')
  
  // 检查变更类型
  const hasPortalChanges = changedFilesList.some(f => f.startsWith('portal/'))
  const hasScriptChanges = changedFilesList.some(f => f.startsWith('scripts/'))
  const hasCourseChanges = changedFilesList.some(f => f.startsWith('courses/'))
  const hasPackageChanges = changedFilesList.some(f => f === 'package.json' || f === 'package-lock.json')
  
  // 决策逻辑
  if (hasPortalChanges || hasScriptChanges || hasPackageChanges) {
    // 门户、脚本或依赖变更 → 完整构建
    console.log('🔄 检测到门户/脚本/依赖变更')
    console.log('   策略: 完整构建（所有课程）\n')
    
    execSync('node scripts/build-all.js', { stdio: 'inherit' })
    
  } else if (hasCourseChanges) {
    // 仅课程变更 → 增量构建
    console.log('⚡ 检测到仅课程文件变更')
    console.log('   策略: 增量构建（仅变更的课程）\n')
    
    // 1. 构建 VitePress 门户
    console.log('📦 步骤 1/3: 构建 VitePress 门户...')
    execSync('npx vitepress build portal', { stdio: 'inherit' })
    console.log('✅ VitePress 门户构建完成\n')
    
    // 2. 增量构建 Slidev 课程
    console.log('📦 步骤 2/3: 增量构建 Slidev 课程...')
    execSync('node scripts/incremental-build.js', { stdio: 'inherit' })
    console.log('✅ Slidev 课程增量构建完成\n')
    
    // 3. 增量生成导出文件
    console.log('📦 步骤 3/3: 增量生成导出文件...')
    execSync('node scripts/incremental-exports.js', { stdio: 'inherit' })
    console.log('✅ 导出文件生成完成\n')
    
  } else {
    // 无相关变更 → 仅构建门户
    console.log('ℹ️  未检测到课程、门户或脚本变更')
    console.log('   策略: 仅构建门户\n')
    
    console.log('📦 构建 VitePress 门户...')
    execSync('npx vitepress build portal', { stdio: 'inherit' })
    console.log('✅ VitePress 门户构建完成\n')
  }
  
  console.log('🎉 智能构建完成！')
  
} catch (error) {
  console.error('❌ 智能构建失败:', error.message)
  process.exit(1)
}
