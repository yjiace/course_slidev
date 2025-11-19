import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

/**
 * 递归扫描目录查找 slides.md 文件
 */
function findSlideFiles(dir, exclude = []) {
  const results = []
  
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
          results.push(...findSlideFiles(filePath, exclude))
        } else if (file === 'slides.md') {
          results.push(filePath)
        }
      } catch (error) {
        console.warn(`无法访问文件: ${filePath}`)
      }
    }
  } catch (error) {
    console.error(`无法读取目录: ${dir}`)
  }
  
  return results
}

/**
 * 解析 Slidev 文件的 frontmatter
 */
function parseSlideFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)
    
    // 验证必填字段
    if (!data.title || !data.category || !data.tags || !data.description) {
      console.warn(`课程元数据不完整: ${filePath}`)
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
      ...data
    }
  } catch (error) {
    console.error(`解析课程元数据失败: ${filePath}`, error.message)
    return null
  }
}

/**
 * 生成课程唯一 ID
 */
function generateCourseId(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath)
  const parts = relativePath.split(path.sep)
  parts.pop() // 移除 slides.md
  return parts.join('-')
}

/**
 * 生成 Slidev URL
 */
function generateSlideUrl(filePath, baseDir) {
  const relativePath = path.relative(baseDir, path.dirname(filePath))
  return `/courses/${relativePath.replace(/\\/g, '/')}/`
}

/**
 * 扫描课程目录
 */
export async function scanCourses(options) {
  const { baseDir, exclude = ['node_modules', 'dist', '.git', '.buildcache'] } = options
  
  console.log(`开始扫描课程目录: ${baseDir}`)
  
  if (!fs.existsSync(baseDir)) {
    console.warn(`课程目录不存在: ${baseDir}`)
    return []
  }
  
  const slideFiles = findSlideFiles(baseDir, exclude)
  console.log(`找到 ${slideFiles.length} 个课程文件`)
  
  const courses = []
  
  for (const filePath of slideFiles) {
    const meta = parseSlideFrontmatter(filePath)
    
    if (!meta) {
      continue
    }
    
    const id = generateCourseId(filePath, baseDir)
    const slideUrl = generateSlideUrl(filePath, baseDir)
    
    const course = {
      id,
      title: meta.title,
      category: meta.category,
      tags: meta.tags,
      description: meta.description,
      author: meta.author,
      date: meta.date,
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
