/**
 * Task Management Type Definitions (F002 module)
 * Complete type system for task CRUD operations and UI components
 */

import type { Ref } from 'vue'

// ============================================================================
// Core Task Types
// ============================================================================

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing', 
  DONE = 'done',
  EXPIRED = 'expired',
  RESCHEDULED = 'rescheduled'
}

export interface Task {
  id: string
  userId: string
  title: string
  description?: string | null
  durationMinutes: number
  dueDate?: Date | string | null
  priority: TaskPriority
  status: TaskStatus
  
  // Audit trail fields
  createdAt: Date | string
  updatedAt: Date | string
  statusChangedAt?: Date | string | null
  previousStatus?: TaskStatus | null
  
  // Additional fields
  estimatedDuration?: number | null
  completionNotes?: string | null
  
  // Computed properties
  isDeleted?: boolean
  isOverdue?: boolean
  timeRemainingMinutes?: number | null
}

// ============================================================================
// Input Types for Forms and API
// ============================================================================

export interface TaskInput {
  title: string
  description?: string | null
  durationMinutes: number
  dueDate?: Date | string | null
  priority?: TaskPriority
}

export interface TaskUpdateInput {
  title?: string | null
  description?: string | null
  durationMinutes?: number | null
  dueDate?: Date | string | null
  priority?: TaskPriority | null
  status?: TaskStatus | null
  completionNotes?: string | null
}

// ============================================================================
// Filter and Pagination Types
// ============================================================================

export interface TaskFilterInput {
  status?: TaskStatus[] | null
  priority?: TaskPriority[] | null
  dueDateFrom?: Date | string | null
  dueDateTo?: Date | string | null
  createdFrom?: Date | string | null
  createdTo?: Date | string | null
  search?: string | null
  includeDeleted?: boolean
}

export enum TaskSortField {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  DUE_DATE = 'due_date', 
  PRIORITY = 'priority',
  STATUS = 'status',
  TITLE = 'title'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export interface TaskSortInput {
  field: TaskSortField
  direction: SortDirection
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string | null
  endCursor?: string | null
  totalCount: number
}

export interface TaskEdge {
  node: Task
  cursor: string
}

export interface TaskConnection {
  edges: TaskEdge[]
  pageInfo: PageInfo
}

// ============================================================================
// GraphQL Response Types
// ============================================================================

export interface TaskMutationResponse {
  success: boolean
  message: string
  task?: Task | null
  errorCode?: string | null
  processingTimeMs?: number | null
}

export interface TaskBulkMutationResponse {
  success: boolean
  message: string
  tasks: Task[]
  processedCount: number
  errorCount: number
  errors?: string[]
  processingTimeMs?: number | null
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface TaskValidationResponse {
  valid: boolean
  errors?: ValidationError[]
}

// ============================================================================
// Statistics and Analytics Types
// ============================================================================

export interface TaskStats {
  totalTasks: number
  todoCount: number
  doingCount: number
  doneCount: number
  expiredCount: number
  rescheduledCount: number
  
  lowPriorityCount: number
  mediumPriorityCount: number
  highPriorityCount: number
  criticalPriorityCount: number
  
  overdueCount: number
  dueTodayCount: number
  dueThisWeekCount: number
  
  avgCompletionTimeMinutes?: number | null
  completionRatePercentage?: number | null
}

export interface TaskStatsInput {
  dateFrom?: Date | string | null
  dateTo?: Date | string | null
  includeDeleted?: boolean
}

// ============================================================================
// Component Prop Types
// ============================================================================

export interface TaskFormProps {
  task?: Task | null
  mode?: 'create' | 'edit'
  loading?: boolean
  disabled?: boolean
}

export interface TaskFormEmits {
  submit: [task: TaskInput | TaskUpdateInput]
  cancel: []
  validate: [valid: boolean]
}

export interface TaskCardProps {
  task: Task
  selectable?: boolean
  draggable?: boolean
  size?: 'compact' | 'default' | 'detailed'
  showActions?: boolean
  showPriority?: boolean
  showDueDate?: boolean
  showDuration?: boolean
}

export interface TaskCardEmits {
  click: [task: Task]
  edit: [task: Task]
  delete: [taskId: string]
  toggle: [task: Task]
  statusChange: [taskId: string, status: TaskStatus]
  priorityChange: [taskId: string, priority: TaskPriority]
}

export interface TaskListProps {
  tasks?: Task[]
  loading?: boolean
  error?: string | null
  filters?: TaskFilterInput
  sort?: TaskSortInput
  selectable?: boolean
  draggable?: boolean
  virtualScroll?: boolean
  pageSize?: number
}

export interface TaskListEmits {
  loadMore: []
  filterChange: [filters: TaskFilterInput]
  sortChange: [sort: TaskSortInput]
  taskSelect: [taskIds: string[]]
  taskAction: [action: string, taskId: string]
  bulkAction: [action: string, taskIds: string[]]
}

// ============================================================================
// Store Types
// ============================================================================

export interface TaskState {
  // Data
  tasks: Map<string, Task>
  taskConnection: TaskConnection | null
  taskStats: TaskStats | null
  
  // UI State
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  error: string | null
  
