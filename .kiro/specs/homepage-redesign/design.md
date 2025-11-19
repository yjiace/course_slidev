# 设计文档

## 概述

本设计文档描述了课程门户首页重新设计的技术实现方案。重新设计的目标是用 Tailwind CSS 实现替换当前的 VitePress 默认样式，完全复刻提供的参考 HTML 设计，同时保持现有的 Vue 组件架构和功能。

设计的核心原则：
- 使用 Tailwind CSS 实用类进行样式设计
- 保持现有的 Vue 3 Composition API 组件结构
- 实现像素级完美的设计复刻
- 保留 VitePress 的页脚和核心功能
- 确保完全的响应式设计和可访问性

## 架构

### 整体架构

系统将保持现有的 VitePress + Vue 3 架构，主要变更在于样式层：

```
portal/
├── .vitepress/
│   ├── config.ts                 # VitePress 配置（添加 Tailwind）
│   ├── theme/
│   │   ├── index.ts             # 主题入口（注入 Tailwind）
│   │   ├── components/
│   │   │   ├── HomePage.vue     # 主页组件（重新设计）
│   │   │   ├── CustomHeader.vue # 新增：自定义页头
│   │   │   ├── CourseCard.vue   # 课程卡片（重新设计）
│   │   │   ├── CategoryNav.vue  # 分类导航（重新设计）
│   │   │   └── SearchBar.vue    # 搜索栏（重新设计）
│   │   └── styles/
│   │       └── tailwind.css     # 新增：Tailwind 配置
│   └── data/
│       └── courses.data.ts      # 课程数据（保持不变）
└── index.md                      # 首页入口（保持不变）
```

### 样式架构

采用 Tailwind CSS 作为主要样式解决方案：

1. **Tailwind CDN 集成**: 通过 CDN 加载 Tailwind CSS，包括 forms 和 container-queries 插件
2. **自定义配置**: 在主题中配置自定义颜色、字体和其他设计令牌
3. **深色模式**: 使用 Tailwind 的 `dark:` 变体实现深色模式
4. **响应式设计**: 使用 Tailwind 的响应式断点实现移动优先设计

## 组件和接口

### 1. CustomHeader 组件（新增）

自定义页头组件，替换 VitePress 默认页头。

**Props:**
```typescript
interface CustomHeaderProps {
  // 无 props，使用全局状态
}
```

**功能:**
- 显示学校图标和标题
- 集成搜索框
- 主题切换按钮
- 固定定位和背景模糊效果

**样式特征:**
- 高度: 64px (h-16)
- 背景: 半透明白色/深色 + 背景模糊
- 边框: 底部边框
- 布局: Flexbox，左右对齐

### 2. HomePage 组件（重新设计）

主页容器组件，协调所有子组件。

**Props:**
```typescript
// 无 props，使用数据加载器
```

**状态:**
```typescript
interface HomePageState {
  selectedCategory: string | null
  selectedTag: string | null
  searchQuery: string
}
```

**布局结构:**
```
CustomHeader (固定顶部)
└── Main Content
    ├── Page Title ("所有课程")
    ├── CategoryNav
    └── Course Grid
        └── CourseCard[]
```

### 3. CategoryNav 组件（重新设计）

分类筛选按钮组。

**Props:**
```typescript
interface CategoryNavProps {
  categories: CategoryInfo[]
  totalCourses: number
  selectedCategory: string | null
}
```

**Emits:**
```typescript
interface CategoryNavEmits {
  'category-change': (category: string | null) => void
}
```

**样式特征:**
- 按钮形状: 圆角药丸 (rounded-full)
- 激活状态: 主色背景 (bg-primary)
- 悬停效果: 颜色过渡
- 布局: Flexbox，可换行

### 4. CourseCard 组件（重新设计）

课程信息卡片。

**Props:**
```typescript
interface CourseCardProps {
  course: Course
}
```

**Emits:**
```typescript
interface CourseCardEmits {
  'tag-click': (tag: string) => void
}
```

**样式特征:**
- 布局: Flexbox 列方向
- 封面图片: 16:9 宽高比 (aspect-video)
- 悬停效果: 向上平移 (-translate-y-1) + 阴影 + 边框
- 分类标签: 不同颜色方案
- 圆角: 12px (rounded-xl)

### 5. SearchBar 组件（集成到 Header）

