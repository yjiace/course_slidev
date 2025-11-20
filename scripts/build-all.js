import { execSync } from 'child_process'

console.log('🚀 开始完整构建流程...\n')

try {
  // 1. 构建 VitePress 门户
  console.log('📦 步骤 1/3: 构建 VitePress 门户...')
  execSync('vitepress build portal', { stdio: 'inherit' })
  console.log('✅ VitePress 门户构建完成\n')
  
  // 2. 构建 Slidev 课程
  console.log('📦 步骤 2/3: 构建 Slidev 课程...')
  execSync('node scripts/incremental-build.js --force', { stdio: 'inherit' })
  console.log('✅ Slidev 课程构建完成\n')
  
  // 3. 生成导出文件
  console.log('📦 步骤 3/3: 生成课程导出文件...')
  execSync('node scripts/build-exports.js', { stdio: 'inherit' })
  console.log('✅ 导出文件生成完成\n')
  
  console.log('🎉 构建完成！')
} catch (error) {
  console.error('❌ 构建失败:', error.message)
  process.exit(1)
}
