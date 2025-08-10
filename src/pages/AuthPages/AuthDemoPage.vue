<template>
  <div class="auth-demo-page">
    <AuthDemo />
  </div>
</template>

<script setup lang="ts">
  import AuthDemo from '@/components/auth/AuthDemo.vue'
</script>

<style lang="scss" scoped>
  .auth-demo-page {
    min-height: 100vh;
    background-color: var(--color-gray-50, #f9fafb);
    padding: 1rem;
  }
</style>
