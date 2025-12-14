import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import fg from 'fast-glob'

/**
 * 读取 .courseignore 文件并返回忽略模式列表
 * @param {string} baseDir - 基础目录
 * @returns {string[]} 忽略模式数组
 */
function readCourseIgnore(baseDir) {
  const ignoreFile = path.join(baseDir, '../.courseignore')
  const patterns = []

  // 默认忽略模式
  const defaultPatterns = [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
    '**/.buildcache/**',
    '**/.vitepress/**',
    '**/.slidev/**'
  ]

  if (fs.existsSync(ignoreFile)) {
    try {
      const content = fs.readFileSync(ignoreFile, 'utf-8')
      const lines = content.split('\n')

      for (const line of lines) {
        const trimmed = line.trim()
        // 跳过空行和注释
        if (trimmed && !trimmed.startsWith('#')) {
          // 处理目录模式：如果以 / 结尾，转换为 glob 模式
          if (trimmed.endsWith('/')) {
            patterns.push(`${trimmed}**`)
          } else {
            patterns.push(trimmed)
          }
        }
      }
    } catch (error) {
      console.warn(`[警告] 读取 .courseignore 失败: ${error.message}`)
    }
  }

  return [...new Set([...defaultPatterns, ...patterns])]
}

/**
 * 解析 Markdown 文件的 frontmatter
 * @param {string} filePath - 文件绝对路径
 * @returns {Object|null} 解析后的元数据或 null
 */
function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)

    // 验证必填字段
    if (!data.title || !data.category || !data.tags || !data.description) {
      return null
    }

    // 确保 tags 是数组
    const tags = Array.isArray(data.tags) ? data.tags : [data.tags]

    return {
      title: data.title,
      category: data.category,
      tags,
      description: data.description,
      author: data.author || '未知作者',
      date: data.date || new Date().toISOString().split('T')[0],
      level: data.level || 'beginner',
      duration: data.duration,
      cover: data.cover,
      ...data
    }
  } catch (error) {
    console.error(`[错误] 解析课程元数据失败: ${filePath}`, error.message)
    return null
  }
}

/**
 * 生成课程唯一 ID
 * @param {string} filePath - 文件绝对路径
 * @param {string} baseDir - 基础目录
 * @returns {string} 课程 ID
 */
function generateCourseId(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath)
  // 统一使用 / 作为分隔符，处理 Windows 路径
  const normalizedPath = relativePath.replace(/\\/g, '/')
  const parts = normalizedPath.split('/')

  // 移除文件扩展名
  const fileName = parts[parts.length - 1].replace(/\.md$/, '')
  parts[parts.length - 1] = fileName

  return parts.join('-')
}

/**
 * 生成 Slidev URL
 * @param {string} filePath - 文件绝对路径
 * @param {string} baseDir - 基础目录
 * @returns {string} Slidev URL
 */
function generateSlideUrl(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath)
  const normalizedPath = relativePath.replace(/\\/g, '/')
  const dirPath = path.dirname(normalizedPath)
  const fileName = path.basename(filePath, '.md')

  // 如果文件名是 slides 或 index，使用目录路径作为 URL
  if (fileName === 'slides' || fileName === 'index') {
    return `/courses/${dirPath}/`
  }

  // 否则 URL 包含文件名
  return `/courses/${normalizedPath.replace(/\.md$/, '')}/`
}

/**
 * 扫描课程目录
 * @param {Object} options - 扫描选项
 * @param {string} options.baseDir - 基础目录
 * @param {string[]} options.exclude - 排除模式
 * @param {boolean} options.slidesOnly - 是否只扫描 slides.md 文件
 * @returns {Promise<Array>} 课程列表
 */
export async function scanCourses(options = {}) {
  const {
    baseDir = 'courses',
    exclude = [],
    slidesOnly = false
  } = options

  const absoluteBaseDir = path.resolve(process.cwd(), baseDir)

  console.log(`[信息] 开始扫描课程目录: ${absoluteBaseDir}`)

  if (!fs.existsSync(absoluteBaseDir)) {
    console.warn(`[警告] 课程目录不存在: ${absoluteBaseDir}`)
    return []
  }

  // 读取忽略模式
  const ignorePatterns = readCourseIgnore(absoluteBaseDir)
  // 合并自定义排除模式
  const allIgnorePatterns = [...ignorePatterns, ...exclude]

  console.log(`[信息] 忽略模式: ${allIgnorePatterns.join(', ')}`)

  try {
    // 使用 fast-glob 扫描 .md 文件
    // slidesOnly 模式只扫描 slides.md 文件
    const pattern = slidesOnly ? '**/slides.md' : '**/*.md'
    const mdFiles = await fg([pattern], {
      cwd: absoluteBaseDir,
      ignore: allIgnorePatterns,
      absolute: true,
      onlyFiles: true,
      caseSensitiveMatch: false
    })

    console.log(`[信息] 找到 ${mdFiles.length} 个 Markdown 文件`)

    const courses = []
    let validCount = 0
    let invalidCount = 0

    for (const filePath of mdFiles) {
      const meta = parseFrontmatter(filePath)

      if (!meta) {
        // 可能是普通的文档而不是课程幻灯片，跳过并不报错，或者记录为无效
        // 这里我们只统计，不输出过多噪音，除非是显式的错误
        invalidCount++
        continue
      }

      const id = generateCourseId(filePath, absoluteBaseDir)
      const slideUrl = generateSlideUrl(filePath, absoluteBaseDir)

      const course = {
        id,
        title: meta.title,
        category: meta.category,
        tags: meta.tags,
        description: meta.description,
        author: meta.author,
        date: meta.date,
        level: meta.level,
        duration: meta.duration,

        cover: meta.cover || meta.background,
        coverImage: meta.cover || meta.background,
        path: path.relative(process.cwd(), filePath).replace(/\\/g, '/'), // 统一为 POSIX 路径
        slideUrl,
        meta
      }

      courses.push(course)
      validCount++
      console.log(`  ✓ 发现课程: ${course.title} (${course.category}) - ${path.basename(filePath)}`)
    }

    console.log(`\n[完成] 课程扫描结束:`)
    console.log(`  - 有效课程: ${validCount} 门`)
    console.log(`  - 跳过文件: ${invalidCount} 个 (缺少必要元数据)`)
    console.log(`  - 总计: ${courses.length} 门课程`)

    return courses

  } catch (error) {
    console.error(`[错误] 扫描过程中发生错误:`, error)
    return []
  }
}

// 兼容旧的导入方式
export default { scanCourses }

