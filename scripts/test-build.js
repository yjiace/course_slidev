import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

/**
 * 本地测试构建脚本
 * 模拟 GitHub Actions 的构建流程，用于推送前验证
 */

console.log('🧪 开始本地测试构建...\n')
console.log('此脚本模拟 GitHub Actions 的构建流程\n')

const startTime = Date.now()
let hasErrors = false

try {
  // 步骤 1: 检查依赖
  console.log('📦 步骤 1/5: 检查依赖...')
  
  if (!fs.existsSync('node_modules')) {
    console.log('   ⚠️  node_modules 不存在，正在安装依赖...')
    execSync('npm install', { stdio: 'inherit' })
  } else {
    console.log('   ✓ 依赖已安装')
  }
  console.log('')
  
  // 步骤 2: 检查 Playwright
  console.log('📦 步骤 2/5: 检查 Playwright...')
  
  try {
    execSync('npx playwright --version', { stdio: 'pipe' })
    console.log('   ✓ Playwright 已安装')
  } catch (error) {
    console.log('   ⚠️  Playwright 未安装，正在安装...')
    console.log('   这可能需要几分钟时间...')
    execSync('npx playwright install chromium', { stdio: 'inherit' })
  }
  console.log('')
  
  // 步骤 3: 清理旧的构建产物
  console.log('📦 步骤 3/5: 清理旧的构建产物...')
  
  if (fs.existsSync('dist')) {
    console.log('   清理 dist 目录...')
    if (process.platform === 'win32') {
      execSync('rmdir /s /q dist', { stdio: 'pipe' })
    } else {
      execSync('rm -rf dist', { stdio: 'pipe' })
    }
  }
  console.log('   ✓ 清理完成')
  console.log('')
  
  // 步骤 4: 执行智能构建
  console.log('📦 步骤 4/5: 执行智能构建...')
  console.log('   (这将根据变更类型选择增量或完整构建)\n')
  
  try {
    execSync('node scripts/smart-build.js', { stdio: 'inherit' })
    console.log('\n   ✓ 构建成功')
  } catch (error) {
    console.error('\n   ✗ 构建失败')
    hasErrors = true
    throw error
  }
  console.log('')
  
  // 步骤 5: 验证构建产物
  console.log('📦 步骤 5/5: 验证构建产物...')
  
  const requiredPaths = [
    'dist/portal/index.html',
    'dist/portal/assets',
    'dist/portal/exports'
  ]
  
  let allPathsExist = true
  
  for (const requiredPath of requiredPaths) {
    if (fs.existsSync(requiredPath)) {
      console.log(`   ✓ ${requiredPath}`)
    } else {
      console.log(`   ✗ ${requiredPath} 不存在`)
      allPathsExist = false
      hasErrors = true
    }
  }
  
  if (allPathsExist) {
    console.log('   ✓ 所有必需文件都已生成')
  }
  console.log('')
  
  // 检查导出文件
  const exportsDir = 'dist/portal/exports'
  if (fs.existsSync(exportsDir)) {
    const exportFiles = fs.readdirSync(exportsDir)
    const pdfFiles = exportFiles.filter(f => f.endsWith('.pdf'))
    const mdFiles = exportFiles.filter(f => f.endsWith('.md'))
    
    console.log(`   导出文件统计:`)
    console.log(`   - PDF 文件: ${pdfFiles.length}`)
    console.log(`   - MD 文件: ${mdFiles.length}`)
    
    if (pdfFiles.length === 0) {
      console.log('   ⚠️  警告: 没有生成 PDF 文件')
      console.log('   请检查 Playwright 是否正确安装')
    }
  }
  console.log('')
  
  // 总结
  const totalDuration = Date.now() - startTime
  
  console.log('='.repeat(60))
  if (hasErrors) {
    console.log('❌ 测试构建失败')
    console.log('   请修复上述错误后再推送到 GitHub')
  } else {
    console.log('✅ 测试构建成功！')
    console.log('   构建产物已生成，可以安全推送到 GitHub')
    console.log('')
    console.log('   下一步:')
    console.log('   1. git add .')
    console.log('   2. git commit -m "your message"')
    console.log('   3. git push origin main')
  }
  console.log(`   总耗时: ${(totalDuration / 1000).toFixed(2)}s`)
  console.log('='.repeat(60))
  
  if (hasErrors) {
    process.exit(1)
  }
  
} catch (error) {
  console.error('\n❌ 测试构建失败:', error.message)
  console.log('\n请查看上述错误信息并修复后重试')
  process.exit(1)
}
