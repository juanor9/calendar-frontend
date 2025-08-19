<script setup lang="ts">
  import { computed } from 'vue'

  // Definición de props con todas las variantes de Vana
  const props = withDefaults(
    defineProps<{
      label?: string
      variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
      size?: 'small' | 'medium' | 'large'
      width?: 'auto' | 'full'
      disabled?: boolean
      loading?: boolean
      leftIcon?: string
      rightIcon?: string
      iconOnly?: boolean
      type?: 'button' | 'submit' | 'reset'
      ariaLabel?: string
      ariaPressed?: boolean
    }>(),
    {
      label: undefined,
      variant: 'primary',
      size: 'medium',
      width: 'auto',
      disabled: false,
      loading: false,
      leftIcon: undefined,
      rightIcon: undefined,
      iconOnly: false,
      type: 'button',
      ariaLabel: undefined,
    }
  )

  // Emits para eventos
  const emit = defineEmits<{
    click: [event: MouseEvent]
    focus: [event: FocusEvent]
    blur: [event: FocusEvent]
  }>()

  // Clases computadas para el botón
  const buttonClasses = computed(() => {
    return [
      'button',
      `button--${props.variant}`,
      `button--${props.size}`,
      `button--${props.width}-width`,
      {
        'button--disabled': props.disabled,
        'button--loading': props.loading,
        'button--icon-only': props.iconOnly,
      },
    ]
  })

  // Manejadores de eventos
  const handleClick = (event: MouseEvent) => {
    if (!props.disabled && !props.loading) {
      emit('click', event)
    }
  }

  const handleFocus = (event: FocusEvent) => {
    emit('focus', event)
  }

  const handleBlur = (event: FocusEvent) => {
    emit('blur', event)
  }
</script>

<template>
  <button
    :class="buttonClasses"
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :aria-label="props.ariaLabel || (props.iconOnly ? props.label : undefined)"
    :aria-pressed="props.ariaPressed"
    :aria-busy="props.loading"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Icono izquierdo -->
    <span
      v-if="props.leftIcon && !props.loading"
      :class="['button__icon', 'button__icon--left']"
      :aria-hidden="true"
    >
      <i :class="props.leftIcon"></i>
    </span>

    <!-- Texto del botón (oculto si es icon-only o loading) -->
    <span v-if="!props.iconOnly && props.label" :class="{ 'sr-only': props.loading }">
      {{ props.label }}
    </span>

    <!-- Icono derecho -->
    <span
      v-if="props.rightIcon && !props.loading"
      :class="['button__icon', 'button__icon--right']"
      :aria-hidden="true"
    >
      <i :class="props.rightIcon"></i>
    </span>

    <!-- Icono único (para botones icon-only) -->
    <span
      v-if="props.iconOnly && (props.leftIcon || props.rightIcon) && !props.loading"
      :class="['button__icon', 'button__icon--only']"
      :aria-hidden="true"
    >
      <i :class="props.leftIcon || props.rightIcon"></i>
    </span>

    <!-- Slot para contenido personalizado -->
    <slot></slot>
  </button>
</template>

<style lang="scss" src="./BaseButton.scss"></style>
