<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="info-icon"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m12 16-4-4 4-4" />
    <path d="m16 12H8" />
  </svg>
</template>

<script setup lang="ts">
// InfoIcon component for toast notifications
// No props needed - uses currentColor for styling
</script>

<style lang="scss" scoped>
.info-icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -0.125em;
}
</style>