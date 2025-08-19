<template>
  <div class="loading-skeleton">
    <div v-for="n in fields" :key="n" class="skeleton-field">
      <div class="skeleton-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: string
  fields?: number
}

withDefaults(defineProps<Props>(), {
  variant: 'form',
  fields: 3
})
</script>

<style scoped>
.loading-skeleton {
  padding: 1rem;
}

.skeleton-field {
  margin-bottom: 1rem;
}

.skeleton-line {
  height: 2.5rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.375rem;
}

@keyframes loading {

  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>