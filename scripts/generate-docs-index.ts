// 文档类型定义
export interface Doc {
    id: string
    title: string
    category: string
    tags: string[]
    description: string
    author: string
    date: string
    cover?: string
    path: string
    docUrl: string
    toc: TocItem[]
    meta: Record<string, any>
}

// 目录项类型
export interface TocItem {
    level: number
    text: string
    slug: string
}

// 分类信息接口
export interface CategoryInfo {
    name: string
    count: number
    docs: string[]
}

// 标签信息接口
export interface TagInfo {
    name: string
    count: number
    docs: string[]
}

// 统计信息接口
export interface Stats {
    totalDocs: number
    totalCategories: number
    totalTags: number
}

// 文档索引接口
export interface DocIndex {
    version: string
    generated: string
    docs: Doc[]
    categories: CategoryInfo[]
    tags: TagInfo[]
    stats: Stats
}

/**
 * 按分类分组文档
 */
function groupByCategory(docs: Doc[]): Map<string, Doc[]> {
    const categoryMap = new Map<string, Doc[]>()

    for (const doc of docs) {
        const category = doc.category

        if (!categoryMap.has(category)) {
            categoryMap.set(category, [])
        }

        categoryMap.get(category)!.push(doc)
    }

    return categoryMap
}

/**
 * 按标签分组文档
 */
function groupByTags(docs: Doc[]): Map<string, Doc[]> {
    const tagMap = new Map<string, Doc[]>()

    for (const doc of docs) {
        for (const tag of doc.tags) {
            if (!tagMap.has(tag)) {
                tagMap.set(tag, [])
            }

            tagMap.get(tag)!.push(doc)
        }
    }

    return tagMap
}

/**
 * 生成分类信息列表
 */
function generateCategoryInfo(categoryMap: Map<string, Doc[]>): CategoryInfo[] {
    const categories: CategoryInfo[] = []

    for (const [name, docs] of categoryMap.entries()) {
        categories.push({
            name,
            count: docs.length,
            docs: docs.map(d => d.id)
        })
    }

    // 按文档数量降序排序
    categories.sort((a, b) => b.count - a.count)

    return categories
}

/**
 * 生成标签信息列表
 */
function generateTagInfo(tagMap: Map<string, Doc[]>): TagInfo[] {
    const tags: TagInfo[] = []

    for (const [name, docs] of tagMap.entries()) {
        tags.push({
            name,
            count: docs.length,
            docs: docs.map(d => d.id)
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
    docs: Doc[],
    categories: CategoryInfo[],
    tags: TagInfo[]
): Stats {
    return {
        totalDocs: docs.length,
        totalCategories: categories.length,
        totalTags: tags.length
    }
}

/**
 * 生成文档索引
 */
export function generateDocsIndex(docs: Doc[]): DocIndex {
    console.log(`开始生成文档索引...`)

    // 按分类分组
    const categoryMap = groupByCategory(docs)
    const categories = generateCategoryInfo(categoryMap)
    console.log(`✓ 生成 ${categories.length} 个分类`)

    // 按标签分组
    const tagMap = groupByTags(docs)
    const tags = generateTagInfo(tagMap)
    console.log(`✓ 生成 ${tags.length} 个标签`)

    // 生成统计信息
    const stats = generateStats(docs, categories, tags)

    // 生成索引
    const index: DocIndex = {
        version: '1.0.0',
        generated: new Date().toISOString(),
        docs,
        categories,
        tags,
        stats
    }

    console.log(`文档索引生成完成:`)
    console.log(`  - 文档总数: ${stats.totalDocs}`)
    console.log(`  - 分类数量: ${stats.totalCategories}`)
    console.log(`  - 标签数量: ${stats.totalTags}`)

    return index
}

/**
 * 获取分类下的文档
 */
export function getDocsByCategory(
    index: DocIndex,
    category: string
): Doc[] {
    return index.docs.filter(d => d.category === category)
}

/**
 * 获取标签下的文档
 */
export function getDocsByTag(
    index: DocIndex,
    tag: string
): Doc[] {
    return index.docs.filter(d => d.tags.includes(tag))
}

/**
 * 搜索文档
 */
export function searchDocs(
    index: DocIndex,
    query: string
): Doc[] {
    const lowerQuery = query.toLowerCase()

    return index.docs.filter(doc => {
        return (
            doc.title.toLowerCase().includes(lowerQuery) ||
            doc.description.toLowerCase().includes(lowerQuery) ||
            doc.category.toLowerCase().includes(lowerQuery) ||
            doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            doc.author.toLowerCase().includes(lowerQuery)
        )
    })
}

/**
 * 根据 ID 获取文档
 */
export function getDocById(
    index: DocIndex,
    id: string
): Doc | undefined {
    return index.docs.find(d => d.id === id)
}
