/**
 * 思维导图解析器
 * 将 Markdown 缩进格式转换为 Mermaid graph LR 格式
 */

interface TreeNode {
  id: string
  text: string
  level: number
  children: TreeNode[]
  parent: TreeNode | null
}

/**
 * 生成节点 ID (A, B, C, ... Z, AA, AB, ...)
 */
function generateNodeId(index: number): string {
  let id = ''
  let n = index
  do {
    id = String.fromCharCode(65 + (n % 26)) + id
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return id
}

/**
 * 转义 Mermaid 节点文本中的特殊字符
 */
function escapeNodeText(text: string): string {
  // 移除前导符号 (#, ##, -, * 等)
  let cleaned = text
    .replace(/^#+\s*/, '')  // 移除 # 标记
    .replace(/^[-*]\s*/, '') // 移除列表标记
    .trim()

  // 转义特殊字符
  // Mermaid 中 [] 用于节点，需要处理文本中的 [] () 等
  cleaned = cleaned
    .replace(/"/g, "'")      // 双引号转单引号
    .replace(/\[/g, '（')     // 方括号转中文括号
    .replace(/\]/g, '）')
    .replace(/\(/g, '（')
    .replace(/\)/g, '）')
    .replace(/</g, '＜')
    .replace(/>/g, '＞')
    .replace(/\|/g, '｜')
    .replace(/:/g, '：')     // 冒号转中文冒号，避免 Mermaid 解析问题

  return cleaned
}

/**
 * 计算行的缩进级别
 */
function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/)
  const spaces = match ? match[1].length : 0
  return Math.floor(spaces / 2) // 每 2 个空格算一级
}

/**
 * 获取行的类型和级别
 */
function getLineInfo(line: string): { type: 'heading' | 'item' | 'empty', level: number, text: string } {
  const trimmed = line.trim()

  if (!trimmed) {
    return { type: 'empty', level: 0, text: '' }
  }

  // 检查是否是标题 (# 或 ##)
  const headingMatch = trimmed.match(/^(#+)\s*(.*)/)
  if (headingMatch) {
    const headingLevel = headingMatch[1].length // # = 1, ## = 2, etc.
    return {
      type: 'heading',
      level: headingLevel - 1, // # 作为根节点(0), ## 作为一级(1)
      text: headingMatch[2]
    }
  }

  // 检查是否是列表项 (- 或 *)
  const itemMatch = trimmed.match(/^[-*]\s*(.*)/)
  if (itemMatch) {
    const baseIndent = getIndentLevel(line)
    // 列表项的级别 = 缩进级别 + 2 (因为标题占据了 0 和 1)
    return {
      type: 'item',
      level: baseIndent + 2,
      text: itemMatch[1]
    }
  }

  // 普通文本行
  const baseIndent = getIndentLevel(line)
  return {
    type: 'item',
    level: baseIndent + 2,
    text: trimmed
  }
}

/**
 * 检测是否是原生 Mermaid 语法
 */
export function isNativeMermaid(content: string): boolean {
  const trimmed = content.trim()
  // 检查是否以 mermaid 关键字开头
  const mermaidPatterns = [
    /^(graph|flowchart)\s+(LR|RL|TB|BT|TD)/i,
    /^mindmap\s*$/m,
    /^sequenceDiagram\s*$/m,
    /^classDiagram\s*$/m,
    /^stateDiagram/i,
    /^erDiagram\s*$/m,
    /^pie\s*/i,
    /^gantt\s*$/m
  ]

  return mermaidPatterns.some(pattern => pattern.test(trimmed))
}

/**
 * 将 Markdown 缩进格式转换为 Mermaid graph LR 格式
 */
export function parseMarkdownToGraph(content: string): string {
  const lines = content.split('\n')
  const nodes: { id: string; text: string; level: number }[] = []
  const edges: { from: string; to: string }[] = []

  // 用于追踪每个层级的最后一个节点
  const levelStack: Map<number, string> = new Map()

  let nodeIndex = 0

  for (const line of lines) {
    const { type, level, text } = getLineInfo(line)

    if (type === 'empty' || !text) continue

    const nodeId = generateNodeId(nodeIndex)
    const escapedText = escapeNodeText(text)

    nodes.push({ id: nodeId, text: escapedText, level })

    // 找到父节点
    if (level > 0) {
      // 查找最近的更高层级节点作为父节点
      let parentLevel = level - 1
      while (parentLevel >= 0 && !levelStack.has(parentLevel)) {
        parentLevel--
      }
      if (parentLevel >= 0) {
        const parentId = levelStack.get(parentLevel)!
        edges.push({ from: parentId, to: nodeId })
      }
    }

    // 更新当前层级的节点
    levelStack.set(level, nodeId)

    // 清除所有更深层级的记录（因为新的节点会成为新的父节点）
    for (const [key] of levelStack) {
      if (key > level) {
        levelStack.delete(key)
      }
    }

    nodeIndex++
  }

  // 生成 Mermaid 代码
  const mermaidLines: string[] = ['graph LR']

  // 首先定义所有节点（使用引号包裹文本以避免特殊字符问题）
  for (const node of nodes) {
    mermaidLines.push(`    ${node.id}["${node.text}"]`)
  }

  // 然后定义所有连接（只使用 ID，不重复文本）
  for (const edge of edges) {
    mermaidLines.push(`    ${edge.from} --> ${edge.to}`)
  }

  return mermaidLines.join('\n')
}

/**
 * 智能转换内容
 * - 如果是原生 Mermaid 语法，直接返回
 * - 如果是 Markdown 缩进格式，转换为 graph LR
 */
export function convertToMermaid(content: string): string {
  const trimmed = content.trim()

  if (isNativeMermaid(trimmed)) {
    return trimmed
  }

  return parseMarkdownToGraph(trimmed)
}
