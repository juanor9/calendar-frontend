<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import { useHead } from '@vueuse/head'

  useHead({
    title: 'Vana',
    meta: [{ name: 'description', content: 'Vana' }],
  })
</script>

<template>
  <h1 class="sr-only">Vana</h1>
  <RouterView />
</template>
