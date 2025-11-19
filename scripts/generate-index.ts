import type { Course } from './scan-courses'

// 分类信息接口
export interface CategoryInfo {
  name: string
  count: number
  courses: string[]
}

// 标签信息接口
export interface TagInfo {
  name: string
  count: number
  courses: string[]
}

// 统计信息接口
export interface Stats {
  totalCourses: number
  totalCategories: number
  totalTags: number
}

// 课程索引接口
export interface CourseIndex {
  version: string
  generated: string
  courses: Course[]
  categories: CategoryInfo[]
  tags: TagInfo[]
  stats: Stats
}

/**
 * 按分类分组课程
 */
function groupByCategory(courses: Course[]): Map<string, Course[]> {
  const categoryMap = new Map<string, Course[]>()
  
  for (const course of courses) {
    const category = course.category
    
    if (!categoryMap.has(category)) {
      categoryMap.set(category, [])
    }
    
    categoryMap.get(category)!.push(course)
  }
  
  return categoryMap
}

/**
 * 按标签分组课程
 */
function groupByTags(courses: Course[]): Map<string, Course[]> {
  const tagMap = new Map<string, Course[]>()
  
  for (const course of courses) {
    for (const tag of course.tags) {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, [])
      }
      
      tagMap.get(tag)!.push(course)
    }
  }
  
  return tagMap
}

/**
 * 统计标签使用频率
 */
function calculateTagStats(courses: Course[]): Map<string, number> {
  const tagStats = new Map<string, number>()
  
  for (const course of courses) {
    for (const tag of course.tags) {
      tagStats.set(tag, (tagStats.get(tag) || 0) + 1)
    }
  }
  
  return tagStats
}

/**
 * 生成分类信息列表
 */
function generateCategoryInfo(categoryMap: Map<string, Course[]>): CategoryInfo[] {
  const categories: CategoryInfo[] = []
  
  for (const [name, courses] of categoryMap.entries()) {
    categories.push({
      name,
      count: courses.length,
      courses: courses.map(c => c.id)
    })
  }
  
  // 按课程数量降序排序
  categories.sort((a, b) => b.count - a.count)
  
  return categories
}

/**
 * 生成标签信息列表
 */
function generateTagInfo(tagMap: Map<string, Course[]>): TagInfo[] {
  const tags: TagInfo[] = []
  
  for (const [name, courses] of tagMap.entries()) {
    tags.push({
      name,
      count: courses.length,
      courses: courses.map(c => c.id)
    })
  }
  
  // 按使用频率降序排序
  tags.sort((a, b) => b.count - a.count)
  
  return tags
}

/**
 * 生成统计信息
 */
function generateStats(
  courses: Course[],
  categories: CategoryInfo[],
  tags: TagInfo[]
): Stats {
  return {
    totalCourses: courses.length,
    totalCategories: categories.length,
    totalTags: tags.length
  }
}

/**
 * 生成课程索引
 */
export function generateIndex(courses: Course[]): CourseIndex {
  console.log(`开始生成课程索引...`)
  
  // 按分类分组
  const categoryMap = groupByCategory(courses)
  const categories = generateCategoryInfo(categoryMap)
  console.log(`✓ 生成 ${categories.length} 个分类`)
  
  // 按标签分组
  const tagMap = groupByTags(courses)
  const tags = generateTagInfo(tagMap)
  console.log(`✓ 生成 ${tags.length} 个标签`)
  
  // 生成统计信息
  const stats = generateStats(courses, categories, tags)
  
  // 生成索引
  const index: CourseIndex = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    courses,
    categories,
    tags,
    stats
  }
  
  console.log(`课程索引生成完成:`)
  console.log(`  - 课程总数: ${stats.totalCourses}`)
  console.log(`  - 分类数量: ${stats.totalCategories}`)
  console.log(`  - 标签数量: ${stats.totalTags}`)
  
  return index
}

/**
 * 获取分类下的课程
 */
export function getCoursesByCategory(
  index: CourseIndex,
  category: string
): Course[] {
  return index.courses.filter(c => c.category === category)
}

/**
 * 获取标签下的课程
 */
export function getCoursesByTag(
  index: CourseIndex,
  tag: string
): Course[] {
  return index.courses.filter(c => c.tags.includes(tag))
}

/**
 * 搜索课程
 */
export function searchCourses(
  index: CourseIndex,
  query: string
): Course[] {
  const lowerQuery = query.toLowerCase()
  
  return index.courses.filter(course => {
    return (
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      course.category.toLowerCase().includes(lowerQuery) ||
      course.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      course.author.toLowerCase().includes(lowerQuery)
    )
  })
}
