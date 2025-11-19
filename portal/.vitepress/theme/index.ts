import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// 导入自定义布局
import Layout from './Layout.vue'

// 导入自定义组件
import HomePage from './components/HomePage.vue'
import CustomHeader from './components/CustomHeader.vue'
import CourseCard from './components/CourseCard.vue'
import CategoryNav from './components/CategoryNav.vue'

export default {
  extends: DefaultTheme,
  Layout,
  
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('HomePage', HomePage)
    app.component('CustomHeader', CustomHeader)
    app.component('CourseCard', CourseCard)
    app.component('CategoryNav', CategoryNav)
  }
} satisfies Theme
