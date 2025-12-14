import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// 导入自定义布局
import Layout from './Layout.vue'

// 导入自定义组件
import HomePage from './components/HomePage.vue'
import CustomHeader from './components/CustomHeader.vue'
import CourseCard from './components/CourseCard.vue'
import CategoryNav from './components/CategoryNav.vue'

// 文档相关组件
import DocsPage from './components/DocsPage.vue'
import DocCard from './components/DocCard.vue'
import DocCategoryNav from './components/DocCategoryNav.vue'
import DocDetailPage from './components/DocDetailPage.vue'
import CoursesPage from './components/CoursesPage.vue'

// 媒体组件
import AudioPlayer from './components/AudioPlayer.vue'
import VideoPlayer from './components/VideoPlayer.vue'

export default {
  extends: DefaultTheme,
  Layout,

  enhanceApp({ app, router, siteData }) {
    // 注册全局组件 - 课程
    app.component('HomePage', HomePage)
    app.component('CustomHeader', CustomHeader)
    app.component('CourseCard', CourseCard)
    app.component('CategoryNav', CategoryNav)

    // 注册全局组件 - 文档
    app.component('DocsPage', DocsPage)
    app.component('DocCard', DocCard)
    app.component('DocCategoryNav', DocCategoryNav)
    app.component('DocDetailPage', DocDetailPage)
    app.component('CoursesPage', CoursesPage)

    // 注册全局组件 - 媒体
    app.component('AudioPlayer', AudioPlayer)
    app.component('VideoPlayer', VideoPlayer)
  }
} satisfies Theme

