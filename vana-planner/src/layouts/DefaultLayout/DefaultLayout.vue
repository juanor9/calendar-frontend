<template>
  <div class="default-layout">
    <HeaderBar />
    <SidebarMenu />
    <main class="default-layout__main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/ui/HeaderBar/HeaderBar.vue'
import SidebarMenu from '@/ui/SidebarMenu/SidebarMenu.vue'
</script>

<style scoped src="./DefaultLayout.scss" />
