<script setup lang="ts">
  import { computed, onMounted, onUnmounted, nextTick, ref, watch } from 'vue'
  
  // Props del componente Modal siguiendo el sistema Vana
  const props = withDefaults(defineProps<{
    modelValue: boolean
    size?: 'small' | 'medium' | 'large' | 'fullscreen'
    centered?: boolean
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
    showCloseButton?: boolean
    preventClose?: boolean
    persistent?: boolean
    loading?: boolean
    title?: string
    subtitle?: string
    scrollable?: boolean
    zIndex?: number
  }>(), {
    size: 'medium',
    centered: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
    showCloseButton: true,
    preventClose: false,
    persistent: false,
    loading: false,
    title: undefined,
    subtitle: undefined,
    scrollable: true,
    zIndex: 1050
  })
  
  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'before-open': []
    'opened': []
    'before-close': []
    'closed': []
    'backdrop-click': [event: MouseEvent]
    'escape-key': [event: KeyboardEvent]
  }>()
  
  // Referencias
  const modalRef = ref<HTMLElement>()
  const focusableElementsSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  let previouslyFocusedElement: HTMLElement | null = null
  
  // Estado computado
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const modalClasses = computed(() => {
    return [
      'modal',
      `modal--${props.size}`,
      {
        'modal--centered': props.centered,
        'modal--scrollable': props.scrollable,
        'modal--loading': props.loading
      }
    ]
  })
  
  const overlayStyle = computed(() => ({
    zIndex: props.zIndex
  }))
  
  // Métodos
  const openModal = async () => {
    if (isOpen.value) return
    
    emit('before-open')
    isOpen.value = true
    
    await nextTick()
    
    // Guardar elemento previamente enfocado
    previouslyFocusedElement = document.activeElement as HTMLElement
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')
    
    // Enfocar el modal
    focusModal()
    
    emit('opened')
  }
  
  const closeModal = async () => {
    if (!isOpen.value || props.preventClose) return
    
    emit('before-close')
    isOpen.value = false
    
    // Restaurar scroll del body
    document.body.style.overflow = ''
    document.body.classList.remove('modal-open')
    
    // Restaurar foco anterior
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus()
      previouslyFocusedElement = null
    }
    
    emit('closed')
  }
  
  const focusModal = () => {
    if (!modalRef.value) return
    
    const focusableElements = modalRef.value.querySelectorAll(focusableElementsSelector)
    const firstFocusable = focusableElements[0] as HTMLElement
    
    if (firstFocusable) {
      firstFocusable.focus()
    } else {
      modalRef.value.focus()
    }
  }
  
  const trapFocus = (event: KeyboardEvent) => {
    if (!modalRef.value || !isOpen.value) return
    
    const focusableElements = modalRef.value.querySelectorAll(focusableElementsSelector)
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
    
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable?.focus()
        }
      }
    }
  }
  
  const handleBackdropClick = (event: MouseEvent) => {
    if (!props.closeOnBackdrop || props.preventClose) return
    
    emit('backdrop-click', event)
    
    if (event.target === event.currentTarget) {
      closeModal()
    }
  }
  
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (!isOpen.value) return
    
    if (event.key === 'Escape') {
      emit('escape-key', event)
      
      if (props.closeOnEscape && !props.preventClose) {
        closeModal()
      }
    }
  }
  
  // Watchers y efectos
  watch(isOpen, (newValue) => {
    if (newValue) {
      openModal()
    } else {
      closeModal()
    }
  })
  
  onMounted(() => {
    document.addEventListener('keydown', trapFocus)
    document.addEventListener('keydown', handleEscapeKey)
    
    if (isOpen.value) {
      openModal()
    }
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', trapFocus)
    document.removeEventListener('keydown', handleEscapeKey)
    
    // Limpiar efectos si el componente se desmonta con modal abierto
    if (isOpen.value) {
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
      
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus()
      }
    }
  })
  
  // Exponer métodos
  defineExpose({
    openModal,
    closeModal,
    focusModal
  })
</script>

<template>
  <Teleport to="body">
    <Transition
      name="modal"
      appear
    >
      <div
        v-if="isOpen"
        class="modal-overlay"
        :style="overlayStyle"
        @click="handleBackdropClick"
      >
        <div
          ref="modalRef"
          :class="modalClasses"
          role="dialog"
          :aria-modal="true"
          :aria-labelledby="props.title ? 'modal-title' : undefined"
          :aria-describedby="props.subtitle ? 'modal-subtitle' : undefined"
          tabindex="-1"
        >
          <!-- Indicador de carga -->
          <div v-if="props.loading" class="modal__loading">
            <div class="modal__spinner" aria-hidden="true"></div>
            <span class="sr-only">Cargando...</span>
          </div>
          
          <!-- Contenido del modal -->
          <div v-else class="modal__content">
            <!-- Header -->
            <header 
              v-if="props.title || props.showCloseButton || $slots.header"
              class="modal__header"
            >
              <div v-if="props.title || props.subtitle" class="modal__title-section">
                <h2 
                  v-if="props.title"
                  id="modal-title"
                  class="modal__title"
                >
                  {{ props.title }}
                </h2>
                <p
                  v-if="props.subtitle"
                  id="modal-subtitle"
                  class="modal__subtitle"
                >
                  {{ props.subtitle }}
                </p>
              </div>
              
              <!-- Header slot personalizado -->
              <slot name="header"></slot>
              
              <!-- Botón de cierre -->
              <button
                v-if="props.showCloseButton && !props.preventClose"
                type="button"
                class="modal__close-button"
                aria-label="Cerrar modal"
                @click="closeModal"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </header>
            
            <!-- Body -->
            <div class="modal__body">
              <slot></slot>
            </div>
            
            <!-- Footer -->
            <footer 
              v-if="$slots.footer"
              class="modal__footer"
            >
              <slot name="footer"></slot>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" src="./BaseModal.scss"></style>

<!-- Usage examples available in component documentation -->