<template>
  <div class="default-layout">
    <HeaderBar />
    <div class="default-layout__container">
      <SidebarMenu />
      <main class="default-layout__main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import HeaderBar from '@/ui/HeaderBar/HeaderBar.vue'
  import SidebarMenu from '@/ui/SidebarMenu/SidebarMenu.vue'
</script>

<style scoped src="./DefaultLayout.scss" />
