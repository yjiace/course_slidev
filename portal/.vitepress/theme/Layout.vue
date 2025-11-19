<template>
  <HomePage v-if="frontmatter.layout === 'home'" />
  <DefaultTheme.Layout v-else />
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'

const { frontmatter } = useData()
</script>