搜索输入框，集成到自定义页头中。

**Props:**
```typescript
interface SearchBarProps {
  modelValue: string
}
```

**Emits:**
```typescript
interface SearchBarEmits {
  'update:modelValue': (value: string) => void
}
```

**样式特征:**
- 左侧图标: Material Symbols search
- 输入框: 无边框，透明背景
- 聚焦状态: 主色聚焦环
- 占位符: "搜索课程名称或教师"

## 数据模型

### Course 接口

```typescript
interface Course {
  id: string
  title: string
  description: string
  author: string
  category: string
  tags: string[]
  date: string
  path: string
  slideUrl: string
  coverImage?: string  // 新增：封面图片 URL
}
```

### CategoryInfo 接口

```typescript
interface CategoryInfo {
  name: string
  count: number
}
```

### CoursesData 接口

```typescript
interface CoursesData {
  courses: Course[]
  categories: CategoryInfo[]
  tags: string[]
  stats: {
    totalCourses: number
    totalCategories: number
  }
}
```

## 正确性属性

*属性是应该在系统的所有有效执行中保持为真的特征或行为——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*


### 属性反思

在编写正确性属性之前，让我识别并消除冗余：

- 属性 2.2 和 2.3（浅色/深色模式下的图标显示）可以合并为一个属性，测试图标与主题状态的对应关系
- 属性 7.4 和 7.5（页脚的主题和响应式行为）已经被属性 7.2（页脚保持不变）所包含
- 属性 1.1 和 2.4（主题下的背景颜色和配色方案）可以合并为一个综合属性

经过反思，我们将专注于提供独特验证价值的属性。

### 正确性属性

**属性 1：主题切换往返一致性**
*对于任何*初始主题状态，切换主题两次应该返回到原始主题状态
**验证：需求 2.1**

**属性 2：主题图标对应性**
*对于任何*主题状态，切换按钮中显示的图标应该与当前主题相反（浅色模式显示深色图标，深色模式显示浅色图标）
**验证：需求 2.2, 2.3**

**属性 3：分类筛选完整性**
*对于任何*选定的分类和课程集合，筛选后显示的所有课程都应该属于该分类
**验证：需求 3.4**

**属性 4：搜索结果相关性**
*对于任何*搜索查询和课程集合，所有返回的课程应该在标题、教师、描述或标签中包含查询字符串（不区分大小写）
**验证：需求 6.1, 6.5**

**属性 5：搜索清除往返性**
*对于任何*课程集合，执行搜索然后清除搜索应该显示与初始状态相同的课程列表
**验证：需求 6.4**

**属性 6：课程卡片内容完整性**
*对于任何*课程对象，渲染的课程卡片应该包含封面图片、标题、教师姓名、描述和分类标签
**验证：需求 4.2**

**属性 7：响应式网格适应性**
*对于任何*视口宽度，课程网格应该调整列数以保持卡片可读性（窄视口显示 1 列，宽视口显示多列）
**验证：需求 4.5**

**属性 8：分类标签颜色唯一性**
*对于任何*不同的分类，它们的标签应该具有不同的背景颜色类
**验证：需求 4.4**

**属性 9：主题持久化一致性**
*对于任何*主题状态，设置主题后从 localStorage 读取的值应该与设置的值相同
**验证：需求 2.5**

**属性 10：页面更新无重载性**
*对于任何*搜索或筛选操作，课程网格应该更新而不触发页面重新加载
**验证：需求 6.2**

## 错误处理

### 数据加载错误

**场景**: 课程数据加载失败

**处理策略**:
- 显示友好的错误消息
- 提供重试选项
- 记录错误到控制台以便调试

**实现**:
```typescript
try {
  const coursesData = await loadCoursesData()
} catch (error) {
  console.error('Failed to load courses:', error)
  showErrorMessage('无法加载课程数据，请刷新页面重试')
}
```

### 搜索错误

**场景**: 搜索查询包含特殊字符或导致错误

**处理策略**:
- 清理和转义用户输入
- 使用防抖避免过度查询
- 优雅地处理空结果

**实现**:
```typescript
function sanitizeSearchQuery(query: string): string {
  return query.trim().toLowerCase()
}

const debouncedSearch = debounce((query: string) => {
  const sanitized = sanitizeSearchQuery(query)
  performSearch(sanitized)
}, 300)
```

