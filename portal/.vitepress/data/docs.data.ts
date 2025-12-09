import path from 'path'
import { scanDocs } from '../../../scripts/scan-docs'
import { generateDocsIndex, type DocIndex } from '../../../scripts/generate-docs-index'

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
