import fs from 'fs/promises'
import path from 'path'
import { execSync } from 'child_process'
import { scanCourses } from './scan-courses.js'

const EXPORTS_DIR = 'dist/portal/exports'

/**
 * 为所有课程生成导出文件
 */
async function buildExports() {
  console.log('📥 开始生成课程导出文件...\n')

  const startTime = Date.now()

  try {
    // 创建导出目录
    await fs.mkdir(EXPORTS_DIR, { recursive: true })

    // 扫描所有课程
    const coursesDir = path.resolve(process.cwd(), 'courses')
    const courses = await scanCourses({
      baseDir: coursesDir,
      exclude: ['node_modules', 'dist', '.git', '.buildcache']
    })

    if (courses.length === 0) {
      console.log('⚠️  没有找到课程，跳过导出')
      return
    }

    console.log(`找到 ${courses.length} 门课程\n`)

    let successCount = 0
    let failedCount = 0

    // 为每门课程生成导出文件
    for (const course of courses) {
      console.log(`📦 处理课程: ${course.title}`)

      // course.path 已经是相对于项目根目录的路径
      const courseFile = path.resolve(process.cwd(), course.path)
      const courseId = course.id

      // 生成 MD 文件（直接复制）
      try {
        const mdOutput = path.join(EXPORTS_DIR, `${courseId}.md`)
        await fs.copyFile(courseFile, mdOutput)
        console.log(`  ✓ MD 文件已生成`)
        successCount++
      } catch (error) {
        console.error(`  ✗ MD 文件生成失败:`, error.message)
        failedCount++
      }

      // 生成 PDF 格式（单文件）
      try {
        const outputFile = path.join(EXPORTS_DIR, `${courseId}.pdf`)

        console.log(`  ⏳ 正在生成 PDF...`)

        execSync(
          `npx slidev export "${courseFile}" --format pdf --output "${outputFile}"`,
          {
            stdio: 'pipe',
            cwd: process.cwd()
          }
        )

        console.log(`  ✓ PDF 文件已生成`)
        successCount++
      } catch (error) {
        console.error(`  ✗ PDF 生成失败:`, error.message)
        failedCount++
      }

      // PPTX 和 PNG 格式会生成目录，暂时跳过
      // 如果需要这些格式，可以在导出后打包成 zip 文件

      console.log('')
    }

    const totalDuration = Date.now() - startTime

    console.log('='.repeat(60))
    console.log('导出文件生成完成！')
    console.log(`  总计: ${courses.length} 门课程`)
    console.log(`  成功: ${successCount} 个文件`)
    console.log(`  失败: ${failedCount} 个文件`)
    console.log(`  耗时: ${(totalDuration / 1000).toFixed(2)}s`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ 导出文件生成失败:', error)
    process.exit(1)
  }
}

buildExports()
