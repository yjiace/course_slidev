import path from 'path'
import { scanDocs } from '../../../scripts/scan-docs.js'

// 文档类型定义
interface Doc {
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
    toc: Array<{ level: number; text: string; slug: string }>
    meta: Record<string, unknown>
}

// 分类信息类型
export interface CategoryInfo {
    name: string
    count: number
}

// 文档索引类型
export interface DocIndex {
    version: string
    generated: string
    docs: Doc[]
    categories: CategoryInfo[]
    tags: string[]
    stats: {
        totalDocs: number
        totalCategories: number
        totalTags: number
    }
}

// 生成文档索引
function generateDocsIndex(docs: Doc[]): DocIndex {
    // 统计每个分类的文档数量
    const categoryMap = new Map<string, number>()
    docs.forEach(d => {
        categoryMap.set(d.category, (categoryMap.get(d.category) || 0) + 1)
    })
    const categories: CategoryInfo[] = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))

    const tags = [...new Set(docs.flatMap(d => d.tags))]

    return {
        version: '1.0.0',
        generated: new Date().toISOString(),
        docs,
        categories,
        tags,
        stats: {
            totalDocs: docs.length,
            totalCategories: categories.length,
            totalTags: tags.length
        }
    }
}

// 声明数据类型
declare const data: DocIndex
export { data }

// VitePress Data Loader
// 在构建时和开发环境中自动加载文档数据
export default {
    // 监听文档目录的变化
    watch: ['../../../docs/**/*.md'],

    async load(): Promise<DocIndex> {
        try {
            // 扫描文档目录
            const docsDir = path.resolve(process.cwd(), 'docs')
            const docs = await scanDocs({
                baseDir: docsDir,
                exclude: ['node_modules', 'dist', '.git', '.buildcache']
            })

            // 生成索引
            const index = generateDocsIndex(docs)

            return index
        } catch (error) {
            console.error('加载文档数据失败:', error)

            // 返回空索引
            return {
                version: '1.0.0',
                generated: new Date().toISOString(),
                docs: [],
                categories: [],
                tags: [],
                stats: {
                    totalDocs: 0,
                    totalCategories: 0,
                    totalTags: 0
                }
            }
        }
    }
}
