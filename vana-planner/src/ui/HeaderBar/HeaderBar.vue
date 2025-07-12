<template>
    <header class="header-bar">
      <nav class="header-bar__nav">
        <img alt="Vue logo" class="header-bar__logo" src="@/assets/images/vana-logo.png" />
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped src="./HeaderBar.scss" />
