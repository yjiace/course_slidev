import fs from 'fs/promises'
import path from 'path'
import { scanCourses } from './scan-courses-simple.js'

const EXPORTS_DIR = 'dist/portal/exports'
const FORMATS = ['pdf', 'md']

/**
 * 验证导出文件是否存在
 */
async function verifyExports() {
  console.log('🔍 验证导出文件...\n')
  
  try {
    // 检查导出目录是否存在
    try {
      await fs.access(EXPORTS_DIR)
      console.log('✓ 导出目录存在:', EXPORTS_DIR)
    } catch (error) {
      console.log('✗ 导出目录不存在:', EXPORTS_DIR)
      console.log('  请先运行 npm run build 生成导出文件')
      return
    }
    
    console.log('')
    
    // 扫描所有课程
    const coursesDir = path.resolve(process.cwd(), 'courses')
    const courses = await scanCourses({
      baseDir: coursesDir,
      exclude: ['node_modules', 'dist', '.git', '.buildcache']
    })
    
    if (courses.length === 0) {
      console.log('⚠️  没有找到课程')
      return
    }
    
    console.log(`找到 ${courses.length} 门课程\n`)
    
    let totalFiles = 0
    let existingFiles = 0
    let missingFiles = 0
    
    // 检查每门课程的导出文件
    for (const course of courses) {
      console.log(`📦 ${course.title} (${course.id})`)
      
      for (const format of FORMATS) {
        totalFiles++
        const filename = `${course.id}.${format}`
        const filePath = path.join(EXPORTS_DIR, filename)
        
        try {
          const stats = await fs.stat(filePath)
          const sizeKB = (stats.size / 1024).toFixed(2)
          console.log(`  ✓ ${format.toUpperCase()}: ${filename} (${sizeKB} KB)`)
          existingFiles++
        } catch (error) {
          console.log(`  ✗ ${format.toUpperCase()}: ${filename} (缺失)`)
          missingFiles++
        }
      }
      
      console.log('')
    }
    
    // 输出统计
    console.log('='.repeat(60))
    console.log('验证结果:')
    console.log(`  总计: ${totalFiles} 个文件`)
    console.log(`  存在: ${existingFiles} 个`)
    console.log(`  缺失: ${missingFiles} 个`)
    
    if (missingFiles === 0) {
      console.log('\n✅ 所有导出文件都已生成！')
    } else {
      console.log(`\n⚠️  有 ${missingFiles} 个文件缺失，请重新构建`)
    }
    
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ 验证失败:', error)
  }
}

verifyExports()
