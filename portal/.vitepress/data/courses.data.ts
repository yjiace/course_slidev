import path from 'path'
import { scanCourses } from '../../../scripts/scan-courses.js'

// 课程类型定义
interface Course {
  id: string
  title: string
  category: string
  tags: string[]
  description: string
  author: string
  date: string
  level: string
  duration?: string
  cover?: string
  coverImage?: string
  path: string
  slideUrl: string
  meta: Record<string, unknown>
}

// 课程索引类型
export interface CourseIndex {
  version: string
  generated: string
  courses: Course[]
  categories: string[]
  tags: string[]
  stats: {
    totalCourses: number
    totalCategories: number
    totalTags: number
  }
}

// 生成课程索引
function generateIndex(courses: Course[]): CourseIndex {
  const categories = [...new Set(courses.map(c => c.category))]
  const tags = [...new Set(courses.flatMap(c => c.tags))]
  
  return {
    version: '1.0.0',
    generated: new Date().toISOString(),
    courses,
    categories,
    tags,
    stats: {
      totalCourses: courses.length,
      totalCategories: categories.length,
      totalTags: tags.length
    }
  }
}

// 声明数据类型
declare const data: CourseIndex
export { data }

// VitePress Data Loader
// 在构建时和开发环境中自动加载课程数据
export default {
  // 监听课程目录的变化
  watch: ['../../../courses/**/*.md'],
  
  async load(): Promise<CourseIndex> {
    try {
      // 扫描课程目录
      const coursesDir = path.resolve(process.cwd(), 'courses')
      const courses = await scanCourses({
        baseDir: coursesDir,
        exclude: ['node_modules', 'dist', '.git', '.buildcache']
      })
      
      // 生成索引
      const index = generateIndex(courses)
      
      return index
    } catch (error) {
      console.error('加载课程数据失败:', error)
      
      // 返回空索引
      return {
        version: '1.0.0',
        generated: new Date().toISOString(),
        courses: [],
        categories: [],
        tags: [],
        stats: {
          totalCourses: 0,
          totalCategories: 0,
          totalTags: 0
        }
      }
    }
  }
}
