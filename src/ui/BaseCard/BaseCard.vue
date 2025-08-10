<script setup lang="ts">
  import { computed } from 'vue'

  // Props del componente Card siguiendo el sistema Vana
  const props = withDefaults(
    defineProps<{
      variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
      padding?: 'none' | 'small' | 'medium' | 'large'
      clickable?: boolean
      disabled?: boolean
      loading?: boolean
      as?: 'div' | 'article' | 'section'
    }>(),
    {
      variant: 'default',
      padding: 'medium',
      clickable: false,
      disabled: false,
      loading: false,
      as: 'div',
    }
  )

  // Emits para eventos
  const emit = defineEmits<{
    click: [event: MouseEvent]
    focus: [event: FocusEvent]
    blur: [event: FocusEvent]
  }>()

  // Clases computadas
  const cardClasses = computed(() => {
    return [
      'card',
      `card--${props.variant}`,
      `card--padding-${props.padding}`,
      {
        'card--clickable': props.clickable && !props.disabled,
        'card--disabled': props.disabled,
        'card--loading': props.loading,
      },
    ]
  })

  // Manejadores de eventos
  const handleClick = (event: MouseEvent) => {
    if (props.clickable && !props.disabled && !props.loading) {
      emit('click', event)
    }
  }

  const handleFocus = (event: FocusEvent) => {
    if (props.clickable) {
      emit('focus', event)
    }
  }

  const handleBlur = (event: FocusEvent) => {
    if (props.clickable) {
      emit('blur', event)
    }
  }
</script>

<template>
  <component
    :is="props.as"
    :class="cardClasses"
    :tabindex="props.clickable && !props.disabled ? 0 : undefined"
    :role="props.clickable ? 'button' : undefined"
    :aria-disabled="props.disabled"
    :aria-busy="props.loading"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- Indicador de carga -->
    <div v-if="props.loading" class="card__loading">
      <div class="card__spinner" aria-hidden="true"></div>
      <span class="sr-only">Cargando...</span>
    </div>

    <!-- Contenido principal -->
    <div v-else class="card__content">
      <!-- Header slot -->
      <header v-if="$slots.header" class="card__header">
        <slot name="header"></slot>
      </header>

      <!-- Contenido principal -->
      <div v-if="$slots.default" class="card__body">
        <slot></slot>
      </div>

      <!-- Footer slot -->
      <footer v-if="$slots.footer" class="card__footer">
        <slot name="footer"></slot>
      </footer>

      <!-- Actions slot -->
      <div v-if="$slots.actions" class="card__actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </component>
</template>

<style lang="scss" src="./BaseCard.scss"></style>

<!--
EJEMPLOS DE USO:

<BaseCard variant="elevated" padding="large">
  <template #header>
    <h3>Próximas reuniones</h3>
  </template>
  <p>Tienes 3 reuniones programadas para hoy</p>
  <template #actions>
    <BaseButton label="Ver todas" variant="ghost" />
  </template>
</BaseCard>

<BaseCard 
  variant="outlined" 
  clickable
  @click="openTask"
>
  <h4>Revisar propuesta de diseño</h4>
  <p>Vence mañana a las 14:00</p>
</BaseCard>

<BaseCard :loading="true">
  Cargando información...
</BaseCard>
-->
