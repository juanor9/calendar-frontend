// ==============================
// VANA DESIGN SYSTEM - COMPONENTES UI
// Exportación de todos los componentes base del sistema
// Permite importar componentes con:
//   import { BaseButton, BaseCard, BaseModal } from '@/ui'
// ==============================

// Componentes de formulario
export { default as BaseButton } from './BaseButton/BaseButton.vue'
export { default as RegisterButton } from './RegisterButton/RegisterButton.vue'
export { default as BaseInputText } from './BaseInputText/BaseInputText.vue'

// Componentes de layout
export { default as BaseCard } from './BaseCard/BaseCard.vue'
export { default as BaseModal } from './BaseModal/BaseModal.vue'

// Componentes de feedback
export { default as BaseBadge } from './BaseBadge/BaseBadge.vue'

// Componentes de navegación
export { default as HeaderBar } from './HeaderBar/HeaderBar.vue'
export { default as SidebarMenu } from './SidebarMenu/SidebarMenu.vue'

// Componentes especializados de páginas
export { default as EmailVerificationPage } from './EmailVerificationPage/EmailVerificationPage.vue'

// Tipos TypeScript para los componentes
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
export type ButtonSize = 'small' | 'medium' | 'large'
export type InputSize = 'small' | 'medium' | 'large'
export type InputVariant = 'default' | 'floating'
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost'
export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen'