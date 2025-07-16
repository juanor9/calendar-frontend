<script setup lang="ts">
  const props = defineProps<{
    label: string
    variant?: 'primary' | 'secondary' | 'danger'
    disabled?: boolean
  }>()
</script>

<template>
  <button
    class="button"
    :class="[`button--${props.variant ?? 'primary'}`, props.disabled && 'button--disabled']"
    :disabled="props.disabled"
  >
    {{ props.label }}
  </button>
</template>

<style lang="scss" src="./BaseButton.scss"></style>
