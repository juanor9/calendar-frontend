<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseInputText } from '@/ui'
const nombre = ref('')
</script>

<template>
  <BaseButton label="Click" variant="secondary" />
  <BaseInputText v-model="nombre" label="Nombre" />
</template>
