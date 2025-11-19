import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// 导入自定义组件
import HomePage from './components/HomePage.vue'
import CourseCard from './components/CourseCard.vue'
import CategoryNav from './components/CategoryNav.vue'
import TagCloud from './components/TagCloud.vue'
import SearchBar from './components/SearchBar.vue'

// 导入自定义样式
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 可以在这里添加自定义布局插槽
    })
  },
  
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('HomePage', HomePage)
    app.component('CourseCard', CourseCard)
    app.component('CategoryNav', CategoryNav)
    app.component('TagCloud', TagCloud)
    app.component('SearchBar', SearchBar)
  }
} satisfies Theme
