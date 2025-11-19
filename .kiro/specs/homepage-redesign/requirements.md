# 需求文档

## 简介

本文档概述了重新设计课程门户首页以匹配提供的参考设计的需求。重新设计将用 Tailwind CSS 实现替换当前基于 VitePress 的样式，完全复刻参考 HTML 文件中的视觉设计，同时保持现有功能并保留页脚部分。

## 术语表

- **门户系统（Portal）**: 基于 VitePress 的课程网站首页
- **页头（Header）**: 页面顶部的固定导航栏，包含 logo、标题、搜索框和主题切换按钮
- **分类筛选器（Category Filter）**: 用于按分类筛选课程的横向药丸形按钮行
- **课程卡片（Course Card）**: 显示课程信息的单个卡片组件，包含图片、标题、教师、描述和分类标签
- **课程网格（Course Grid）**: 包含所有课程卡片的响应式网格布局
- **主题切换（Theme Toggle）**: 在浅色和深色模式之间切换的按钮
- **Tailwind CSS**: 用于样式设计的实用优先 CSS 框架
- **VitePress**: 当前驱动门户的静态站点生成器

## 需求

### 需求 1

**用户故事:** 作为用户，我希望看到一个现代化、视觉吸引力强的页头和搜索功能，以便我可以轻松导航和搜索课程。

#### 验收标准

1. WHEN 页面加载时 THEN 门户系统 SHALL 在顶部显示固定页头，浅色模式下为白色背景，深色模式下为深色背景
2. WHEN 查看页头时 THEN 门户系统 SHALL 显示学校图标、标题"软件学院课程"、搜索输入框和主题切换按钮
3. WHEN 页面滚动时 THEN 门户系统 SHALL 保持页头固定在顶部并带有背景模糊效果
4. WHEN 用户在搜索框中输入时 THEN 门户系统 SHALL 在输入框左侧显示搜索图标
5. WHEN 用户聚焦搜索输入框时 THEN 门户系统 SHALL 提供带有聚焦环的视觉反馈

### 需求 2

**用户故事:** 作为用户，我希望在浅色和深色主题之间切换，以便我可以使用我喜欢的配色方案查看网站。

#### 验收标准

1. WHEN 用户点击主题切换按钮时 THEN 门户系统 SHALL 在浅色和深色模式之间切换
2. WHEN 处于浅色模式时 THEN 门户系统 SHALL 在切换按钮中显示深色模式图标
3. WHEN 处于深色模式时 THEN 门户系统 SHALL 在切换按钮中显示浅色模式图标
4. WHEN 主题更改时 THEN 门户系统 SHALL 将相应的配色方案应用于所有页面元素
5. WHEN 主题更改时 THEN 门户系统 SHALL 持久化用户的主题偏好

### 需求 3

**用户故事:** 作为用户，我希望看到醒目的页面标题和分类筛选器，以便我可以理解页面内容并按分类筛选课程。

#### 验收标准

1. WHEN 页面加载时 THEN 门户系统 SHALL 显示"所有课程"作为主标题，使用大号粗体排版
2. WHEN 查看分类部分时 THEN 门户系统 SHALL 在水平可换行的行中显示分类筛选按钮
3. WHEN 未选择分类时 THEN 门户系统 SHALL 用主色高亮显示"全部"按钮
4. WHEN 用户点击分类按钮时 THEN 门户系统 SHALL 高亮显示该按钮并筛选课程列表
5. WHEN 鼠标悬停在分类按钮上时 THEN 门户系统 SHALL 提供带有颜色过渡的视觉反馈

### 需求 4

**用户故事:** 作为用户，我希望看到带有图片的精美课程卡片，以便我可以快速浏览和识别感兴趣的课程。

#### 验收标准

1. WHEN 查看课程列表时 THEN 门户系统 SHALL 在响应式网格布局中显示高度相等的课程卡片
2. WHEN 查看课程卡片时 THEN 门户系统 SHALL 显示固定宽高比的封面图片、课程标题、教师姓名、描述和分类标签
3. WHEN 用户鼠标悬停在课程卡片上时 THEN 门户系统 SHALL 通过向上平移动画提升卡片并显示彩色边框
4. WHEN 查看课程卡片时 THEN 门户系统 SHALL 根据分类类型为分类标签使用不同的背景颜色
5. WHEN 视口较窄时 THEN 门户系统 SHALL 调整网格以每行显示一张卡片

### 需求 5

**用户故事:** 作为开发者，我希望使用 Tailwind CSS 进行样式设计，以便设计完全匹配参考实现。

#### 验收标准

1. WHEN 构建门户系统时 THEN 系统 SHALL 通过 CDN 使用 Tailwind CSS 进行所有样式设计
2. WHEN 应用样式时 THEN 系统 SHALL 尽可能使用 Tailwind 实用类而不是自定义 CSS
3. WHEN 配置 Tailwind 时 THEN 系统 SHALL 定义与参考设计匹配的自定义颜色（主色：#137fec）
4. WHEN 使用字体时 THEN 系统 SHALL 从 Google Fonts 加载并应用 Inter 字体系列
5. WHEN 使用图标时 THEN 系统 SHALL 使用 Material Symbols Outlined 图标字体

### 需求 6

**用户故事:** 作为用户，我希望搜索功能能够实时筛选课程，以便我可以快速找到相关课程。

#### 验收标准

1. WHEN 用户在搜索框中输入时 THEN 门户系统 SHALL 按标题、教师、描述和标签筛选课程
2. WHEN 搜索结果被筛选时 THEN 门户系统 SHALL 立即更新课程网格而无需重新加载页面
3. WHEN 搜索查询不匹配任何课程时 THEN 门户系统 SHALL 显示"无结果"消息
4. WHEN 用户清除搜索框时 THEN 门户系统 SHALL 再次显示所有课程
5. WHEN 搜索时 THEN 门户系统 SHALL 执行不区分大小写的匹配

### 需求 7

**用户故事:** 作为用户，我希望页脚保持不变，以便保留现有的页脚内容和功能。

#### 验收标准

1. WHEN 查看页面时 THEN 门户系统 SHALL 在底部显示现有的 VitePress 页脚
2. WHEN 应用重新设计时 THEN 门户系统 SHALL NOT 修改页脚的内容、样式或功能
3. WHEN 滚动到底部时 THEN 门户系统 SHALL 在所有课程内容下方显示页脚
4. WHEN 主题更改时 THEN 门户系统 SHALL 保持页脚的现有主题行为
5. WHEN 在移动设备上查看时 THEN 门户系统 SHALL 保留页脚的响应式行为

### 需求 8

**用户故事:** 作为开发者，我希望保持现有的 Vue 组件结构，以便代码库保持可维护性并与 VitePress 约定保持一致。

#### 验收标准

1. WHEN 重构组件时 THEN 系统 SHALL 保留现有的 HomePage.vue、CourseCard.vue、CategoryNav.vue 和 SearchBar.vue 组件文件
2. WHEN 更新组件时 THEN 系统 SHALL 保持现有的 props 和 emits 接口
3. WHEN 实现设计时 THEN 系统 SHALL 使用 Vue 3 Composition API 和 script setup 语法
4. WHEN 为组件添加样式时 THEN 系统 SHALL 用 Tailwind 实用类替换作用域样式
5. WHEN 集成 Tailwind 时 THEN 系统 SHALL 在 VitePress 主题中配置它而不破坏现有功能
