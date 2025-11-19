# 实施任务列表

- [x] 1. 初始化项目结构和基础配置


  - 创建项目根目录和子目录结构（portal、courses、scripts、.github等）
  - 初始化package.json并安装核心依赖（VitePress、Slidev、TypeScript等）
  - 配置TypeScript（tsconfig.json）和构建工具
  - 创建.gitignore文件排除构建产物和缓存
  - _需求: 1.1, 8.5_

- [x] 2. 搭建VitePress课程门户基础架构

  - [x] 2.1 配置VitePress基础设置


    - 创建portal/.vitepress/config.ts配置文件
    - 配置中文语言、站点标题、描述等基础信息
    - 设置基础路径和输出目录
    - 配置侧边栏和导航栏结构
    - _需求: 1.1, 1.2, 1.4, 7.5_
  
  - [x] 2.2 创建门户首页和布局


    - 创建portal/index.md作为门户首页
    - 设计首页布局，优先展示课程列表
    - 配置VitePress默认主题的中文化
    - _需求: 1.2, 6.3_

- [x] 3. 实现课程扫描器

  - [x] 3.1 开发课程扫描核心逻辑


    - 创建scripts/scan-courses.ts文件
    - 实现递归遍历courses目录查找slides.md文件
    - 解析Slidev文件的frontmatter提取元数据（title、category、tags、description等）
    - 生成课程唯一ID（基于路径）
    - 处理文件读取失败和元数据格式错误
    - _需求: 3.1, 3.3, 4.1_
  
  - [x] 3.2 实现元数据验证和默认值处理


    - 验证必填字段（title、category、tags、description）
    - 为可选字段提供默认值
    - 记录警告和错误日志
    - _需求: 3.4, 4.1_

- [x] 4. 实现索引生成器

  - [x] 4.1 开发索引生成核心逻辑


    - 创建scripts/generate-index.ts文件
    - 读取课程扫描器输出的数据
    - 按分类分组课程数据
    - 统计标签使用频率
    - 生成CourseIndex数据结构
    - _需求: 3.3, 4.2, 4.3_
  
  - [x] 4.2 创建VitePress Data Loader


    - 创建portal/.vitepress/data/courses.data.ts
    - 集成课程扫描器和索引生成器
    - 实现数据加载和缓存机制
    - 支持开发环境热更新
    - _需求: 3.5, 4.2_

- [x] 5. 开发VitePress门户组件

  - [x] 5.1 创建自定义主题结构


    - 创建portal/.vitepress/theme/index.ts
    - 扩展VitePress默认主题
    - 注册自定义组件
    - 配置全局样式
    - _需求: 1.2, 6.5_
  
  - [x] 5.2 实现CourseCard课程卡片组件


    - 创建portal/.vitepress/theme/components/CourseCard.vue
    - 显示课程标题、描述、分类、标签
    - 实现"查看课程"和"进入演讲模式"按钮
    - 响应式网格布局设计
    - _需求: 4.3, 5.1, 6.1, 6.4, 7.1_
  
  - [x] 5.3 实现CategoryNav分类导航组件


    - 创建portal/.vitepress/theme/components/CategoryNav.vue
    - 显示所有分类及课程数量
    - 实现分类切换和高亮功能
    - 响应式布局适配
    - _需求: 4.3, 4.5, 6.2_
  
  - [x] 5.4 实现TagCloud标签云组件


    - 创建portal/.vitepress/theme/components/TagCloud.vue
    - 根据标签频率调整字体大小
    - 实现标签点击筛选功能
    - 显示标签对应的课程数量
    - _需求: 5.1, 5.2, 5.4_
  
  - [x] 5.5 实现SearchBar搜索栏组件


    - 创建portal/.vitepress/theme/components/SearchBar.vue
    - 实现课程标题、描述、标签的全文搜索
    - 添加搜索防抖优化
    - 实时展示搜索结果
    - _需求: 5.5, 6.2_
  
  - [x] 5.6 集成组件到门户首页


    - 在portal/index.md中引入和使用自定义组件
    - 实现组件间的数据传递和状态管理
    - 优化首页布局和交互体验
    - _需求: 4.3, 5.2, 5.3, 6.3_

- [x] 6. 配置Slidev课程示例

  - [x] 6.1 创建示例课程目录结构


    - 创建courses/frontend、courses/backend、courses/devops目录
    - 为每个教研室创建示例课程子目录
    - _需求: 4.3_
  
  - [x] 6.2 创建Slidev课程模板


    - 创建示例slides.md文件（如courses/frontend/vue-basics/slides.md）
    - 配置frontmatter元数据（title、category、tags等）
    - 添加示例幻灯片内容
    - 配置Slidev主题和代码高亮
    - 启用绘图工具功能
    - _需求: 2.1, 2.4, 2.5, 4.1_