### 主题切换错误

**场景**: localStorage 不可用或主题应用失败

**处理策略**:
- 回退到默认浅色主题
- 在内存中维护主题状态
- 不阻塞用户交互

**实现**:
```typescript
function saveTheme(theme: 'light' | 'dark') {
  try {
    localStorage.setItem('theme', theme)
  } catch (error) {
    console.warn('Failed to save theme preference:', error)
    // 继续使用内存中的主题状态
  }
}
```

### 图片加载错误

**场景**: 课程封面图片加载失败

**处理策略**:
- 显示占位符图片或渐变背景
- 不影响卡片的其他内容显示
- 提供备用视觉效果

**实现**:
```typescript
function getCourseCoverStyle(course: Course) {
  if (course.coverImage) {
    return {
      backgroundImage: `url(${course.coverImage})`,
      backgroundColor: '#e5e7eb' // 备用颜色
    }
  }
  return {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
}
```

## 测试策略

### 单元测试

使用 Vitest 进行组件单元测试：

**测试范围**:
1. **组件渲染测试**
   - 验证组件正确渲染所有必需元素
   - 测试条件渲染逻辑
   - 验证 props 正确传递

2. **事件处理测试**
   - 测试用户交互触发正确的事件
   - 验证事件处理器正确更新状态
   - 测试事件冒泡和传播

3. **状态管理测试**
   - 测试状态初始化
   - 验证状态更新逻辑
   - 测试状态派生计算

**示例测试**:
```typescript
describe('CategoryNav', () => {
  it('should render all category buttons', () => {
    const categories = [
      { name: '前端', count: 5 },
      { name: '后端', count: 3 }
    ]
    const wrapper = mount(CategoryNav, {
      props: { categories, totalCourses: 8, selectedCategory: null }
    })
    expect(wrapper.findAll('.category-item')).toHaveLength(3) // 包括"全部"
  })

  it('should emit category-change event on click', async () => {
    const wrapper = mount(CategoryNav, {
      props: { categories: [], totalCourses: 0, selectedCategory: null }
    })
    await wrapper.find('.category-item').trigger('click')
    expect(wrapper.emitted('category-change')).toBeTruthy()
  })
})
```

### 属性基础测试

使用 **fast-check** 进行属性基础测试。每个属性测试应运行至少 **100 次迭代**。

**测试库**: fast-check (JavaScript/TypeScript 的属性基础测试库)

**测试标注格式**: `**Feature: homepage-redesign, Property {number}: {property_text}**`

**测试范围**:
1. **主题切换属性**
   - 测试主题往返一致性
   - 测试主题持久化
   - 测试主题应用的完整性

2. **搜索和筛选属性**
   - 测试搜索结果相关性
   - 测试分类筛选完整性
   - 测试搜索清除往返性

3. **UI 渲染属性**
   - 测试课程卡片内容完整性
   - 测试响应式布局适应性
   - 测试分类标签颜色唯一性

**示例属性测试**:
```typescript
import fc from 'fast-check'

/**
 * Feature: homepage-redesign, Property 1: 主题切换往返一致性
 */
describe('Property 1: Theme toggle round-trip', () => {
  it('should return to original theme after toggling twice', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark'),
        (initialTheme) => {
          const themeManager = new ThemeManager(initialTheme)
          themeManager.toggle()
          themeManager.toggle()
          return themeManager.currentTheme === initialTheme
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: homepage-redesign, Property 4: 搜索结果相关性
 */
describe('Property 4: Search result relevance', () => {
  it('should return only courses matching the query', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryCourse()),
        fc.string({ minLength: 1, maxLength: 20 }),
        (courses, query) => {
          const results = searchCourses(courses, query)
          return results.every(course =>
            matchesQuery(course, query.toLowerCase())
          )
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### 集成测试

使用 Playwright 进行端到端集成测试：

**测试范围**:
1. **完整用户流程**
   - 页面加载 → 浏览课程 → 搜索 → 查看详情
   - 主题切换 → 验证所有元素更新
   - 分类筛选 → 验证结果正确

2. **跨浏览器测试**
   - Chrome, Firefox, Safari
   - 移动和桌面视口

3. **可访问性测试**
   - 键盘导航
   - 屏幕阅读器兼容性
   - ARIA 标签

**示例集成测试**:
```typescript
test('complete user journey', async ({ page }) => {
  await page.goto('/')
  
  // 验证页面加载
  await expect(page.locator('h1')).toContainText('所有课程')
  
  // 测试搜索
  await page.fill('input[placeholder*="搜索"]', 'Vue')
  await expect(page.locator('.course-card')).toHaveCount(1)
  
  // 测试分类筛选
  await page.click('text=前端')
  await expect(page.locator('.course-card')).toHaveCount(2)
  
  // 测试主题切换
  await page.click('[aria-label="切换主题"]')
  await expect(page.locator('html')).toHaveClass(/dark/)
})
```

### 视觉回归测试

使用 Playwright 的截图功能进行视觉回归测试：

**测试范围**:
1. 首页完整视图（浅色和深色模式）
2. 课程卡片悬停状态
3. 搜索结果页面
4. 移动视口布局

**示例**:
```typescript
test('visual regression - homepage light mode', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage-light.png')
})

