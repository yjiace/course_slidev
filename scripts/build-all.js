import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

console.log('🚀 开始完整构建流程...\n')

try {
  // 1. 构建 VitePress 门户
  console.log('📦 步骤 1/2: 构建 VitePress 门户...')
  execSync('npm run build:portal', { stdio: 'inherit' })
  console.log('✅ VitePress 门户构建完成\n')
  
  // 2. 构建 Slidev 课程
  console.log('📦 步骤 2/2: 构建 Slidev 课程...')
  execSync('node scripts/incremental-build.js --force', { stdio: 'inherit' })
  console.log('✅ Slidev 课程构建完成\n')
  
  console.log('🎉 构建完成！运行 npm run preview 预览')
} catch (error) {
  console.error('❌ 构建失败:', error.message)
  process.exit(1)
}
