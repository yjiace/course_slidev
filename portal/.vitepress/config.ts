import { defineConfig } from 'vitepress'

// VitePress 配置
// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 站点基础信息
  title: '软件学院课程门户',
  description: '现代化课件系统 - 课程导航与学习平台',
  lang: 'zh-CN',

  // 基础路径配置
  base: '/',
  
  // 输出目录
  outDir: '../dist/portal',
  
  // 缓存目录
  cacheDir: '.vitepress/cache',

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '所有课程', link: '/' }
    ],

    // 侧边栏
    sidebar: [],

    // 社交链接
    socialLinks: [],

    // 页脚
    footer: {
      message: '软件学院现代化课件系统',
      copyright: 'Copyright © 2024'
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
  cleanUrls: true
})
