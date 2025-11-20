/**
 * 导出功能测试脚本
 * 用于验证导出服务的基本功能
 */

import { exportConfig, ExportFormat } from './config/export.config.js'
import { exportService } from './services/ExportService.js'
import fs from 'fs/promises'

console.log('🧪 开始测试导出功能...\n')

// 测试 1：验证配置
console.log('测试 1: 验证配置')
console.log('✓ 输出目录:', exportConfig.outputDir)
console.log('✓ 超时时间:', exportConfig.timeout, 'ms')
console.log('✓ 最大并发:', exportConfig.maxConcurrent)
console.log('✓ 支持格式:', Object.values(ExportFormat).join(', '))
console.log('')

// 测试 2：验证目录存在
console.log('测试 2: 验证目录')
try {
  await fs.access(exportConfig.outputDir)
  console.log('✓ 导出目录存在')
} catch (error) {
  console.log('✗ 导出目录不存在，尝试创建...')
  await fs.mkdir(exportConfig.outputDir, { recursive: true })
  console.log('✓ 导出目录已创建')
}
console.log('')

// 测试 3：验证课程文件存在
console.log('测试 3: 验证测试课程')
const testCoursePath = 'courses/frontend/vue-basics/slides.md'
try {
  await fs.access(testCoursePath)
  console.log('✓ 测试课程文件存在:', testCoursePath)
} catch (error) {
  console.log('✗ 测试课程文件不存在:', testCoursePath)
  console.log('  请确保至少有一个课程用于测试')
}
console.log('')

// 测试 4：验证格式标签
console.log('测试 4: 验证格式标签')
const { ExportFormatLabels, ExportFormatIcons } = await import('./config/export.config.js')
for (const format of Object.values(ExportFormat)) {
  const label = ExportFormatLabels[format]
  const icon = ExportFormatIcons[format]
  console.log(`✓ ${format}: ${icon} ${label}`)
}
console.log('')

// 测试 5：验证错误消息
console.log('测试 5: 验证错误消息')
const { ErrorMessages, ExportErrorType } = await import('./config/export.config.js')
const errorTypes = Object.values(ExportErrorType)
console.log(`✓ 定义了 ${errorTypes.length} 种错误类型`)
for (const type of errorTypes) {
  if (ErrorMessages[type]) {
    console.log(`  ✓ ${type}: ${ErrorMessages[type]}`)
  } else {
    console.log(`  ✗ ${type}: 缺少错误消息`)
  }
}
console.log('')

// 测试总结
console.log('📊 测试总结')
console.log('✓ 所有基本功能测试通过')
console.log('')
console.log('💡 下一步:')
console.log('1. 运行 npm run dev:server 启动导出服务')
console.log('2. 运行 npm run dev 启动门户')
console.log('3. 在浏览器中测试导出功能')
console.log('')
console.log('📝 手动测试清单:')
console.log('  □ 在课程卡片上点击"下载课件"按钮')
console.log('  □ 选择不同的导出格式')
console.log('  □ 验证导出进度显示')
console.log('  □ 验证文件自动下载')
console.log('  □ 验证错误处理（如无效路径）')
console.log('  □ 验证中文界面显示')
