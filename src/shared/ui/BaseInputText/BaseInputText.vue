<script setup lang="ts">
  import { computed, ref, useId } from 'vue'
  
  // Definición de props con todas las variantes de Vana
  const props = withDefaults(defineProps<{
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel'
    size?: 'small' | 'medium' | 'large'
    variant?: 'default' | 'floating'
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    optional?: boolean
    maxlength?: number
    minlength?: number
    pattern?: string
    autocomplete?: string
    leftIcon?: string
    rightIcon?: string
    rightIconClickable?: boolean
    helpText?: string
    errorMessage?: string
    successMessage?: string
    warningMessage?: string
    ariaLabel?: string
    ariaDescribedBy?: string
  }>(), {
    label: undefined,
    placeholder: undefined,
    type: 'text',
    size: 'medium',
    variant: 'default',
    disabled: false,
    readonly: false,
    required: false,
    optional: false,
    maxlength: undefined,
    minlength: undefined,
    pattern: undefined,
    autocomplete: undefined,
    leftIcon: undefined,
    rightIcon: undefined,
    rightIconClickable: false,
    helpText: undefined,
    errorMessage: undefined,
    successMessage: undefined,
    warningMessage: undefined,
    ariaLabel: undefined,
    ariaDescribedBy: undefined
  })
  
  // Model para v-model
  const model = defineModel<string>()
  
  // Emits para eventos
  const emit = defineEmits<{
    focus: [event: FocusEvent]
    blur: [event: FocusEvent]
    input: [event: Event]
    change: [event: Event]
    keydown: [event: KeyboardEvent]
    keyup: [event: KeyboardEvent]
    rightIconClick: [event: MouseEvent]
  }>()
  
  // Estado interno
  const inputRef = ref<HTMLInputElement>()
  const fieldId = useId()
  
  // Estado de validación computado
  const validationState = computed(() => {
    if (props.errorMessage) return 'error'
    if (props.warningMessage) return 'warning'
    if (props.successMessage) return 'success'
    return 'default'
  })
  
  // Clases computadas para el contenedor
  const containerClasses = computed(() => {
    return [
      'input',
      `input--${props.size}`,
      `input--${props.variant}`,
      `input--${validationState.value}`,
      {
        'input--disabled': props.disabled,
        'input--readonly': props.readonly,
        'input--with-left-icon': props.leftIcon,
        'input--with-right-icon': props.rightIcon
      }
    ]
  })
  
  // IDs para accesibilidad
  const helpTextId = computed(() => props.helpText ? `${fieldId}-help` : undefined)
  const errorId = computed(() => props.errorMessage ? `${fieldId}-error` : undefined)
  const successId = computed(() => props.successMessage ? `${fieldId}-success` : undefined)
  const warningId = computed(() => props.warningMessage ? `${fieldId}-warning` : undefined)
  
  const ariaDescribedByIds = computed(() => {
    const ids = []
    if (helpTextId.value) ids.push(helpTextId.value)
    if (errorId.value) ids.push(errorId.value)
    if (successId.value) ids.push(successId.value)
    if (warningId.value) ids.push(warningId.value)
    if (props.ariaDescribedBy) ids.push(props.ariaDescribedBy)
    return ids.length > 0 ? ids.join(' ') : undefined
  })
  
  // Métodos públicos
  const focus = () => {
    inputRef.value?.focus()
  }
  
  const blur = () => {
    inputRef.value?.blur()
  }
  
  const select = () => {
    inputRef.value?.select()
  }
  
  // Manejadores de eventos
  const handleRightIconClick = (event: MouseEvent) => {
    if (props.rightIconClickable && !props.disabled && !props.readonly) {
      emit('rightIconClick', event)
    }
  }

  const handleRightIconKeydown = (event: KeyboardEvent) => {
    if (props.rightIconClickable && !props.disabled && !props.readonly) {
      // Convert KeyboardEvent to MouseEvent-like object for emit compatibility
      const mouseEvent = new MouseEvent('click', {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        view: event.view,
        detail: 0,
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        button: 0,
        relatedTarget: null
      })
      emit('rightIconClick', mouseEvent)
    }
  }
  
  // Exponer métodos
  defineExpose({
    focus,
    blur,
    select,
    inputRef
  })
</script>

