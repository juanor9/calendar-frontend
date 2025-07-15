<script setup lang="ts">
const model = defineModel<string>()
defineProps<{ label: string; disabled?: boolean }>()
</script>

<template>
  <label class="input">
    <span class="input__label">{{ label }}</span>
    <input
      v-model="model"
      class="input__field"
      :disabled="disabled"
      type="text"
    />
  </label>
</template>

<style lang="scss" src="./BaseInputText.scss"></style>
