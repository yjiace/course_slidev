import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { execSync } from 'child_process'
import { scanCourses } from './scan-courses-simple.js'

// 缓存文件路径
const CACHE_DIR = '.buildcache'
const CACHE_FILE = path.join(CACHE_DIR, 'cache.json')

/**
 * 计算文件哈希
 */
function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return crypto.createHash('md5').update(content).digest('hex')
  } catch (error) {
    console.warn(`无法计算文件哈希: ${filePath}`, error.message)
    return null
  }
}

/**
 * 读取构建缓存
 */
function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.warn('读取缓存失败，将进行全量构建', error.message)
  }
  
  return {
    version: '1.0.0',
    timestamp: Date.now(),
    courses: {}
  }
}

/**
 * 写入构建缓存
 */
function writeCache(cache) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true })
    }
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8')
  } catch (error) {
    console.error('写入缓存失败:', error.message)
  }
}

/**
 * 检测课程是否变更
 */
function isCourseChanged(coursePath, cache) {
  const hash = calculateFileHash(coursePath)
  
  if (!hash) {
    return true // 无法计算哈希，视为变更
  }
  
  const cached = cache.courses[coursePath]
  
  if (!cached || cached.hash !== hash) {
    return true // 缓存不存在或哈希不匹配
  }
  
  return false
}

// 继续在下一个文件中...

/**
 * 增量构建所有课程
 */
async function incrementalBuild(options = {}) {
  const { force = false, verbose = false } = options
  
  console.log('开始增量构建...\n')
  
  if (force) {
    console.log('⚠️  强制全量构建模式\n')
  }
  
  const startTime = Date.now()
  
  try {
    // 读取缓存
    const cache = readCache()
    
    // 扫描所有课程
    const coursesDir = path.resolve(process.cwd(), 'courses')
    const courses = await scanCourses({
      baseDir: coursesDir,
      exclude: ['node_modules', 'dist', '.git', '.buildcache']
    })
    
    if (courses.length === 0) {
      console.log('⚠️  没有找到课程，跳过构建')
      return
    }
    
    console.log(`找到 ${courses.length} 门课程\n`)
    
    let builtCount = 0
    let cachedCount = 0
    let failedCount = 0
    const results = []
    
    // 逐个处理课程
    for (const course of courses) {
      const courseFile = course.path
      const courseDir = path.dirname(courseFile)
      const relativePath = path.relative(coursesDir, courseDir)
      const outputDir = path.join('dist', 'portal', 'courses', relativePath)
      
      // 检查是否需要构建
      const needsBuild = force || isCourseChanged(courseFile, cache)
      
      if (!needsBuild) {
        console.log(`⚡ 使用缓存: ${course.title}`)
        cachedCount++
        results.push({
          path: courseFile,
          status: 'cached',
          title: course.title
        })
        continue
      }
      
      console.log(`📦 构建课程: ${course.title}`)
      
      const buildStartTime = Date.now()
      
      try {
        // 构建课程
        execSync(
          `npx slidev build "${path.join(courseDir, 'slides.md')}" --base "/courses/${relativePath.replace(/\\/g, '/')}/" --out "${path.resolve(outputDir)}"`,
          {
            stdio: verbose ? 'inherit' : 'pipe',
            cwd: process.cwd()
          }
        )
        
        const buildDuration = Date.now() - buildStartTime
        
        // 更新缓存
        cache.courses[courseFile] = {
          hash: calculateFileHash(courseFile),
          buildTime: Date.now(),
          outputPath: outputDir
        }
        
        console.log(`✅ 构建成功 (${(buildDuration / 1000).toFixed(2)}s)\n`)
        builtCount++
        results.push({
          path: courseFile,
          status: 'built',
          title: course.title,
          duration: buildDuration
        })
      } catch (error) {
        console.error(`❌ 构建失败: ${error.message}\n`)
        failedCount++
        results.push({
          path: courseFile,
          status: 'failed',
          title: course.title,
          error: error.message
        })
      }
    }
    
    // 写入缓存
    cache.timestamp = Date.now()
    writeCache(cache)
    
    // 输出统计
    const totalDuration = Date.now() - startTime
    
    console.log('\n' + '='.repeat(60))
    console.log('增量构建完成！')
    console.log(`  总计: ${courses.length} 门课程`)
    console.log(`  构建: ${builtCount} 门`)
    console.log(`  缓存: ${cachedCount} 门`)
    console.log(`  失败: ${failedCount} 门`)
    console.log(`  耗时: ${(totalDuration / 1000).toFixed(2)}s`)
    console.log('='.repeat(60))
    
    if (failedCount > 0) {
      process.exit(1)
    }
    
    return {
      total: courses.length,
      built: builtCount,
      cached: cachedCount,
      failed: failedCount,
      duration: totalDuration,
      courses: results
    }
  } catch (error) {
    console.error('增量构建出错:', error)
    process.exit(1)
  }
}

// 执行增量构建
const args = process.argv.slice(2)
const force = args.includes('--force')
const verbose = args.includes('--verbose')

incrementalBuild({ force, verbose })
