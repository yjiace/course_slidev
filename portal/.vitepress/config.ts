import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// VitePress 配置
// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  // 站点基础信息
  title: 'SmallYoung',
  description: 'SmallYoung 现代化课件系统 - 课程导航与学习平台',
  lang: 'zh-CN',

  // 基础路径配置
  base: '/',

  // Sitemap 自动生成配置
  sitemap: {
    hostname: 'https://www.smallyoung.cn',
    transformItems: (items) => {
      // 过滤掉不需要索引的页面
      return items.filter(item => !item.url.includes('404'))
    }
  },

  // 输出目录
  outDir: '../dist/portal',

  // 缓存目录
  cacheDir: '.vitepress/cache',

  // Head 配置 - 添加外部资源和 SEO 元数据
  head: [
    // ========== 国内搜索引擎优化 ==========
    // 移动端适配声明（百度移动优先索引）
    ['meta', { name: 'applicable-device', content: 'pc,mobile' }],
    ['meta', { name: 'mobile-agent', content: 'format=html5;url=https://www.smallyoung.cn' }],
    // 百度站长验证（如需验证请替换 content 值）
    // ['meta', { name: 'baidu-site-verification', content: 'YOUR_BAIDU_CODE' }],
    // 360 站长验证
    // ['meta', { name: '360-site-verification', content: 'YOUR_360_CODE' }],
    // 搜狗站长验证
    // ['meta', { name: 'sogou_site_verification', content: 'YOUR_SOGOU_CODE' }],
    // 神马搜索验证
    // ['meta', { name: 'shenma-site-verification', content: 'YOUR_SHENMA_CODE' }],
    // 头条搜索验证
    // ['meta', { name: 'bytedance-verification-code', content: 'YOUR_TOUTIAO_CODE' }],

    // ========== 国内社交平台优化 ==========
    // 微博分享优化
    ['meta', { name: 'weibo:article:create_at', content: new Date().toISOString() }],
    // 头条/抖音分享优化（遵循 Open Graph 标准）

    // ========== 通用 SEO 元数据 ==========
    // 网站作者
    ['meta', { name: 'author', content: 'SmallYoung' }],
    // 版权声明
    ['meta', { name: 'copyright', content: 'SmallYoung' }],
    // 搜索引擎爬取指令
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    // 内容分级
    ['meta', { name: 'rating', content: 'general' }],
    // 地理位置（中国）
    ['meta', { name: 'geo.region', content: 'CN' }],
    ['meta', { name: 'geo.placename', content: 'China' }],

    // ========== Favicon ==========
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.png' }],

    // ========== 外部资源 ==========
    // Tailwind CSS CDN
    ['script', { src: 'https://cdn.tailwindcss.com?plugins=forms,container-queries' }],
    // Google Fonts - Preconnect
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // Google Fonts - Inter
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
    }],
    // Material Symbols Outlined
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
    }],
    // Tailwind 配置 - 使用轮询确保 tailwind 加载完成
    ['script', {}, `
      (function initTailwind() {
        if (typeof tailwind !== 'undefined') {
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
                  "display": ["Inter", "sans-serif"]
                },
                borderRadius: {
                  "DEFAULT": "0.25rem",
                  "lg": "0.5rem",
                  "xl": "0.75rem",
                  "full": "9999px"
                },
              },
            },
          }
        } else {
          setTimeout(initTailwind, 10)
        }
      })()
    `]
  ],

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '课程演示', link: '/courses' },
      { text: '技术文档', link: '/docs' }
    ],

    // 侧边栏 - 由 copy-docs.js 自动生成
    // 文件: portal/.vitepress/sidebar.generated.ts
    sidebar: (() => {
      try {
        // 动态导入自动生成的侧边栏配置
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { docsSidebar } = require('./sidebar.generated')
        return { '/docs/': docsSidebar }
      } catch {
        // 如果配置文件不存在，返回空配置
        return { '/docs/': [] }
      }
    })(),

    // 社交链接
    socialLinks: [],

    // 页脚
    footer: {
      message: 'SmallYoung 现代化课件系统',
      copyright: 'Copyright © 2024 SmallYoung'
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索课程',
            buttonAriaLabel: '搜索课程'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    // 文档页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 外部链接图标
    externalLinkIcon: true,

    // 深色模式切换
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    math: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    // 为图片添加懒加载
    config: (md) => {
      const defaultImageRender = md.renderer.rules.image || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))

      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx]

        // 获取图片 src，为 pub.smallyoung.cn 域名的图片添加 CDN 缩略图前缀
        const srcIndex = token.attrIndex('src')
        if (srcIndex >= 0) {
          const src = token.attrs![srcIndex][1]
          // 仅处理 pub.smallyoung.cn 域名的图片，且未添加 CDN 前缀
          if (src.includes('pub.smallyoung.cn') && !src.includes('/cdn-cgi/image/')) {
            // 在域名和路径之间插入 CDN 前缀
            const newSrc = src.replace(
              /\/\/pub\.smallyoung\.cn\//,
              '//pub.smallyoung.cn/cdn-cgi/image/quality=80/'
            )
            token.attrSet('src', newSrc)
          }
        }

        // 添加 loading="lazy" 属性
        token.attrSet('loading', 'lazy')
        return defaultImageRender(tokens, idx, options, env, self)
      }

      // Mermaid 换行支持：自动将代码块中的 \n 转换为 <br/>
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.info.trim() === 'mermaid') {
          // 处理内容中的 \n -> <br/>
          token.content = token.content.replace(/\\n/g, '<br/>')
        }
        return defaultFence!(tokens, idx, options, env, self)
      }
    }
  },

  // 最后更新时间
  lastUpdated: true,

  // 清理 URL
  cleanUrls: true,

  // Mermaid 配置
  mermaid: {
    theme: 'default',
    flowchart: {
      htmlLabels: true,
      useMaxWidth: true,
      curve: 'linear',
      padding: 20,
      nodeSpacing: 50,
      rankSpacing: 50
    },
    // 增加全局安全边距，防止内容被遮挡
    securityLevel: 'loose'
  },
  mermaidPlugin: {
    class: 'mermaid-diagram'
  },

  // 在构建时为每个页面生成 SEO 元数据和结构化数据
  transformHead({ pageData }) {
    const head: Array<[string, Record<string, string>]> = []
    const siteUrl = 'https://www.smallyoung.cn'
    const siteName = 'SmallYoung'
    const fm = pageData.frontmatter

    // 生成页面 URL
    const pageUrl = `${siteUrl}/${pageData.relativePath.replace(/\.md$/, '').replace(/index$/, '')}`

    // 处理封面图片 URL
    const getAbsoluteImageUrl = (cover: string | undefined): string => {
      if (!cover) return `${siteUrl}/favicon.png`
      if (cover.startsWith('//')) return `https:${cover}`
      if (cover.startsWith('http')) return cover
      return `${siteUrl}${cover}`
    }

    const imageUrl = getAbsoluteImageUrl(fm.cover)
    const description = fm.description || 'SmallYoung 现代化课件系统 - 课程导航与学习平台'
    const title = fm.title || siteName

    // ========== Canonical URL ==========
    head.push(['link', { rel: 'canonical', href: pageUrl }])

    // ========== 基础 Meta 标签 ==========
    if (fm.description) {
      head.push(['meta', { name: 'description', content: fm.description }])
    }
    if (fm.keywords) {
      head.push(['meta', { name: 'keywords', content: fm.keywords.join(', ') }])
    } else if (fm.tags) {
      head.push(['meta', { name: 'keywords', content: fm.tags.join(', ') }])
    }
    if (fm.author) {
      head.push(['meta', { name: 'author', content: fm.author }])
    }

    // ========== Open Graph (Facebook, LinkedIn, 微信等) ==========
    head.push(['meta', { property: 'og:type', content: fm.type === 'course' ? 'website' : 'article' }])
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:url', content: pageUrl }])
    head.push(['meta', { property: 'og:site_name', content: siteName }])
    head.push(['meta', { property: 'og:image', content: imageUrl }])
    // 图片尺寸声明（提升微信等平台预览效果）
    head.push(['meta', { property: 'og:image:width', content: '1200' }])
    head.push(['meta', { property: 'og:image:height', content: '630' }])
    head.push(['meta', { property: 'og:image:alt', content: title }])
    head.push(['meta', { property: 'og:locale', content: 'zh_CN' }])
    if (fm.date) {
      head.push(['meta', { property: 'article:published_time', content: fm.date }])
    }
    if (fm.dateModified) {
      head.push(['meta', { property: 'article:modified_time', content: fm.dateModified }])
    }
    if (fm.author) {
      head.push(['meta', { property: 'article:author', content: fm.author }])
    }
    if (fm.category) {
      head.push(['meta', { property: 'article:section', content: fm.category }])
    }
    if (fm.tags) {
      fm.tags.forEach((tag: string) => {
        head.push(['meta', { property: 'article:tag', content: tag }])
      })
    }

    // ========== Twitter Card ==========
    head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:description', content: description }])
    head.push(['meta', { name: 'twitter:image', content: imageUrl }])
    head.push(['meta', { name: 'twitter:image:alt', content: title }])

    // ========== 国内平台专用标签 ==========
    // 微信内容标识
    head.push(['meta', { itemprop: 'name', content: title }])
    head.push(['meta', { itemprop: 'description', content: description }])
    head.push(['meta', { itemprop: 'image', content: imageUrl }])
    // 今日头条/抖音
    if (fm.date) {
      head.push(['meta', { name: 'bytedance:published_time', content: fm.date }])
    }

    // ========== Schema.org 结构化数据 ==========

    // WebSite Schema（仅首页）
    if (pageData.relativePath === 'index.md') {
      const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
        description: 'SmallYoung 现代化课件系统 - 课程导航与学习平台',
        inLanguage: 'zh-CN',
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/favicon.png`
          }
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(websiteSchema)
      ] as any)
    }

    // 跳过没有标题的页面
    if (!fm.title) {
      return head
    }

    // BreadcrumbList Schema（面包屑导航）
    const pathParts = pageData.relativePath.replace(/\.md$/, '').split('/')
    if (pathParts.length > 1) {
      const breadcrumbItems = [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: siteUrl
        }
      ]

      let currentPath = ''
      pathParts.forEach((part, index) => {
        if (index === pathParts.length - 1 && part === 'index') return
        currentPath += `/${part}`
        const itemName = index === 0
          ? (part === 'docs' ? '技术文档' : part === 'courses' ? '课程演示' : part)
          : (fm.title || part)
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: index + 2,
          name: itemName,
          item: `${siteUrl}${currentPath}`
        })
      })

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems
      }
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(breadcrumbSchema)
      ] as any)
    }

    // 跳过特殊布局页面（首页、列表页等）
    const skipLayouts = ['home', 'docs', 'courses']
    if (fm.layout && skipLayouts.includes(fm.layout)) {
      return head
    }

    // 判断是否为课程内容（根据 type 或路径）
    const isCourse = fm.type === 'course' || pageData.relativePath.startsWith('courses/')

    // 生成 Article Schema（非课程内容）
    if (!isCourse) {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: fm.title,
        description: fm.description || '',
        image: imageUrl,
        datePublished: fm.date,
        dateModified: fm.dateModified || fm.date,
        author: {
          '@type': 'Person',
          name: fm.author || 'SmallYoung'
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/favicon.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl
        },
        keywords: fm.keywords?.join(', ') || fm.tags?.join(', ') || undefined
      }

      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(articleSchema)
      ] as any)
    }

    // 生成 Course Schema
    if (isCourse) {
      const courseSchema = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: fm.title,
        description: fm.description || '',
        provider: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/favicon.png`
          },
          url: siteUrl
        },
        image: imageUrl,
        url: pageUrl,
        inLanguage: 'zh-CN',
        // 课程可选元数据
        ...(fm.author && {
          author: {
            '@type': 'Person',
            name: fm.author
          }
        }),
        ...(fm.date && { dateCreated: fm.date }),
        ...(fm.dateModified && { dateModified: fm.dateModified }),
        ...(fm.duration && { timeRequired: fm.duration }),
        ...(fm.level && { educationalLevel: fm.level }),
        ...(fm.category && { about: { '@type': 'Thing', name: fm.category } }),
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: fm.duration || 'PT1H',
          inLanguage: 'zh-CN'
        }
      }

      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(courseSchema)
      ] as any)
    }

    return head
  }
}))
