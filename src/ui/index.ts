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
export { default as DurationInput } from './DurationInput/DurationInput.vue'

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

// F002 Task Management Components
export { default as TaskCard } from './TaskCard/TaskCard.vue'
export { default as TaskList } from './TaskList/TaskList.vue'
export { default as TaskFilters } from './TaskFilters/TaskFilters.vue'
export { default as TaskSearch } from './TaskSearch/TaskSearch.vue'
export { default as TaskQuickAdd } from './TaskQuickAdd/TaskQuickAdd.vue'
export { default as TaskBulkActions } from './TaskBulkActions/TaskBulkActions.vue'
export { default as TaskForm } from './TaskForm/TaskForm.vue'
export { default as TaskStatusBadge } from './TaskStatusBadge/TaskStatusBadge.vue'
export { default as PrioritySelector } from './PrioritySelector/PrioritySelector.vue'

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

// F002 Task Management Types
export type TaskCardSize = 'compact' | 'default' | 'detailed'
export type TaskListLayout = 'grid' | 'list'
export type TaskFilterLayout = 'horizontal' | 'vertical' | 'collapsible'
export type TaskSearchVariant = 'default' | 'expandable' | 'overlay'
export type TaskQuickAddVariant = 'inline' | 'floating' | 'modal'
export type TaskBulkActionsPosition = 'floating' | 'sticky' | 'inline'