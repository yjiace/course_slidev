import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 课程元数据接口
export interface CourseMeta {
  title: string
  category: string
  tags: string[]
  description: string
  author?: string
  email?: string
  date?: string
  updated?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  duration?: number
  theme?: string
  highlighter?: string
  highlighter?: string
  drawings?: boolean
  background?: string
  cover?: string
}

// 课程接口
export interface Course {
  id: string
  title: string
  category: string
  tags: string[]
  description: string
  author: string
  date: string
  path: string
  slideUrl: string
  slideUrl: string
  cover?: string
  coverImage?: string
  meta: CourseMeta
}

// 扫描选项接口
export interface ScanOptions {
  baseDir: string
  pattern?: string
  exclude?: string[]
}

/**
 * 递归扫描目录查找 slides.md 文件
 */
function findSlideFiles(dir: string, exclude: string[] = []): string[] {
  const results: string[] = []

  try {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)

      // 跳过排除的目录
      if (exclude.some(pattern => filePath.includes(pattern))) {
        continue
      }

      try {
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
          // 递归扫描子目录
          results.push(...findSlideFiles(filePath, exclude))
        } else if (file === 'slides.md') {
          // 找到 slides.md 文件
          results.push(filePath)
        }
      } catch (error) {
        console.warn(`无法访问文件: ${filePath}`, error)
      }
    }
  } catch (error) {
    console.error(`无法读取目录: ${dir}`, error)
  }

  return results
}

/**
 * 验证必填字段
 */
function validateRequiredFields(data: any, filePath: string): boolean {
  const requiredFields = ['title', 'category', 'tags', 'description']
  const missingFields: string[] = []

  for (const field of requiredFields) {
    if (!data[field]) {
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    console.error(`❌ 课程元数据缺少必填字段: ${filePath}`)
    console.error(`   缺少字段: ${missingFields.join(', ')}`)
    return false
  }

  return true
}

/**
 * 提供默认值
 */
function applyDefaults(data: any): CourseMeta {
  // 确保 tags 是数组
  const tags = Array.isArray(data.tags) ? data.tags : [data.tags]

  // 验证 tags 至少有一个
  if (tags.length === 0) {
    console.warn(`⚠️  课程标签为空，添加默认标签: ${data.title}`)
    tags.push('未分类')
  }

  // 提供默认值
  const meta: CourseMeta = {
    title: data.title,
    category: data.category,
    tags,
    description: data.description,
    author: data.author || '未知作者',
    email: data.email,
    date: data.date || new Date().toISOString().split('T')[0],
    updated: data.updated,
    level: data.level || 'beginner',
    duration: data.duration,
    theme: data.theme || 'default',
    highlighter: data.highlighter || 'shiki',
    drawings: data.drawings !== false // 默认启用绘图
  }

  return meta
}

/**
 * 解析 Slidev 文件的 frontmatter
 */
function parseSlideFrontmatter(filePath: string): CourseMeta | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)

    // 验证必填字段
    if (!validateRequiredFields(data, filePath)) {
      return null
    }

    // 应用默认值
    const meta = applyDefaults(data)

    return meta
  } catch (error) {
    console.error(`❌ 解析课程元数据失败: ${filePath}`, error)
    return null
  }
}

/**
 * 生成课程唯一 ID（基于路径）
 */
function generateCourseId(filePath: string, baseDir: string): string {
  const relativePath = path.relative(baseDir, filePath)
  const parts = relativePath.split(path.sep)

  // 移除 slides.md
  parts.pop()

  // 使用路径作为 ID
  return parts.join('-')
}

/**
 * 生成 Slidev URL
 */
function generateSlideUrl(filePath: string, baseDir: string): string {
  const relativePath = path.relative(baseDir, path.dirname(filePath))
  return `/courses/${relativePath.replace(/\\/g, '/')}/`
}

/**
 * 扫描课程目录
 */
export async function scanCourses(options: ScanOptions): Promise<Course[]> {
  const { baseDir, exclude = ['node_modules', 'dist', '.git'] } = options

  console.log(`开始扫描课程目录: ${baseDir}`)

  // 检查目录是否存在
  if (!fs.existsSync(baseDir)) {
    console.warn(`课程目录不存在: ${baseDir}`)
    return []
  }

  // 查找所有 slides.md 文件
  const slideFiles = findSlideFiles(baseDir, exclude)
  console.log(`找到 ${slideFiles.length} 个课程文件`)

  // 解析课程元数据
  const courses: Course[] = []

  for (const filePath of slideFiles) {
    const meta = parseSlideFrontmatter(filePath)

    if (!meta) {
      continue
    }

    const id = generateCourseId(filePath, baseDir)
    const slideUrl = generateSlideUrl(filePath, baseDir)

    const course: Course = {
      id,
      title: meta.title,
      category: meta.category,
      tags: meta.tags,
      description: meta.description,
      author: meta.author || '未知',
      date: meta.date || new Date().toISOString().split('T')[0],
      path: path.relative(process.cwd(), filePath),
      slideUrl,
      meta
    }

    courses.push(course)
    console.log(`✓ 扫描课程: ${course.title} (${course.category})`)
  }

  console.log(`课程扫描完成，共 ${courses.length} 门课程`)

  return courses
}
