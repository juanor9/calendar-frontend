/**
 * Task GraphQL Service (F002 module)
 * Apollo Client service for task CRUD operations with optimistic updates
 * and comprehensive error handling
 */

import { gql } from '@apollo/client/core'
import type { 
  Task, 
  TaskInput, 
  TaskUpdateInput,
  TaskFilterInput,
  TaskSortInput,
  TaskConnection,
  TaskMutationResponse,
  TaskBulkMutationResponse,
  TaskStats,
  TaskStatsInput,
  TaskValidationResponse,
  TaskExportOptions,
  TaskExportResponse
} from '@/types/task'
import { apolloClient } from '@/utils/apollo-client'
import { useAuth } from '@/composables/useAuth'

// ============================================================================
// GraphQL Fragments
// ============================================================================

export const TASK_FRAGMENT = gql`
  fragment TaskFields on Task {
    id
    userId
    title
    description
    durationMinutes
    dueDate
    priority
    status
    createdAt
    updatedAt
    statusChangedAt
    previousStatus
    estimatedDuration
    completionNotes
    isDeleted
    isOverdue
    timeRemainingMinutes
  }
`

export const TASK_STATS_FRAGMENT = gql`
  fragment TaskStatsFields on TaskStats {
    totalTasks
    todoCount
    doingCount
    doneCount
    expiredCount
    rescheduledCount
    lowPriorityCount
    mediumPriorityCount
    highPriorityCount
    criticalPriorityCount
    overdueCount
    dueTodayCount
    dueThisWeekCount
    avgCompletionTimeMinutes
    completionRatePercentage
  }
`

export const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfoFields on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
    totalCount
  }
`

export const TASK_CONNECTION_FRAGMENT = gql`
  fragment TaskConnectionFields on TaskConnection {
    edges {
      node {
        ...TaskFields
      }
      cursor
    }
    pageInfo {
      ...PageInfoFields
    }
  }
  ${TASK_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`

export const MUTATION_RESPONSE_FRAGMENT = gql`
  fragment MutationResponseFields on TaskMutationResponse {
    success
    message
    task {
      ...TaskFields
    }
    errorCode
    processingTimeMs
  }
  ${TASK_FRAGMENT}
`

export const VALIDATION_ERROR_FRAGMENT = gql`
  fragment ValidationErrorFields on ValidationError {
    field
    message
    code
  }
`

// ============================================================================
// GraphQL Queries
// ============================================================================

export const GET_TASKS = gql`
  query GetTasks(
    $first: Int
    $after: String
    $filters: TaskFilterInput
    $sort: TaskSortInput
  ) {
    tasks(
      first: $first
      after: $after
      filters: $filters
      sort: $sort
    ) {
      ...TaskConnectionFields
    }
  }
  ${TASK_CONNECTION_FRAGMENT}
`

export const GET_TASK_BY_ID = gql`
  query GetTaskById($id: ID!) {
    task(id: $id) {
      ...TaskFields
    }
  }
  ${TASK_FRAGMENT}
`

export const GET_TASK_STATS = gql`
  query GetTaskStats($input: TaskStatsInput) {
    taskStats(input: $input) {
      ...TaskStatsFields
    }
  }
  ${TASK_STATS_FRAGMENT}
`

export const SEARCH_TASKS = gql`
  query SearchTasks(
    $query: String!
    $first: Int
    $after: String
    $filters: TaskFilterInput
  ) {
    searchTasks(
      query: $query
      first: $first
      after: $after
      filters: $filters
    ) {
      ...TaskConnectionFields
    }
  }
  ${TASK_CONNECTION_FRAGMENT}
`

export const VALIDATE_TASK = gql`
  query ValidateTask($input: TaskInput!) {
    validateTask(input: $input) {
      valid
      errors {
        ...ValidationErrorFields
      }
    }
  }
  ${VALIDATION_ERROR_FRAGMENT}
`

// ============================================================================
// GraphQL Mutations
// ============================================================================

export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      ...MutationResponseFields
    }
  }
  ${MUTATION_RESPONSE_FRAGMENT}
`

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: TaskUpdateInput!) {
    updateTask(id: $id, input: $input) {
      ...MutationResponseFields
    }
  }
  ${MUTATION_RESPONSE_FRAGMENT}
`

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      message
      errorCode
      processingTimeMs
    }
  }
`

