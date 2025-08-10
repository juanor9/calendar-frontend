<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    :aria-label="ariaLabel"
    :aria-pressed="pressed"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- Left Icon -->
    <span
      v-if="$slots.iconLeft && !loading"
      class="register-button__icon register-button__icon--left"
    >
      <slot name="iconLeft" />
    </span>

    <!-- Button Text -->
    <span
      v-if="!loading"
      class="register-button__text"
    >
      <slot />
    </span>

    <!-- Right Icon -->
    <span
      v-if="$slots.iconRight && !loading"
      class="register-button__icon register-button__icon--right"
    >
      <slot name="iconRight" />
    </span>

    <!-- Loading State -->
    <span
      v-if="loading"
      class="register-button__loading"
      aria-hidden="true"
    />

    <!-- Screen Reader Loading Text -->
    <span
      v-if="loading"
      class="sr-only"
    >
      {{ loadingText }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  /** Button size */
  size?: 'small' | 'medium' | 'large'
  /** Width behavior */
  width?: 'auto' | 'full'
  /** Loading state */
  loading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset'
  /** Floating action button (mobile) */
  floating?: boolean
  /** ARIA label for accessibility */
  ariaLabel?: string
  /** ARIA pressed for toggle buttons */
  pressed?: boolean
  /** Loading announcement text */
  loadingText?: string
}

interface Emits {
  /** Click event */
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  width: 'auto',
  loading: false,
  disabled: false,
  type: 'button',
  floating: false,
  ariaLabel: undefined,
  pressed: undefined,
  loadingText: 'Loading...'
})

const emit = defineEmits<Emits>()

/** Computed class list for button */
const buttonClasses = computed(() => [
  'register-button',
  `register-button--${props.variant}`,
  `register-button--${props.size}`,
  `register-button--${props.width}-width`,
  {
    'register-button--loading': props.loading,
    'register-button--disabled': props.disabled,
    'register-button--floating': props.floating
  }
])

/** Handle click events */
const handleClick = (event: MouseEvent) => {
  if (props.loading || props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<script lang="ts">
export default {
  name: 'RegisterButton',
  inheritAttrs: false
}
</script>

<style lang="scss" scoped>
@use '../../styles/tokens' as *;
@use './RegisterButton';
</style>