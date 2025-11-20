import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import crypto from 'crypto'
import { execSync } from 'child_process'
import { scanCourses } from './scan-courses-simple.js'

const EXPORTS_DIR = 'dist/portal/exports'
const CACHE_DIR = '.buildcache'
const CACHE_FILE = path.join(CACHE_DIR, 'cache.json')
const EXPORT_CACHE_FILE = path.join(CACHE_DIR, 'export-cache.json')

/**
 * 计算文件哈希
 */
function calculateFileHash(filePath) {
  try {
    const content = fsSync.readFileSync(filePath, 'utf-8')
    return crypto.createHash('md5').update(content).digest('hex')
  } catch (error) {
    console.warn(`无法计算文件哈希: ${filePath}`, error.message)
    return null
  }
}

/**
 * 读取构建缓存
 */
function readBuildCache() {
  try {
    if (fsSync.existsSync(CACHE_FILE)) {
      const content = fsSync.readFileSync(CACHE_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.warn('读取构建缓存失败', error.message)
  }
  
  return {
    version: '1.0.0',
    timestamp: Date.now(),
    courses: {}
  }
}

/**
 * 读取导出缓存
 */
function readExportCache() {
  try {
    if (fsSync.existsSync(EXPORT_CACHE_FILE)) {
      const content = fsSync.readFileSync(EXPORT_CACHE_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.warn('读取导出缓存失败', error.message)
  }
  
  return {
    version: '1.0.0',
    timestamp: Date.now(),
    exports: {}
  }
}

/**
 * 写入导出缓存
 */
function writeExportCache(cache) {
  try {
    if (!fsSync.existsSync(CACHE_DIR)) {
      fsSync.mkdirSync(CACHE_DIR, { recursive: true })
    }
    
    fsSync.writeFileSync(EXPORT_CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8')
  } catch (error) {
    console.error('写入导出缓存失败:', error.message)
  }
}

/**
 * 检查导出文件是否需要更新
 */
function needsExport(coursePath, courseId, exportCache) {
  const hash = calculateFileHash(coursePath)
  
  if (!hash) {
    return true // 无法计算哈希，需要导出
  }
  
  const cached = exportCache.exports[courseId]
  
  if (!cached || cached.hash !== hash) {
    return true // 缓存不存在或哈希不匹配
  }
  
  // 检查导出文件是否存在
  const pdfPath = path.join(EXPORTS_DIR, `${courseId}.pdf`)
  const mdPath = path.join(EXPORTS_DIR, `${courseId}.md`)
  
  if (!fsSync.existsSync(pdfPath) || !fsSync.existsSync(mdPath)) {
    return true // 导出文件不存在
  }
  
  return false
}

/**
 * 增量生成导出文件
 */
async function incrementalExports(options = {}) {
  const { force = false, verbose = false } = options
  
  console.log('📥 开始增量生成导出文件...\n')
  
  if (force) {
    console.log('⚠️  强制全量导出模式\n')
  }
  
  const startTime = Date.now()
  
  try {
    // 创建导出目录
    await fs.mkdir(EXPORTS_DIR, { recursive: true })
    
    // 读取缓存
    const buildCache = readBuildCache()
    const exportCache = readExportCache()
    
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
    
    let exportedCount = 0
    let skippedCount = 0
    let failedCount = 0
    const results = []
    
    // 为每门课程生成导出文件
    for (const course of courses) {
      const courseFile = path.resolve(process.cwd(), course.path)
      const courseId = course.id
      
      // 检查是否需要导出
      const needsUpdate = force || needsExport(courseFile, courseId, exportCache)
      
      if (!needsUpdate) {
        console.log(`⚡ 跳过导出: ${course.title}（无变更）`)
        skippedCount++
        results.push({
          id: courseId,
          title: course.title,
          status: 'skipped'
        })
        continue
      }
      
      console.log(`📦 导出课程: ${course.title}`)
      
      const exportStartTime = Date.now()
      let mdSuccess = false
      let pdfSuccess = false
      
      // 生成 MD 文件（直接复制）
      try {
        const mdOutput = path.join(EXPORTS_DIR, `${courseId}.md`)
        await fs.copyFile(courseFile, mdOutput)
        console.log(`  ✓ MD 文件已生成`)
        mdSuccess = true
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
            stdio: verbose ? 'inherit' : 'pipe',
            cwd: process.cwd()
          }
        )
        
        console.log(`  ✓ PDF 文件已生成`)
        pdfSuccess = true
      } catch (error) {
        console.error(`  ✗ PDF 生成失败:`, error.message)
        failedCount++
      }
      
      const exportDuration = Date.now() - exportStartTime
      
      // 如果至少有一个格式成功，更新缓存
      if (mdSuccess || pdfSuccess) {
        exportCache.exports[courseId] = {
          hash: calculateFileHash(courseFile),
          exportTime: Date.now(),
          mdSuccess,
          pdfSuccess
        }
        exportedCount++
        results.push({
          id: courseId,
          title: course.title,
          status: 'exported',
          duration: exportDuration
        })
      } else {
        results.push({
          id: courseId,
          title: course.title,
          status: 'failed'
        })
      }
      
      console.log('')
    }
    
    // 写入导出缓存
    exportCache.timestamp = Date.now()
    writeExportCache(exportCache)
    
    // 输出统计
    const totalDuration = Date.now() - startTime
    
    console.log('='.repeat(60))
    console.log('增量导出完成！')
    console.log(`  总计: ${courses.length} 门课程`)
    console.log(`  导出: ${exportedCount} 门`)
    console.log(`  跳过: ${skippedCount} 门`)
    console.log(`  失败: ${failedCount} 门`)
    console.log(`  耗时: ${(totalDuration / 1000).toFixed(2)}s`)
    console.log('='.repeat(60))
    
    if (failedCount > 0) {
      console.log(`\n⚠️  有 ${failedCount} 门课程导出失败，但构建将继续`)
    }
    
    return {
      total: courses.length,
      exported: exportedCount,
      skipped: skippedCount,
      failed: failedCount,
      duration: totalDuration,
      courses: results
    }
    
  } catch (error) {
    console.error('❌ 增量导出失败:', error)
    process.exit(1)
  }
}

// 执行增量导出
const args = process.argv.slice(2)
const force = args.includes('--force')
const verbose = args.includes('--verbose')

incrementalExports({ force, verbose })
