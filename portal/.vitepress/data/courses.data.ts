import { createContentLoader } from 'vitepress'
import path from 'path'
import { scanCourses } from '../../../scripts/scan-courses.js'
import { generateIndex, type CourseIndex } from '../../../scripts/generate-index.js'

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