export const BULK_UPDATE_TASKS = gql`
  mutation BulkUpdateTasks($ids: [ID!]!, $input: TaskUpdateInput!) {
    bulkUpdateTasks(ids: $ids, input: $input) {
      success
      message
      tasks {
        ...TaskFields
      }
      processedCount
      errorCount
      errors
      processingTimeMs
    }
  }
  ${TASK_FRAGMENT}
`

export const BULK_DELETE_TASKS = gql`
  mutation BulkDeleteTasks($ids: [ID!]!) {
    bulkDeleteTasks(ids: $ids) {
      success
      message
      processedCount
      errorCount
      errors
      processingTimeMs
    }
  }
`

export const EXPORT_TASKS = gql`
  mutation ExportTasks($input: TaskExportInput!) {
    exportTasks(input: $input) {
      success
      message
      exportUrl
      format
      expiresAt
      processingTimeMs
    }
  }
`

// ============================================================================
// GraphQL Subscriptions
// ============================================================================

export const TASK_UPDATED = gql`
  subscription TaskUpdated($userId: ID!) {
    taskUpdated(userId: $userId) {
      ...TaskFields
    }
  }
  ${TASK_FRAGMENT}
`

export const TASK_DELETED = gql`
  subscription TaskDeleted($userId: ID!) {
    taskDeleted(userId: $userId) {
      id
      userId
    }
  }
`

export const TASK_STATS_UPDATED = gql`
  subscription TaskStatsUpdated($userId: ID!) {
    taskStatsUpdated(userId: $userId) {
      ...TaskStatsFields
    }
  }
  ${TASK_STATS_FRAGMENT}
`

// ============================================================================
// Service Class
// ============================================================================

export class TaskService {
  private apolloClient = apolloClient
  
  constructor() {
    // Setup error handling
    this.setupErrorHandling()
  }

  private setupErrorHandling() {
    // Apollo Client error handling is configured in apollo-client.ts
    // Additional task-specific error handling can be added here
  }

