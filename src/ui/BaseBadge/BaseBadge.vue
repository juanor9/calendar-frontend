<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  // Props del componente Badge siguiendo el sistema Vana
  const props = withDefaults(
    defineProps<{
      variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
      size?: 'small' | 'medium' | 'large'
      outline?: boolean
      pill?: boolean
      removable?: boolean
      dot?: boolean
      pulse?: boolean
      disabled?: boolean
    }>(),
    {
      variant: 'neutral',
      size: 'medium',
      outline: false,
      pill: false,
      removable: false,
      dot: false,
      pulse: false,
      disabled: false,
    }
  )

  const attrs = useAttrs()

  // Emits
  const emit = defineEmits<{
    remove: [event: MouseEvent]
    click: [event: MouseEvent]
  }>()

  // Clases computadas
  const badgeClasses = computed(() => {
    return [
      'badge',
      `badge--${props.variant}`,
      `badge--${props.size}`,
      {
        'badge--outline': props.outline,
        'badge--pill': props.pill,
        'badge--removable': props.removable,
        'badge--dot': props.dot,
        'badge--pulse': props.pulse,
        'badge--disabled': props.disabled,
        'badge--clickable': !!(attrs.onClick || attrs.onMousedown),
      },
    ]
  })

  // Manejadores
  const handleRemove = (event: MouseEvent) => {
    event.stopPropagation()
    if (!props.disabled) {
      emit('remove', event)
    }
  }

  const handleClick = (event: MouseEvent) => {
    if (!props.disabled) {
      emit('click', event)
    }
  }
</script>

<template>
  <span :class="badgeClasses" :aria-disabled="props.disabled" @click="handleClick">
    <!-- Dot indicator (solo si dot=true) -->
    <span v-if="props.dot" class="badge__dot" aria-hidden="true"></span>

    <!-- Contenido principal -->
    <span v-if="!props.dot" class="badge__content">
      <slot></slot>
    </span>

    <!-- Botón de remover -->
    <button
      v-if="props.removable && !props.disabled"
      type="button"
      class="badge__remove"
      aria-label="Eliminar"
      @click="handleRemove"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </span>
</template>

<style lang="scss" src="./BaseBadge.scss"></style>

<!--
EJEMPLOS DE USO:

<BaseBadge variant="primary">Nuevo</BaseBadge>
<BaseBadge variant="success" pill>Completado</BaseBadge>
<BaseBadge variant="warning" outline>Pendiente</BaseBadge>
<BaseBadge variant="error" pulse>Urgente</BaseBadge>

<BaseBadge 
  variant="info" 
  removable
  @remove="removeTag"
>
  Etiqueta personalizada
</BaseBadge>

<BaseBadge 
  variant="primary" 
  dot 
  size="small"
/>

<BaseBadge 
  variant="neutral" 
  size="large"
  clickable
  @click="showDetails"
>
  5 tareas pendientes
</BaseBadge>
-->
