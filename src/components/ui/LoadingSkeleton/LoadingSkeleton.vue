<template>
  <div 
    class="loading-skeleton"
    :class="[
      `loading-skeleton--${variant}`,
      { 'loading-skeleton--animated': animated }
    ]"
    role="status"
    :aria-label="ariaLabel"
  >
    <!-- Text skeleton -->
    <div v-if="variant === 'text'" class="loading-skeleton__text">
      <div 
        v-for="line in lines"
        :key="line"
        class="loading-skeleton__line"
        :class="{ 'loading-skeleton__line--short': line === lines && shortLastLine }"
      />
    </div>

    <!-- Card skeleton -->
    <div v-else-if="variant === 'card'" class="loading-skeleton__card">
      <div v-if="showAvatar" class="loading-skeleton__avatar" />
      <div class="loading-skeleton__card-content">
        <div class="loading-skeleton__line loading-skeleton__line--title" />
        <div 
          v-for="line in lines"
          :key="line"
          class="loading-skeleton__line"
          :class="{ 'loading-skeleton__line--short': line === lines }"
        />
      </div>
    </div>

    <!-- Form skeleton -->
    <div v-else-if="variant === 'form'" class="loading-skeleton__form">
      <div 
        v-for="field in fields"
        :key="field"
        class="loading-skeleton__form-field"
      >
        <div class="loading-skeleton__line loading-skeleton__line--label" />
        <div class="loading-skeleton__input" />
      </div>
      <div class="loading-skeleton__button" />
    </div>

    <!-- Button skeleton -->
    <div v-else-if="variant === 'button'" class="loading-skeleton__button" />

    <!-- Avatar skeleton -->
    <div v-else-if="variant === 'avatar'" class="loading-skeleton__avatar" />

    <!-- Custom content -->
    <div v-else-if="variant === 'custom'">
      <slot />
    </div>

    <!-- Default rectangle -->
    <div v-else class="loading-skeleton__rectangle" />

    <!-- Screen reader announcement -->
    <span class="sr-only">{{ loadingText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'card' | 'form' | 'button' | 'avatar' | 'rectangle' | 'custom'
  lines?: number
  fields?: number
  animated?: boolean
  showAvatar?: boolean
  shortLastLine?: boolean
  width?: string
  height?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'rectangle',
  lines: 3,
  fields: 3,
  animated: true,
  showAvatar: false,
  shortLastLine: true,
  width: undefined,
  height: undefined,
  ariaLabel: 'Cargando contenido'
})

const loadingText = computed((): string => {
  switch (props.variant) {
    case 'text':
      return 'Cargando texto...'
    case 'card':
      return 'Cargando tarjeta...'
    case 'form':
      return 'Cargando formulario...'
    case 'button':
      return 'Cargando botón...'
    case 'avatar':
      return 'Cargando avatar...'
    default:
      return 'Cargando...'
  }
})
</script>

<style lang="scss" scoped>
.loading-skeleton {
  --skeleton-color: var(--color-background-secondary, #f3f4f6);
  --skeleton-highlight: var(--color-background-tertiary, #e5e7eb);
  
  &--animated {

    .loading-skeleton__line,
    .loading-skeleton__input,
    .loading-skeleton__button,
    .loading-skeleton__avatar,
    .loading-skeleton__rectangle {
      position: relative;
      overflow: hidden;
      
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent,
          var(--skeleton-highlight),
          transparent
        );
        transform: translateX(-100%);
        animation: shimmer 1.5s infinite;
      }
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  &__line {
    height: 1rem;
    background: var(--skeleton-color);
    border-radius: var(--border-radius-sm);
    
    &--title {
      height: 1.25rem;
      width: 60%;
    }
    
    &--label {
      height: 0.875rem;
      width: 40%;
      margin-bottom: var(--spacing-xs);
    }
    
    &--short {
      width: 75%;
    }
  }

  &__card {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--border-radius-md);
    background: var(--color-background-primary);
  }

  &__card-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  &__form-field {
    display: flex;
    flex-direction: column;
  }

  &__input {
    height: 48px;
    background: var(--skeleton-color);
    border-radius: var(--border-radius-md);
  }

  &__button {
    height: 48px;
    width: 120px;
    background: var(--skeleton-color);
    border-radius: var(--border-radius-md);
    
    .loading-skeleton__form & {
      width: 100%;
      margin-top: var(--spacing-md);
    }
  }

  &__avatar {
    width: 48px;
    height: 48px;
    background: var(--skeleton-color);
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__rectangle {
    width: 100%;
    height: 200px;
    background: var(--skeleton-color);
    border-radius: var(--border-radius-md);
  }
}

// Animation
@keyframes shimmer {

  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

// Responsive adjustments
@media (width <= 640px) {

  .loading-skeleton {

    &__card {
      padding: var(--spacing-sm);
      gap: var(--spacing-sm);
    }
    
    &__avatar {
      width: 40px;
      height: 40px;
    }
  }
}

// Screen reader only class

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Reduce motion for accessibility
@media (prefers-reduced-motion: reduce) {

  .loading-skeleton--animated {

    .loading-skeleton__line,
    .loading-skeleton__input,
    .loading-skeleton__button,
    .loading-skeleton__avatar,
    .loading-skeleton__rectangle {

      &::after {
        animation: none;
      }
    }
  }
}
</style>