  /**
   * Fetch paginated list of tasks with filtering and sorting
   */
  async getTasks(options: {
    first?: number
    after?: string | null
    filters?: TaskFilterInput
    sort?: TaskSortInput
  } = {}): Promise<TaskConnection> {
    try {
      const { first = 20, after, filters, sort } = options
      
      const result = await this.apolloClient.query({
        query: GET_TASKS,
        variables: {
          first,
          after,
          filters,
          sort
        },
        fetchPolicy: 'cache-first',
        errorPolicy: 'all'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      return result.data.tasks as TaskConnection
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw this.handleError(error, 'Failed to load tasks')
    }
  }

  /**
   * Fetch a single task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    try {
      const result = await this.apolloClient.query({
        query: GET_TASK_BY_ID,
        variables: { id },
        fetchPolicy: 'cache-first',
        errorPolicy: 'all'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      return result.data.task as Task | null
    } catch (error) {
      console.error('Error fetching task:', error)
      throw this.handleError(error, 'Failed to load task')
    }
  }

  /**
   * Get task statistics
   */
  async getTaskStats(input?: TaskStatsInput): Promise<TaskStats> {
    try {
      const result = await this.apolloClient.query({
        query: GET_TASK_STATS,
        variables: { input },
        fetchPolicy: 'cache-first',
        errorPolicy: 'all'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      return result.data.taskStats as TaskStats
    } catch (error) {
      console.error('Error fetching task stats:', error)
      throw this.handleError(error, 'Failed to load task statistics')
    }
  }

  /**
   * Search tasks with full-text search
   */
  async searchTasks(options: {
    query: string
    first?: number
    after?: string | null
    filters?: TaskFilterInput
  }): Promise<TaskConnection> {
    try {
      const { query, first = 20, after, filters } = options
      
      const result = await this.apolloClient.query({
        query: SEARCH_TASKS,
        variables: {
          query,
          first,
          after,
          filters
        },
        fetchPolicy: 'network-only', // Always fetch fresh search results
        errorPolicy: 'all'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      return result.data.searchTasks as TaskConnection
    } catch (error) {
      console.error('Error searching tasks:', error)
      throw this.handleError(error, 'Failed to search tasks')
    }
  }

  /**
   * Validate task input before submission
   */
  async validateTask(input: TaskInput): Promise<TaskValidationResponse> {
    try {
      const result = await this.apolloClient.query({
        query: VALIDATE_TASK,
        variables: { input },
        fetchPolicy: 'no-cache'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      return result.data.validateTask as TaskValidationResponse
    } catch (error) {
      console.error('Error validating task:', error)
      throw this.handleError(error, 'Failed to validate task')
    }
  }

  /**
   * Create a new task with optimistic updates
   */
  async createTask(input: TaskInput): Promise<Task> {
    try {
      // Optimistic task creation
      const tempId = `temp-${Date.now()}`
      const optimisticTask: Task = {
        id: tempId,
        userId: useAuth().user.value?.sub || '',
        title: input.title,
        description: input.description || null,
        durationMinutes: input.durationMinutes,
        dueDate: input.dueDate || null,
        priority: (input.priority || 'medium') as Task['priority'],
        status: 'todo' as Task['status'],
        createdAt: new Date(),
        updatedAt: new Date(),
        statusChangedAt: null,
        previousStatus: null,
        estimatedDuration: null,
        completionNotes: null,
        isDeleted: false,
        isOverdue: false,
        timeRemainingMinutes: null
      }

      const result = await this.apolloClient.mutate({
        mutation: CREATE_TASK,
        variables: { input },
        optimisticResponse: {
          createTask: {
            __typename: 'TaskMutationResponse',
            success: true,
            message: 'Task created successfully',
            task: optimisticTask,
            errorCode: null,
            processingTimeMs: null
          }
        },
        update: (cache, { data }) => {
          if (data?.createTask.success && data.createTask.task) {
            // Update cache with new task
            this.updateTaskCache(cache, data.createTask.task, 'create')
          }
        },
        errorPolicy: 'all'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      const response = result.data?.createTask as TaskMutationResponse
      if (!response.success || !response.task) {
        throw new Error(response.message || 'Failed to create task')
      }

      return response.task
    } catch (error) {
      console.error('Error creating task:', error)
      throw this.handleError(error, 'Failed to create task')
    }
  }

  /**
   * Update an existing task with optimistic updates
   */
  async updateTask(id: string, input: TaskUpdateInput): Promise<Task> {
    try {
      const result = await this.apolloClient.mutate({
        mutation: UPDATE_TASK,
        variables: { id, input },
        optimisticResponse: {
          updateTask: {
            __typename: 'TaskMutationResponse',
            success: true,
            message: 'Task updated successfully',
            task: {
              __typename: 'Task',
              id,
              ...input,
              updatedAt: new Date()
            },
            errorCode: null,
            processingTimeMs: null
          }
        },
        update: (cache, { data }) => {
          if (data?.updateTask.success && data.updateTask.task) {
            // Update cache
            this.updateTaskCache(cache, data.updateTask.task, 'update')
          }
        },
        errorPolicy: 'all'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      const response = result.data?.updateTask as TaskMutationResponse
      if (!response.success || !response.task) {
        throw new Error(response.message || 'Failed to update task')
      }

      return response.task
    } catch (error) {
      console.error('Error updating task:', error)
      throw this.handleError(error, 'Failed to update task')
    }
  }

  /**
   * Delete a task with optimistic updates
   */
  async deleteTask(id: string): Promise<boolean> {
    try {
      const result = await this.apolloClient.mutate({
        mutation: DELETE_TASK,
        variables: { id },
        optimisticResponse: {
          deleteTask: {
            __typename: 'TaskMutationResponse',
            success: true,
            message: 'Task deleted successfully',
            errorCode: null,
            processingTimeMs: null
          }
        },
        update: (cache) => {
          // Remove task from cache
          this.removeTaskFromCache(cache, id)
        },
        errorPolicy: 'all'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      const response = result.data?.deleteTask
      return response?.success || false
    } catch (error) {
      console.error('Error deleting task:', error)
      throw this.handleError(error, 'Failed to delete task')
    }
  }

  /**
   * Bulk update multiple tasks
   */
  async bulkUpdateTasks(ids: string[], input: TaskUpdateInput): Promise<Task[]> {
    try {
      const result = await this.apolloClient.mutate({
        mutation: BULK_UPDATE_TASKS,
        variables: {
          ids,
          input
        },
        errorPolicy: 'all'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      const response = result.data?.bulkUpdateTasks as TaskBulkMutationResponse
      if (!response.success) {
        throw new Error(response.message || 'Failed to update tasks')
      }

      return response.tasks
    } catch (error) {
      console.error('Error bulk updating tasks:', error)
      throw this.handleError(error, 'Failed to update multiple tasks')
    }
  }

  /**
   * Bulk delete multiple tasks
   */
  async bulkDeleteTasks(ids: string[]): Promise<boolean> {
    try {
      const result = await this.apolloClient.mutate({
        mutation: BULK_DELETE_TASKS,
        variables: { ids },
        update: (cache) => {
          // Remove tasks from cache
          ids.forEach(id => this.removeTaskFromCache(cache, id))
        },
        errorPolicy: 'all'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      const response = result.data?.bulkDeleteTasks
      return response?.success || false
    } catch (error) {
      console.error('Error bulk deleting tasks:', error)
      throw this.handleError(error, 'Failed to delete multiple tasks')
    }
  }

  /**
   * Export tasks in various formats
   */
  async exportTasks(options: TaskExportOptions): Promise<TaskExportResponse> {
    try {
      const result = await this.apolloClient.mutate({
        mutation: EXPORT_TASKS,
        variables: {
          input: {
            format: options.format,
            filters: options.filters,
            includeDeleted: options.includeDeleted || false
          }
        },
        errorPolicy: 'all'
      })

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      const response = result.data?.exportTasks as TaskExportResponse
      if (!response.success) {
        throw new Error(response.message || 'Failed to export tasks')
      }

      return response
    } catch (error) {
      console.error('Error exporting tasks:', error)
      throw this.handleError(error, 'Failed to export tasks')
    }
  }

  /**
   * Subscribe to task updates for real-time sync
   */
  subscribeToTaskUpdates(userId: string) {
    return this.apolloClient.subscribe({
      query: TASK_UPDATED,
      variables: { userId }
    })
  }

  /**
   * Subscribe to task deletions for real-time sync
   */
  subscribeToTaskDeletions(userId: string) {
    return this.apolloClient.subscribe({
      query: TASK_DELETED,
      variables: { userId }
    })
  }

  /**
   * Subscribe to task statistics updates
   */
  subscribeToTaskStats(userId: string) {
    return this.apolloClient.subscribe({
      query: TASK_STATS_UPDATED,
      variables: { userId }
    })
  }

  // ============================================================================
  // Private Helpers
  // ============================================================================

  private updateTaskCache(cache: unknown, task: Task, operation: 'create' | 'update') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cacheApi = cache as any
      
      // Update individual task in cache
      cacheApi.writeQuery({
        query: GET_TASK_BY_ID,
        variables: { id: task.id },
        data: { task }
      })

      // Update tasks list in cache for different variable combinations
      const possibleQueries = [
        { variables: {} },
        { variables: { first: 20 } },
        { variables: { first: 20, filters: {}, sort: {} } }
      ]

      possibleQueries.forEach(({ variables }) => {
        try {
          const existingData = cacheApi.readQuery({ 
            query: GET_TASKS,
            variables
          })
          
          if (existingData && existingData.tasks) {
            const updatedTasks = [...existingData.tasks.edges]
            
            if (operation === 'create') {
              // Add new task to beginning
              updatedTasks.unshift({
                __typename: 'TaskEdge',
                node: task,
                cursor: `cursor-${task.id}`
              })
            } else {
              // Update existing task
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const index = updatedTasks.findIndex((edge: any) => edge.node.id === task.id)
              if (index > -1) {
                updatedTasks[index] = {
                  ...updatedTasks[index],
                  node: task
                }
              }
            }
            
            cacheApi.writeQuery({
              query: GET_TASKS,
              variables,
              data: {
                tasks: {
                  __typename: 'TaskConnection',
                  ...existingData.tasks,
                  edges: updatedTasks,
                  pageInfo: {
                    ...existingData.tasks.pageInfo,
                    totalCount: operation === 'create' 
                      ? existingData.tasks.pageInfo.totalCount + 1
                      : existingData.tasks.pageInfo.totalCount
                  }
                }
              }
            })
          }
        } catch {
          // Query doesn't exist in cache, skip silently
        }
      })

      // Invalidate related queries that might need updating
      cacheApi.evict({ fieldName: 'taskStats' })
      cacheApi.gc()
      
    } catch (error) {
      console.warn('Could not update task cache:', error)
    }
  }

  private removeTaskFromCache(cache: unknown, taskId: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cacheApi = cache as any
      
      // Remove individual task from cache
      cacheApi.evict({ id: `Task:${taskId}` })
      
      // Update tasks lists in cache for different variable combinations
      const possibleQueries = [
        { variables: {} },
        { variables: { first: 20 } },
        { variables: { first: 20, filters: {}, sort: {} } }
      ]

      possibleQueries.forEach(({ variables }) => {
        try {
          const existingData = cacheApi.readQuery({ 
            query: GET_TASKS,
            variables
          })
          
          if (existingData && existingData.tasks) {
            const updatedTasks = existingData.tasks.edges.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (edge: any) => edge.node.id !== taskId
            )
            
            cacheApi.writeQuery({
              query: GET_TASKS,
              variables,
              data: {
                tasks: {
                  __typename: 'TaskConnection',
                  ...existingData.tasks,
                  edges: updatedTasks,
                  pageInfo: {
                    ...existingData.tasks.pageInfo,
                    totalCount: Math.max(0, existingData.tasks.pageInfo.totalCount - 1)
                  }
                }
              }
            })
          }
        } catch {
          // Query doesn't exist in cache, skip silently
        }
      })

      // Invalidate related queries
      cacheApi.evict({ fieldName: 'taskStats' })
      cacheApi.gc()
      
    } catch (error) {
      console.warn('Could not remove task from cache:', error)
    }
  }

  /**
   * Retry a GraphQL operation with exponential backoff
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        
        // Don't retry on auth errors or client errors
        if (this.isNonRetryableError(error)) {
          throw lastError
        }
        
        // Last attempt, throw the error
        if (attempt === maxRetries) {
          throw lastError
        }
        
        // Wait with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        
        console.warn(`Retrying operation after error (attempt ${attempt + 1}/${maxRetries + 1}):`, lastError.message)
      }
    }
    
    throw lastError!
  }

  /**
   * Check if error should not be retried
   */
  private isNonRetryableError(error: unknown): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any
    
    // Don't retry auth errors
    if (err?.networkError?.statusCode === 401 || err?.networkError?.statusCode === 403) {
      return true
    }
    
    // Don't retry GraphQL auth errors
    if (err?.graphQLErrors?.some((gqlError: { extensions?: { code: string } }) => 
      gqlError.extensions?.code === 'UNAUTHENTICATED' || 
      gqlError.extensions?.code === 'FORBIDDEN'
    )) {
      return true
    }
    
    // Don't retry validation errors (4xx range)
    if (err?.networkError?.statusCode >= 400 && err?.networkError?.statusCode < 500) {
      return true
    }
    
    return false
  }

  /**
   * Handle and format errors for user-friendly messages
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any
    
    // Network errors
    if (err?.networkError) {
      const statusCode = err.networkError.statusCode
      
      switch (statusCode) {
        case 400:
          return new Error('Solicitud inválida. Verifica los datos ingresados.')
        case 401:
          return new Error('Sesión expirada. Por favor inicia sesión nuevamente.')
        case 403:
          return new Error('No tienes permisos para realizar esta acción.')
        case 404:
          return new Error('Recurso no encontrado.')
        case 409:
          return new Error('Conflicto con el estado actual. La información ha cambiado.')
        case 422:
          return new Error('Datos inválidos. Verifica la información ingresada.')
        case 429:
          return new Error('Demasiadas solicitudes. Intenta nuevamente en unos momentos.')
        case 500:
          return new Error('Error interno del servidor. Intenta nuevamente más tarde.')
        case 502:
        case 503:
        case 504:
          return new Error('Servicio temporalmente no disponible.')
        default:
          return new Error('Error de conexión. Verifica tu conexión a internet.')
      }
    }
    
    // GraphQL errors
    if (err?.graphQLErrors && err.graphQLErrors.length > 0) {
      const gqlError = err.graphQLErrors[0]
      
      // Handle specific GraphQL error codes
      if (gqlError.extensions?.code === 'UNAUTHENTICATED') {
        return new Error('Sesión expirada. Por favor inicia sesión nuevamente.')
      }
      
      if (gqlError.extensions?.code === 'FORBIDDEN') {
        return new Error('No tienes permisos para realizar esta acción.')
      }
      
      if (gqlError.extensions?.code === 'VALIDATION_FAILED') {
        return new Error('Datos inválidos. Verifica la información ingresada.')
      }
      
      if (gqlError.extensions?.code === 'NOT_FOUND') {
        return new Error('Elemento no encontrado.')
      }
      
      if (gqlError.extensions?.code === 'DUPLICATE_ERROR') {
        return new Error('Ya existe un elemento con esta información.')
      }
      
      // Return the GraphQL error message
      return new Error(gqlError.message || defaultMessage)
    }
    
    // Generic error handling
    if (err?.message) {
      return new Error(err.message)
    }
    
    return new Error(defaultMessage)
  }
}

// Export singleton instance
export const taskService = new TaskService()
export default taskService