<script setup lang="ts">
  import { ref } from 'vue'
  import { BaseButton, BaseInputText } from '@/ui'
  const nombre = ref('')

  console.log('test')

  const test = 'ok'
</script>

<template>
  <BaseButton label="Click" variant="secondary" />
  <BaseInputText v-model="nombre" label="Nombre" />
</template>