  // Form State
  selectedTasks: Set<string>
  activeFilters: TaskFilterInput
  currentSort: TaskSortInput
  
  // Cache State
  lastFetchTime: number | null
  needsRefresh: boolean
}

export interface TaskStore {
  // State
  state: TaskState
  
  // Getters
  allTasks: Ref<Task[]>
  filteredTasks: Ref<Task[]>
  taskById: (id: string) => Task | undefined
  tasksByStatus: (status: TaskStatus) => Task[]
  tasksByPriority: (priority: TaskPriority) => Task[]
  overdueTasks: Ref<Task[]>
  dueTodayTasks: Ref<Task[]>
  selectedTasksList: Ref<Task[]>
  isTaskSelected: (id: string) => boolean
  
  // Actions
  fetchTasks: (filters?: TaskFilterInput, sort?: TaskSortInput) => Promise<TaskConnection>
  fetchTaskStats: (filters?: TaskStatsInput) => Promise<TaskStats>
  createTask: (input: TaskInput) => Promise<Task>
  updateTask: (id: string, input: TaskUpdateInput) => Promise<Task>
  deleteTask: (id: string) => Promise<boolean>
  bulkUpdateTasks: (ids: string[], input: TaskUpdateInput) => Promise<Task[]>
  bulkDeleteTasks: (ids: string[]) => Promise<boolean>
  
  // UI Actions
  selectTask: (id: string) => void
  deselectTask: (id: string) => void
  selectAllTasks: () => void
  deselectAllTasks: () => void
  toggleTaskSelection: (id: string) => void
  
  // Filter Actions
  setFilters: (filters: TaskFilterInput) => void
  clearFilters: () => void
  setSort: (sort: TaskSortInput) => void
  
  // Cache Actions
  invalidateCache: () => void
  refreshTasks: () => Promise<void>
}

// ============================================================================
// Validation Types
// ============================================================================

export interface TaskValidationRules {
  title: {
    required: boolean
    minLength: number
    maxLength: number
  }
  description: {
    maxLength: number
  }
  durationMinutes: {
    required: boolean
    min: number
    max: number
    step: number
  }
  dueDate: {
    required: boolean
    future: boolean
  }
  priority: {
    required: boolean
    values: TaskPriority[]
  }
}

export interface TaskFormValidation {
  title?: string
  description?: string
  durationMinutes?: string
  dueDate?: string
  priority?: string
}

// ============================================================================
// Utility Types
// ============================================================================

export interface TaskDisplayOptions {
  showDescription: boolean
  showDueDate: boolean
  showPriority: boolean
  showDuration: boolean
  showStatus: boolean
  showActions: boolean
  compactMode: boolean
}

export interface TaskActionItem {
  key: string
  label: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'danger'
  requiresConfirmation?: boolean
  confirmationMessage?: string
  disabled?: boolean
  visible?: boolean
}

export type TaskFilterPreset = {
  name: string
  label: string
  description?: string
  filters: TaskFilterInput
  sort?: TaskSortInput
}

// ============================================================================
// Export functionality
// ============================================================================

export interface TaskExportOptions {
  format: 'json' | 'csv' | 'pdf'
  filters?: TaskFilterInput
  includeDeleted?: boolean
  fields?: string[]
}

export interface TaskExportResponse {
  success: boolean
  message: string
  exportUrl?: string | null
  format: string
  expiresAt?: Date | string | null
  processingTimeMs?: number | null
}

// ============================================================================
// Default Values and Constants
// ============================================================================

export const TASK_VALIDATION_RULES: TaskValidationRules = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 120
  },
  description: {
    maxLength: 1000
  },
  durationMinutes: {
    required: true,
    min: 5,
    max: 480,
    step: 5
  },
  dueDate: {
    required: false,
    future: true
  },
  priority: {
    required: true,
    values: Object.values(TaskPriority)
  }
}

export const DEFAULT_TASK_SORT: TaskSortInput = {
  field: TaskSortField.CREATED_AT,
  direction: SortDirection.DESC
}

export const DEFAULT_FILTERS: TaskFilterInput = {
  status: null,
  priority: null,
  dueDateFrom: null,
  dueDateTo: null,
  createdFrom: null,
  createdTo: null,
  search: null,
  includeDeleted: false
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: '#10B981',      // Green
  [TaskPriority.MEDIUM]: '#F59E0B',   // Yellow  
  [TaskPriority.HIGH]: '#EF4444',     // Red
  [TaskPriority.CRITICAL]: '#DC2626'  // Dark Red
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: '#6B7280',       // Gray
  [TaskStatus.DOING]: '#3B82F6',      // Blue
  [TaskStatus.DONE]: '#10B981',       // Green
  [TaskStatus.EXPIRED]: '#EF4444',    // Red
  [TaskStatus.RESCHEDULED]: '#F59E0B' // Yellow
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Baja',
  [TaskPriority.MEDIUM]: 'Media',
  [TaskPriority.HIGH]: 'Alta',
  [TaskPriority.CRITICAL]: 'Crítica'
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'Pendiente',
  [TaskStatus.DOING]: 'En Progreso',
  [TaskStatus.DONE]: 'Completada',
  [TaskStatus.EXPIRED]: 'Vencida',
  [TaskStatus.RESCHEDULED]: 'Reprogramada'
}