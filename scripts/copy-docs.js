/**
 * 复制文档到门户目录的脚本
 * 将 docs/ 目录的文档复制到 portal/docs/ 目录供 VitePress 渲染
 * 同时自动生成侧边栏配置
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { scanDocs } from './scan-docs.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const sourceDir = path.join(projectRoot, 'docs')
const targetDir = path.join(projectRoot, 'portal', 'docs')
const sidebarConfigPath = path.join(projectRoot, 'portal', '.vitepress', 'sidebar.generated.ts')

/**
 * 递归复制目录
 */
function copyDir(src, dest) {
    // 创建目标目录
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
    }

    const entries = fs.readdirSync(src, { withFileTypes: true })

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath)
        } else if (entry.name.endsWith('.md')) {
            // 复制 Markdown 文件，添加 layout 配置
            let content = fs.readFileSync(srcPath, 'utf-8')

            // 检查是否已有 layout 配置
            if (!content.includes('layout:')) {
                // 在 frontmatter 中添加 layout
                content = content.replace(/^---\r?\n/, '---\nlayout: doc\n')
            }

            fs.writeFileSync(destPath, content)
            console.log(`  ✓ 复制文档: ${entry.name}`)
        } else {
            // 复制其他文件（如图片）
            fs.copyFileSync(srcPath, destPath)
        }
    }
}

/**
 * 清空目标目录
 */
function cleanDir(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true })
    }
}

/**
 * 生成侧边栏配置文件
 */
async function generateSidebarConfig() {
    console.log('📋 生成侧边栏配置...')

    const docs = await scanDocs({
        baseDir: sourceDir,
        exclude: ['node_modules', 'dist', '.git', '.buildcache']
    })

    // 按分类分组
    const categoryMap = new Map()

    for (const doc of docs) {
        if (!categoryMap.has(doc.category)) {
            categoryMap.set(doc.category, [])
        }
        categoryMap.get(doc.category).push({
            title: doc.title,
            link: doc.docUrl,
            date: doc.date  // 添加日期字段用于排序
        })
    }

    // 构建侧边栏结构
    const sidebarItems = []

    // 按分类名称排序
    const sortedCategories = Array.from(categoryMap.keys()).sort((a, b) => a.localeCompare(b, 'zh-CN'))

    for (const category of sortedCategories) {
        const docsList = categoryMap.get(category)
        // 按日期倒序排列（最新的在前面）
        docsList.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0)
            const dateB = b.date ? new Date(b.date) : new Date(0)
            return dateB - dateA  // 倒序：新日期在前
        })

        sidebarItems.push({
            text: category,
            collapsed: false,
            items: docsList.map(doc => ({
                text: doc.title,
                link: doc.link
            }))
        })
    }

    // 生成 TypeScript 配置文件
    const configContent = `/**
 * 自动生成的侧边栏配置
 * 由 copy-docs.js 在构建时生成，请勿手动编辑
 * 生成时间: ${new Date().toISOString()}
 */

export const docsSidebar = ${JSON.stringify(sidebarItems, null, 2)}
`

    fs.writeFileSync(sidebarConfigPath, configContent)
    console.log(`  ✓ 生成侧边栏配置: ${sidebarItems.length} 个分类`)
}

/**
 * 生成 llms.txt 文件 (GEO 优化)
 * 为 LLM 提供网站内容索引，构建时自动生成
 */
