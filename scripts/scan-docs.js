import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import fg from 'fast-glob'

/**
 * 读取 .docsignore 文件并返回忽略模式列表
 * @param {string} baseDir - 基础目录
 * @returns {string[]} 忽略模式数组
 */
function readDocsIgnore(baseDir) {
  const ignoreFile = path.join(baseDir, '../.docsignore')
  const patterns = []

  // 默认忽略模式
  const defaultPatterns = [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
    '**/.buildcache/**',
    '**/.vitepress/**',
    '**/.slidev/**'
  ]

  if (fs.existsSync(ignoreFile)) {
    try {
      const content = fs.readFileSync(ignoreFile, 'utf-8')
      const lines = content.split('\n')

      for (const line of lines) {
        const trimmed = line.trim()
        // 跳过空行和注释
        if (trimmed && !trimmed.startsWith('#')) {
          // 处理目录模式：如果以 / 结尾，转换为 glob 模式
          if (trimmed.endsWith('/')) {
            patterns.push(`${trimmed}**`)
          } else {
            patterns.push(trimmed)
          }
        }
      }
    } catch (error) {
      console.warn(`[警告] 读取 .docsignore 失败: ${error.message}`)
    }
  }

  return [...new Set([...defaultPatterns, ...patterns])]
}

/**
 * 解析 Markdown 文件的 frontmatter
 * @param {string} filePath - 文件绝对路径
 * @returns {Object|null} 解析后的元数据或 null
 */
function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: markdownContent } = matter(content)

    // 验证必填字段
    if (!data.title || !data.category || !data.tags || !data.description) {
      return null
    }

    // 确保 tags 是数组
    const tags = Array.isArray(data.tags) ? data.tags : [data.tags]

    return {
      title: data.title,
      category: data.category,
      tags,
      description: data.description,
      author: data.author || '未知作者',
      date: data.date || new Date().toISOString().split('T')[0],
      cover: data.cover,
      content: markdownContent,
      ...data
    }
  } catch (error) {
    console.error(`[错误] 解析文档元数据失败: ${filePath}`, error.message)
    return null
  }
}

/**
 * 生成文档唯一 ID
 * @param {string} filePath - 文件绝对路径
 * @param {string} baseDir - 基础目录
 * @returns {string} 文档 ID
 */
function generateDocId(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath)
  // 统一使用 / 作为分隔符，处理 Windows 路径
  const normalizedPath = relativePath.replace(/\\/g, '/')
  const parts = normalizedPath.split('/')

  // 移除文件扩展名
  const fileName = parts[parts.length - 1].replace(/\.md$/, '')
  parts[parts.length - 1] = fileName

  return parts.join('-')
}

/**
 * 生成文档 URL
 * @param {string} filePath - 文件绝对路径
 * @param {string} baseDir - 基础目录
 * @returns {string} 文档 URL
 */
function generateDocUrl(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath)
  const normalizedPath = relativePath.replace(/\\/g, '/')

  // 移除 .md 扩展名，生成标准 VitePress URL
  const urlPath = normalizedPath.replace(/\.md$/, '')

  // 文档放在 portal/docs/ 目录下，URL 路径为 /docs/xxx
  return `/docs/${urlPath}`
}

/**
 * 提取文档目录（TOC）
 * @param {string} content - Markdown 内容
 * @returns {Array} 目录项数组
 */
function extractToc(content) {
  const toc = []
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const slug = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')

    toc.push({
      level,
      text,
      slug
    })
  }

  return toc
}

/**
 * 扫描文档目录
 * @param {Object} options - 扫描选项
 * @returns {Promise<Array>} 文档列表
 */
export async function scanDocs(options = {}) {
  const {
    baseDir = 'docs',
    exclude = []
  } = options

  const absoluteBaseDir = path.resolve(process.cwd(), baseDir)

  console.log(`[信息] 开始扫描文档目录: ${absoluteBaseDir}`)

  if (!fs.existsSync(absoluteBaseDir)) {
    console.warn(`[警告] 文档目录不存在: ${absoluteBaseDir}`)
    return []
  }

  // 读取忽略模式
  const ignorePatterns = readDocsIgnore(absoluteBaseDir)
  // 合并自定义排除模式
  const allIgnorePatterns = [...ignorePatterns, ...exclude]

  console.log(`[信息] 忽略模式: ${allIgnorePatterns.join(', ')}`)

  try {
    // 使用 fast-glob 扫描所有 .md 文件
    const mdFiles = await fg(['**/*.md'], {
      cwd: absoluteBaseDir,
      ignore: allIgnorePatterns,
      absolute: true,
      onlyFiles: true,
      caseSensitiveMatch: false
    })

    console.log(`[信息] 找到 ${mdFiles.length} 个 Markdown 文件`)

    const docs = []
    let validCount = 0
    let invalidCount = 0

    for (const filePath of mdFiles) {
      const meta = parseFrontmatter(filePath)

      if (!meta) {
        invalidCount++
        continue
      }

      const id = generateDocId(filePath, absoluteBaseDir)
      const docUrl = generateDocUrl(filePath, absoluteBaseDir)
      const toc = extractToc(meta.content)

      const doc = {
        id,
        title: meta.title,
        category: meta.category,
        tags: meta.tags,
        description: meta.description,
        author: meta.author,
        date: meta.date,
        cover: meta.cover,
        path: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
        docUrl,
        toc,
        meta
      }

      docs.push(doc)
      validCount++
      console.log(`  ✓ 发现文档: ${doc.title} (${doc.category}) - ${path.basename(filePath)}`)
    }

    console.log(`\n[完成] 文档扫描结束:`)
    console.log(`  - 有效文档: ${validCount} 篇`)
    console.log(`  - 跳过文件: ${invalidCount} 个 (缺少必要元数据)`)
    console.log(`  - 总计: ${docs.length} 篇文档`)

    return docs

  } catch (error) {
    console.error(`[错误] 扫描过程中发生错误:`, error)
    return []
  }
}

// 兼容旧的导入方式
export default { scanDocs }
