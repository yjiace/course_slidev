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

    console.log('✅ 文档复制完成')
}

main().catch(err => {
    console.error('❌ 错误:', err)
    process.exit(1)
})

