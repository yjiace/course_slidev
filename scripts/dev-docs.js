/**
 * 文档开发模式脚本
 * 监听 docs/ 目录变化，自动同步到 portal/docs/ 并触发 VitePress 热更新
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const sourceDir = path.join(projectRoot, 'docs')
const targetDir = path.join(projectRoot, 'portal', 'docs')

// 防抖配置
let debounceTimer = null
const DEBOUNCE_DELAY = 300

/**
 * 复制单个文件
 */
function copyFile(srcPath, destPath) {
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
    }

    if (srcPath.endsWith('.md')) {
        let content = fs.readFileSync(srcPath, 'utf-8')
        if (!content.includes('layout:')) {
            content = content.replace(/^---\r?\n/, '---\nlayout: doc\n')
        }
        fs.writeFileSync(destPath, content)
    } else {
        fs.copyFileSync(srcPath, destPath)
    }
}

/**
 * 初始复制所有文档（调用 copy-docs.js）
 */
async function initialCopy() {
    console.log('📄 初始化：复制文档到门户...')

    try {
        const { execSync } = await import('child_process')
        execSync('node scripts/copy-docs.js', {
            cwd: projectRoot,
            stdio: 'inherit'
        })
        console.log('')
    } catch (error) {
        console.error('❌ 复制文档失败:', error.message)
        process.exit(1)
    }
}

/**
 * 处理文件变化
 */
function handleFileChange(eventType, filename) {
    if (!filename) return

    // 防抖处理
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        const srcPath = path.join(sourceDir, filename)
        const destPath = path.join(targetDir, filename)

        if (fs.existsSync(srcPath)) {
            const stat = fs.statSync(srcPath)
            if (stat.isFile()) {
                copyFile(srcPath, destPath)
                console.log(`🔄 已同步: ${filename}`)
            }
        } else {
            // 文件被删除
            if (fs.existsSync(destPath)) {
                fs.unlinkSync(destPath)
                console.log(`🗑️  已删除: ${filename}`)
            }
        }
    }, DEBOUNCE_DELAY)
}

/**
 * 监听目录变化（递归）
 */
function watchDirectory(dir, baseDir = dir) {
    if (!fs.existsSync(dir)) return

    fs.watch(dir, { persistent: true }, (eventType, filename) => {
        if (filename) {
            const relativePath = path.relative(baseDir, path.join(dir, filename))
            handleFileChange(eventType, relativePath)
        }
    })

    // 递归监听子目录
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
        if (entry.isDirectory()) {
            watchDirectory(path.join(dir, entry.name), baseDir)
        }
    }
}

// 主函数
async function main() {
    console.log('🚀 启动文档开发模式...\n')

    // 1. 初始复制
    await initialCopy()

    // 2. 启动 VitePress 开发服务器
    console.log('🌐 启动 VitePress 开发服务器...\n')
    const vitepress = spawn('npx', ['vitepress', 'dev', 'portal', '--port', '5173'], {
        cwd: projectRoot,
        stdio: 'inherit',
        shell: true
    })

    // 3. 启动文件监听
    console.log('👀 监听 docs/ 目录变化...\n')
    watchDirectory(sourceDir)

    // 处理退出
    process.on('SIGINT', () => {
        console.log('\n\n👋 停止开发服务器...')
        vitepress.kill()
        process.exit(0)
    })

    vitepress.on('close', (code) => {
        process.exit(code)
    })
}

main().catch(err => {
    console.error('❌ 错误:', err)
    process.exit(1)
})