test('visual regression - homepage dark mode', async ({ page }) => {
  await page.goto('/')
  await page.click('[aria-label="切换主题"]')
  await expect(page).toHaveScreenshot('homepage-dark.png')
})
```

## 性能考虑

### Tailwind CSS 优化

**策略**:
- 使用 CDN 版本进行快速原型开发
- 考虑在生产环境中使用 PostCSS 和 PurgeCSS 减小文件大小
- 启用 JIT（Just-In-Time）模式以获得更快的构建速度

### 图片优化

**策略**:
- 使用适当的图片格式（WebP 优先，JPEG 备用）
- 实现懒加载以提高初始页面加载速度
- 使用 `loading="lazy"` 属性
- 提供多种尺寸的响应式图片

**实现**:
```vue
<img
  :src="course.coverImage"
  :alt="course.title"
  loading="lazy"
  class="aspect-video w-full rounded-lg object-cover"
/>
```

### 搜索性能

**策略**:
- 使用防抖减少搜索频率（300ms 延迟）
- 对大型课程列表实现虚拟滚动
- 缓存搜索结果以避免重复计算

### 渲染性能

**策略**:
- 使用 Vue 的 `v-memo` 指令优化列表渲染
- 避免不必要的组件重新渲染
- 使用 `key` 属性优化列表更新

**实现**:
```vue
<CourseCard
  v-for="course in filteredCourses"
  :key="course.id"
  :course="course"
  v-memo="[course.id, selectedCategory]"
/>
```

## 可访问性

### ARIA 标签

**实现**:
- 为所有交互元素添加适当的 ARIA 标签
- 使用语义化 HTML 元素
- 确保键盘导航支持

**示例**:
```vue
<button
  aria-label="切换到深色模式"
  class="theme-toggle"
  @click="toggleTheme"
>
  <span class="material-symbols-outlined">dark_mode</span>
</button>

<input
  type="text"
  aria-label="搜索课程"
  placeholder="搜索课程名称或教师"
  v-model="searchQuery"