<template>
  <div :class="containerClasses">
    <!-- Label -->
    <label 
      v-if="props.label"
      :for="fieldId"
      :class="[
        'input__label', 
        {
          'input__label--required': props.required && !props.optional,
          'input__label--optional': props.optional
        }
      ]"
    >
      {{ props.label }}
    </label>
    
    <!-- Campo de input con iconos -->
    <div class="input__wrapper">
      <!-- Icono izquierdo -->
      <span 
        v-if="props.leftIcon"
        class="input__icon input__icon--left"
        aria-hidden="true"
      >
        <i :class="props.leftIcon"></i>
      </span>
      
      <!-- Campo de input -->
      <input
        :id="fieldId"
        ref="inputRef"
        v-model="model"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :required="props.required"
        :maxlength="props.maxlength"
        :minlength="props.minlength"
        :pattern="props.pattern"
        :autocomplete="props.autocomplete"
        :aria-label="props.ariaLabel"
        :aria-describedby="ariaDescribedByIds"
        :aria-invalid="validationState === 'error'"
        class="input__field"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
        @input="emit('input', $event)"
        @change="emit('change', $event)"
        @keydown="emit('keydown', $event)"
        @keyup="emit('keyup', $event)"
      >
      
      <!-- Label flotante (solo para variante floating) -->
      <label 
        v-if="props.variant === 'floating' && props.label"
        :for="fieldId"
        :class="[
          'input__label', 
          {
            'input__label--required': props.required && !props.optional,
            'input__label--optional': props.optional
          }
        ]"
      >
        {{ props.label }}
      </label>
      
      <!-- Icono derecho -->
      <span 
        v-if="props.rightIcon"
        :class="[
          'input__icon', 
          'input__icon--right',
          { 'input__icon--clickable': props.rightIconClickable }
        ]"
        :aria-hidden="!props.rightIconClickable"
        :role="props.rightIconClickable ? 'button' : undefined"
        :tabindex="props.rightIconClickable ? 0 : undefined"
        @click="handleRightIconClick"
        @keydown.enter="handleRightIconKeydown"
        @keydown.space.prevent="handleRightIconKeydown"
      >
        <i :class="props.rightIcon"></i>
      </span>
    </div>
    
    <!-- Texto de ayuda -->
    <div 
      v-if="props.helpText"
      :id="helpTextId"
      class="input__help-text"
    >
      {{ props.helpText }}
    </div>
    
    <!-- Mensaje de éxito -->
    <div 
      v-if="props.successMessage"
      :id="successId"
      class="input__success"
      role="status"
      aria-live="polite"
    >
      {{ props.successMessage }}
    </div>
    
    <!-- Mensaje de advertencia -->
    <div 
      v-if="props.warningMessage"
      :id="warningId"
      class="input__warning"
      role="status"
      aria-live="polite"
    >
      {{ props.warningMessage }}
    </div>
    
    <!-- Mensaje de error -->
    <div 
      v-if="props.errorMessage"
      :id="errorId"
      class="input__error"
      role="alert"
      aria-live="assertive"
    >
      {{ props.errorMessage }}
    </div>
  </div>
</template>

<style lang="scss" src="./BaseInputText.scss"></style>

<!--
EJEMPLOS DE USO:

<BaseInputText 
  v-model="email"
  label="Correo electrónico"
  type="email"
  placeholder="tu@email.com"
  :required="true"
  left-icon="fas fa-envelope"
  help-text="Usaremos este correo para enviarte notificaciones"
/>

<BaseInputText 
  v-model="password"
  label="Contraseña"
  type="password"
  variant="floating"
  right-icon="fas fa-eye"
  :right-icon-clickable="true"
  @right-icon-click="togglePasswordVisibility"
/>

<BaseInputText 
  v-model="searchQuery"
  label="Buscar tareas"
  type="search"
  placeholder="Escribe para buscar..."
  size="large"
  left-icon="fas fa-search"
  right-icon="fas fa-times"
  :right-icon-clickable="true"
  @right-icon-click="clearSearch"
/>

<BaseInputText 
  v-model="taskTitle"
  label="Título de la tarea"
  placeholder="Ingresa el título"
  :maxlength="100"
  :error-message="titleError"
  @input="validateTitle"
/>
-->
