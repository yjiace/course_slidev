/**
 * 生成文档侧边栏配置
 * 根据扫描的文档数据动态生成 VitePress 侧边栏
 */

import { scanDocs } from './scan-docs.js'
import path from 'path'

export interface SidebarItem {
    text: string
    link?: string
    collapsed?: boolean
    items?: SidebarItem[]
}

export interface SidebarConfig {
    [key: string]: SidebarItem[]
}

/**
 * 生成文档侧边栏配置
 */
export async function generateDocsSidebar(): Promise<SidebarConfig> {
    try {
        const docsDir = path.resolve(process.cwd(), 'docs')
        const docs = await scanDocs({
            baseDir: docsDir,
            exclude: ['node_modules', 'dist', '.git', '.buildcache']
        })

        // 按分类分组
        const categoryMap = new Map<string, { title: string; link: string }[]>()

        for (const doc of docs) {
            if (!categoryMap.has(doc.category)) {
                categoryMap.set(doc.category, [])
            }
            categoryMap.get(doc.category)!.push({
                title: doc.title,
                link: doc.docUrl
            })
        }

        // 构建侧边栏结构
        const sidebarItems: SidebarItem[] = []

        // 按分类名称排序
        const sortedCategories = Array.from(categoryMap.keys()).sort((a, b) => a.localeCompare(b, 'zh-CN'))

        for (const category of sortedCategories) {
            const docsList = categoryMap.get(category)!
            // 按文档标题排序
            docsList.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))

            sidebarItems.push({
                text: category,
                collapsed: false,
                items: docsList.map(doc => ({
                    text: doc.title,
                    link: doc.link
                }))
            })
        }

        return {
            '/docs/': sidebarItems
        }
    } catch (error) {
        console.error('生成侧边栏配置失败:', error)
        return { '/docs/': [] }
    }
}

// 同步版本，用于配置文件
let cachedSidebar: SidebarConfig | null = null

export function getDocsSidebarSync(): SidebarConfig {
    if (cachedSidebar) {
        return cachedSidebar
    }
    // 返回空配置，实际在构建时会被异步版本填充
    return { '/docs/': [] }
}

export function setCachedSidebar(sidebar: SidebarConfig) {
    cachedSidebar = sidebar
}