/>
```

### 键盘导航

**要求**:
- 所有交互元素可通过 Tab 键访问
- 使用 Enter/Space 激活按钮
- 提供跳过导航链接
- 确保焦点指示器清晰可见

### 颜色对比度

**要求**:
- 文本与背景的对比度至少为 4.5:1（WCAG AA 标准）
- 大文本（18pt+）的对比度至少为 3:1
- 使用 Tailwind 的颜色系统确保足够的对比度

## 部署考虑

### 构建配置

**VitePress 配置更新**:
```typescript
// .vitepress/config.ts
export default defineConfig({
  head: [
    // Tailwind CSS CDN
    ['script', { src: 'https://cdn.tailwindcss.com?plugins=forms,container-queries' }],
    // Google Fonts
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { 
      rel: 'stylesheet', 
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap' 
    }],
    // Material Symbols
    ['link', { 
      rel: 'stylesheet', 
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined' 
    }],
    // Tailwind 配置
    ['script', {}, `
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary": "#137fec",
              "background-light": "#f6f7f8",
              "background-dark": "#101922",
              "text-light": "#0d141b",
              "text-dark": "#e0e0e0",
              "card-light": "#ffffff",
              "card-dark": "#1a2530",
              "border-light": "#e7edf3",
              "border-dark": "#2c3a47",
            },
            fontFamily: {
              "display": ["Inter"]
            }
          }
        }
      }
    `]
  ]
})
```

### 浏览器兼容性

**目标浏览器**:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动浏览器（iOS Safari 14+, Chrome Android 90+）

**Polyfills**:
- 不需要额外的 polyfills，因为目标浏览器支持所有使用的功能

### CDN 和缓存

**策略**:
- 使用 CDN 加载 Tailwind CSS 和字体
- 配置适当的缓存头
- 使用 SRI（Subresource Integrity）确保 CDN 资源的完整性

## 迁移路径

### 阶段 1：准备（不破坏现有功能）

1. 在 VitePress 配置中添加 Tailwind CSS CDN
2. 添加 Google Fonts 和 Material Symbols
3. 创建 CustomHeader 组件（不立即使用）
4. 验证现有功能仍然正常工作

### 阶段 2：组件重构

1. 更新 HomePage.vue 以使用 Tailwind 类
2. 重构 CourseCard.vue 以匹配参考设计
3. 重构 CategoryNav.vue 以使用药丸形按钮
4. 集成 CustomHeader 替换默认页头
5. 更新 SearchBar 以集成到 CustomHeader

### 阶段 3：样式精细调整

1. 调整颜色、间距和排版以完全匹配参考设计
2. 实现悬停和交互状态
3. 优化响应式断点
4. 测试深色模式

### 阶段 4：测试和验证

1. 运行所有单元测试
2. 执行属性基础测试
3. 进行端到端测试
4. 执行可访问性审计
5. 进行视觉回归测试

### 阶段 5：优化和部署

1. 优化性能
2. 验证浏览器兼容性
3. 更新文档
4. 部署到生产环境

## 风险和缓解

### 风险 1：Tailwind CDN 性能

**描述**: 使用 CDN 版本的 Tailwind 可能导致较大的初始加载大小

**缓解策略**:
- 在原型阶段使用 CDN
- 在生产环境中考虑切换到构建时的 Tailwind
- 实现代码分割和懒加载

### 风险 2：VitePress 主题覆盖

**描述**: 自定义样式可能与 VitePress 默认主题冲突

**缓解策略**:
- 使用更高的 CSS 特异性
- 利用 Tailwind 的 `!important` 修饰符
- 在必要时使用 CSS 层叠层（@layer）

### 风险 3：浏览器兼容性

**描述**: 某些 Tailwind 功能或 CSS 特性可能在旧浏览器中不受支持

**缓解策略**:
- 定义明确的浏览器支持矩阵
- 使用 autoprefixer 添加供应商前缀
- 提供优雅降级方案

### 风险 4：维护复杂性

**描述**: 混合使用 Tailwind 和 VitePress 可能增加维护难度

**缓解策略**:
- 建立清晰的样式指南
- 记录所有自定义配置
- 提供组件使用示例
- 定期进行代码审查

## 未来增强

### 短期（1-2 个月）

1. **高级搜索**: 添加多条件搜索和过滤器
2. **课程排序**: 按日期、标题、教师排序
3. **收藏功能**: 允许用户收藏课程
4. **课程预览**: 悬停时显示更多课程信息

### 中期（3-6 个月）

1. **用户认证**: 添加登录和个人资料功能
2. **学习进度跟踪**: 记录用户的学习进度
3. **评论和评分**: 允许用户评论和评分课程
4. **推荐系统**: 基于用户兴趣推荐课程

### 长期（6+ 个月）

1. **多语言支持**: 添加英文和其他语言
2. **离线支持**: 实现 PWA 功能
3. **视频集成**: 嵌入课程视频
4. **互动练习**: 添加编码练习和测验

## 总结

本设计文档提供了重新设计课程门户首页的全面技术方案。通过使用 Tailwind CSS 和保持现有的 Vue 组件架构，我们可以实现像素级完美的设计复刻，同时保持代码的可维护性和可扩展性。

关键设计决策：
- 使用 Tailwind CSS CDN 进行快速开发
- 保持 VitePress 和 Vue 3 架构
- 实现全面的测试策略（单元、属性、集成）
- 确保可访问性和性能
- 提供清晰的迁移路径

通过遵循本设计文档，我们可以确保重新设计的首页不仅在视觉上吸引人，而且在功能上健壮、可访问且性能优异。