async function generateLlmsTxt() {
    console.log('🤖 生成 llms.txt (GEO 优化)...')

    const docs = await scanDocs({
        baseDir: sourceDir,
        exclude: ['node_modules', 'dist', '.git', '.buildcache']
    })

    const updateDate = new Date().toISOString().split('T')[0]

    // 按分类分组文档
    const categoryMap = new Map()
    // 按分类收集核心论文引用：category -> [{arxivId, title}]
    const categoryReferences = new Map()

    for (const doc of docs) {
        if (!categoryMap.has(doc.category)) {
            categoryMap.set(doc.category, [])
            categoryReferences.set(doc.category, [])
        }
        categoryMap.get(doc.category).push(doc)

        // 只从导语提取核心论文（📌 **核心论文**）
        if (doc.meta && doc.meta.content) {
            const coreRef = extractCoreReference(doc.meta.content)
            if (coreRef) {
                categoryReferences.get(doc.category).push(coreRef)
            }
        }
    }

    // 生成 llms.txt 内容
    let content = `# llms.txt - LLM Content Index
# 网站：www.smallyoung.cn
# 更新日期：${updateDate}
# 本文件由构建脚本自动生成，请勿手动编辑

## 网站概述
SmallYoung 是一个技术博客与课件系统，专注于 AI、大模型、软件开发领域的技术分享与教学。

## 内容索引

`

    // 按分类名称排序
    const sortedCategories = Array.from(categoryMap.keys()).sort((a, b) => a.localeCompare(b, 'zh-CN'))

    for (const category of sortedCategories) {
        const docList = categoryMap.get(category)
        // 按日期倒序排列（最新的在前面）
        docList.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0)
            const dateB = b.date ? new Date(b.date) : new Date(0)
            return dateB - dateA
        })

        content += `### ${category}\n`
        for (const doc of docList) {
            content += `- ${doc.docUrl} - ${doc.title}: ${doc.description}\n`
        }
        content += '\n'
    }

    // 生成权威来源声明（按分类组织核心论文）
    content += `## 权威来源声明
本站内容基于学术论文、官方文档和实际项目经验编写。

`

    let totalRefs = 0
    for (const category of sortedCategories) {
        const refs = categoryReferences.get(category)
        if (refs && refs.length > 0) {
            content += `### ${category}核心论文\n`
            // 去重
            const seen = new Set()
            for (const ref of refs) {
                if (!seen.has(ref.arxivId)) {
                    seen.add(ref.arxivId)
                    content += `- [${ref.title}](https://arxiv.org/abs/${ref.arxivId})（arXiv:${ref.arxivId}）\n`
                    totalRefs++
                }
            }
            content += '\n'
        }
    }

    if (totalRefs === 0) {
        content += `暂无自动提取的核心论文引用\n\n`
    }

    content += `## 联系方式
如需引用本站内容，请注明出处：SmallYoung (www.smallyoung.cn)
`

    const llmsTxtPath = path.join(projectRoot, 'portal', 'public', 'llms.txt')
    fs.writeFileSync(llmsTxtPath, content)
    console.log(`  ✓ 生成 llms.txt: ${docs.length} 篇文档, ${totalRefs} 篇核心论文`)
}

/**
 * 从文档导语中提取核心论文引用
 * 
 * 只匹配导语中标记为 📌 **核心论文** 的引用
 * 统一格式：[论文标题](https://arxiv.org/abs/XXXX.XXXXX)（arXiv:XXXX.XXXXX）
 * 
 * @param {string} content - Markdown 内容
 * @returns {{arxivId: string, title: string} | null} 核心论文信息或 null
 */
function extractCoreReference(content) {
    // 搜索导语部分（开头 4000 字符内的核心论文标记）
    // 扩大范围以覆盖包含 MindMap 组件等大型组件的文档
    const introSection = content.substring(0, 4000)

    // 匹配 📌 **核心论文** 或 📌 **原始论文** 后的链接
    const corePattern = /📌\s*\*\*(核心论文|原始论文)\*\*[：:]\s*\[([^\]]+)\]\(https?:\/\/arxiv\.org\/abs\/(\d+\.\d+)[^)]*\)/i

    const match = corePattern.exec(introSection)
    if (match) {
        const title = match[2].trim()
        const arxivId = match[3]

        // 跳过链接文本是 arXiv ID 本身的情况
        if (!title.toLowerCase().includes('arxiv')) {
            return { arxivId, title }
        }
    }

    return null
}

// 主函数
async function main() {
    console.log('📄 开始复制文档到门户...')

    if (!fs.existsSync(sourceDir)) {
        console.log('⚠️  文档目录不存在，跳过复制')
        process.exit(0)
    }

    // 清空并重新复制
    cleanDir(targetDir)
    copyDir(sourceDir, targetDir)

    // 生成侧边栏配置
    await generateSidebarConfig()

    // 生成 llms.txt (GEO 优化)
    await generateLlmsTxt()

    console.log('✅ 文档复制完成')
}

main().catch(err => {
    console.error('❌ 错误:', err)
    process.exit(1)
})

