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

  // 输出目录
  outDir: '../dist/portal',

  // 缓存目录
  cacheDir: '.vitepress/cache',

  // Head 配置 - 添加外部资源
  head: [
    // Favicon
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
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
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  // 最后更新时间
  lastUpdated: true,

  // 清理 URL
  cleanUrls: true,

  // Mermaid 配置
  mermaid: {
    theme: 'default'
  },
  mermaidPlugin: {
    class: 'mermaid-diagram'
  },

  // 在构建时为每个页面生成 Schema.org 结构化数据
  transformHead({ pageData }) {
    const head: Array<[string, Record<string, string>]> = []
    const siteUrl = 'https://www.smallyoung.cn'
    const fm = pageData.frontmatter

    // 跳过没有标题的页面
    if (!fm.title) {
      return head
    }

    // 跳过特殊布局页面（首页、列表页等）
    const skipLayouts = ['home', 'docs', 'courses']
    if (fm.layout && skipLayouts.includes(fm.layout)) {
      return head
    }

    // 生成 Article Schema
    if (fm.type !== 'course') {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: fm.title,
        description: fm.description || '',
        image: fm.cover ? (fm.cover.startsWith('//') ? `https:${fm.cover}` : fm.cover) : undefined,
        datePublished: fm.date,
        dateModified: fm.dateModified || fm.date,
        author: {
          '@type': 'Person',
          name: fm.author || 'SmallYoung'
        },
        publisher: {
          '@type': 'Organization',
          name: 'SmallYoung',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/favicon.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteUrl}${pageData.relativePath.replace(/\.md$/, '.html').replace(/index\.html$/, '')}`
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
    if (fm.type === 'course') {
      const courseSchema = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: fm.title,
        description: fm.description || '',
        provider: {
          '@type': 'Organization',
          name: 'SmallYoung',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/favicon.png`
          }
        },
        image: fm.cover ? (fm.cover.startsWith('//') ? `https:${fm.cover}` : fm.cover) : undefined,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online'
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