- [ ] 7. 实现双系统集成与导航
  - [ ] 7.1 配置Slidev构建输出路径
    - 为每个课程配置Slidev构建脚本
    - 设置输出目录到dist/courses对应路径
    - 确保VitePress和Slidev共享统一基础路径
    - _需求: 7.4, 8.4_
  
  - [ ] 7.2 实现门户到Slidev的跳转链接
    - 在CourseCard组件中生成正确的Slidev URL
    - 配置新标签页打开Slidev课件
    - _需求: 7.1, 7.2_
  
  - [ ] 7.3 在Slidev课件中添加返回门户链接
    - 配置Slidev全局组件或布局
    - 添加"返回课程门户"导航按钮
    - 保持中文界面风格一致性
    - _需求: 7.3, 7.5_

- [x] 8. 实现开发和构建工作流

  - [x] 8.1 配置开发环境脚本


    - 在package.json中添加dev脚本
    - 使用concurrently同时运行VitePress和Slidev开发服务器
    - 配置不同端口避免冲突
    - _需求: 8.1, 8.2_
  
  - [x] 8.2 配置生产构建脚本


    - 在package.json中添加build脚本
    - 实现VitePress门户构建
    - 实现所有Slidev课程的批量构建
    - 统一输出到dist目录
    - _需求: 8.3, 8.4_
  
  - [x] 8.3 添加构建前的课程扫描和索引生成

    - 在构建脚本中集成课程扫描器
    - 在VitePress构建前生成最新索引
    - _需求: 3.3, 4.2_

- [x] 9. 实现增量构建管理器

  - [x] 9.1 开发文件变更检测逻辑


    - 创建scripts/incremental-build.ts文件
    - 实现文件内容哈希计算
    - 使用Git diff检测变更文件
    - 维护构建缓存映射表（.buildcache/cache.json）
    - _需求: 9.2, 9.3_
  
  - [x] 9.2 实现缓存管理和复用逻辑

    - 定义BuildCache数据结构
    - 实现缓存读取和写入
    - 实现缓存完整性验证
    - 从缓存复制已构建课程文件
    - _需求: 9.3, 9.4_
  
  - [x] 9.3 实现智能构建决策

    - 判断课程文件是否变更
    - 判断门户配置是否变更
    - 判断全局依赖是否变更
    - 根据变更类型决定构建策略（增量/全量）
    - _需求: 9.2, 9.3, 9.4_
  
  - [x] 9.4 集成增量构建到构建脚本


    - 在package.json中添加build:incremental脚本
    - 替换原有的全量构建逻辑
    - 输出构建统计信息（总数、构建数、缓存数、耗时）
    - _需求: 9.2, 9.3_

- [x] 10. 配置GitHub Actions CI/CD

  - [x] 10.1 创建GitHub Actions工作流文件


    - 创建.github/workflows/deploy.yml
    - 配置触发条件（push到main分支）
    - 设置Node.js环境和依赖缓存
    - _需求: 9.1_
  
  - [x] 10.2 配置构建缓存恢复和保存

    - 使用actions/cache恢复.buildcache目录
    - 配置缓存键策略
    - 构建后保存缓存
    - _需求: 9.3_
  
  - [x] 10.3 集成增量构建步骤

    - 在工作流中调用build:incremental脚本
    - 输出构建日志和统计信息
    - _需求: 9.2, 9.5_

- [x] 11. 实现EdgeOne部署支持

  - [x] 11.1 创建EdgeOne部署脚本


    - 创建scripts/deploy-edgeone.ts文件
    - 集成腾讯云COS SDK
    - 实现静态资源上传逻辑
    - 设置正确的Content-Type和压缩
    - _需求: 10.1, 10.3_
  
  - [x] 11.2 实现增量部署逻辑

    - 检测变更的文件
    - 仅上传变更文件
    - 使用文件哈希作为版本标识
    - 自动刷新CDN缓存
    - _需求: 10.5_
  
  - [x] 11.3 配置EdgeOne部署参数


    - 创建配置文件或环境变量
    - 配置COS存储桶、区域等参数
    - 配置CDN域名和缓存规则
    - 添加部署文档说明
    - _需求: 10.2_
  
  - [x] 11.4 集成EdgeOne部署到GitHub Actions


    - 在工作流中添加部署步骤
    - 配置GitHub Secrets存储访问密钥
    - 实现部署失败重试机制
    - _需求: 9.5, 10.4_

- [x] 12. 优化和完善


  - [x] 12.1 实现性能优化

    - 为门户组件添加虚拟滚动（课程列表较多时）
    - 实现图片懒加载
    - 优化搜索防抖和节流
    - _需求: 6.2_
  
  - [x] 12.2 完善错误处理和日志

    - 为所有脚本添加详细错误日志
    - 实现构建失败时的友好提示
    - 在门户中显示课程构建状态
    - _需求: 3.1, 3.2_
  
  - [x] 12.3 添加中文文档和注释


    - 为所有配置文件添加中文注释
    - 创建README.md项目说明文档
    - 创建课程创建指南文档
    - 创建部署配置指南文档
    - _需求: 8.5, 10.2_
  
  - [ ]* 12.4 编写测试用例
    - 为课程扫描器编写单元测试
    - 为索引生成器编写单元测试
    - 为增量构建编写单元测试
    - 编写端到端测试验证完整流程
    - _需求: 3.1, 4.2, 9.2_
