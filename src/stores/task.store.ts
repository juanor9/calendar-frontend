/**
 * Task Management Pinia Store (F002 module)
 * Reactive state management with Apollo Client integration, optimistic updates,
 * and real-time synchronization via GraphQL subscriptions
 */

import { defineStore } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'
import type {
  Task,
  TaskInput,
  TaskUpdateInput, 
  TaskFilterInput,
  TaskSortInput,
  TaskConnection,
  TaskStats,
  TaskStatsInput,
  TaskPriority,
  TaskStatus
} from '@/types/task'
import { DEFAULT_TASK_SORT, DEFAULT_FILTERS } from '@/types/task'
import { taskService } from '@/services/task.service'
import { useAuth } from '@/composables/useAuth'

export const useTaskStore = defineStore('task', () => {
  // ============================================================================
  // State
  // ============================================================================

  // Data State
  const tasks = ref<Map<string, Task>>(new Map())
  const taskConnection = ref<TaskConnection | null>(null)
  const taskStats = ref<TaskStats | null>(null)

  // UI State
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  const error = ref<string | null>(null)

  // Form State
  const selectedTasks = ref<Set<string>>(new Set())
  const activeFilters = ref<TaskFilterInput>({ ...DEFAULT_FILTERS })
  const currentSort = ref<TaskSortInput>({ ...DEFAULT_TASK_SORT })

  // Cache State
  const lastFetchTime = ref<number | null>(null)
  const needsRefresh = ref(false)

  // Subscription management
  const subscriptions = new Map<string, { unsubscribe: () => void }>()

  // ============================================================================
  // Getters
  // ============================================================================

  const allTasks = computed(() => Array.from(tasks.value.values()))

  const filteredTasks = computed(() => {
    let filtered = allTasks.value

    const filters = activeFilters.value

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status!.includes(task.status))
    }

    // Filter by priority
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority!.includes(task.priority))
    }

    // Filter by due date range
    if (filters.dueDateFrom) {
      const fromDate = new Date(filters.dueDateFrom)
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false
        return new Date(task.dueDate) >= fromDate
      })
    }

    if (filters.dueDateTo) {
      const toDate = new Date(filters.dueDateTo)
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false
        return new Date(task.dueDate) <= toDate
      })
    }

    // Filter by creation date range
    if (filters.createdFrom) {
      const fromDate = new Date(filters.createdFrom)
      filtered = filtered.filter(task => new Date(task.createdAt) >= fromDate)
    }

    if (filters.createdTo) {
      const toDate = new Date(filters.createdTo)
      filtered = filtered.filter(task => new Date(task.createdAt) <= toDate)
    }

    // Text search
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      )
    }

    // Filter deleted tasks
    if (!filters.includeDeleted) {
      filtered = filtered.filter(task => !task.isDeleted)
    }

    // Apply sorting
    const sort = currentSort.value
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sort.field) {
        case 'title': {
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        }
        case 'due_date': {
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0
          break
        }
        case 'priority': {
          const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 }
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
          break
        }
        case 'status': {
          const statusOrder = { todo: 1, doing: 2, done: 3, expired: 4, rescheduled: 5 }
          aValue = statusOrder[a.status as keyof typeof statusOrder] || 0
          bValue = statusOrder[b.status as keyof typeof statusOrder] || 0
          break
        }
        case 'created_at': {
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        }
        case 'updated_at': {
          aValue = new Date(a.updatedAt).getTime()
          bValue = new Date(b.updatedAt).getTime()
          break
        }
        default: {
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
        }
      }

      const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return sort.direction === 'desc' ? -result : result
    })

    return filtered
  })

  const taskById = computed(() => (id: string) => tasks.value.get(id))

  const tasksByStatus = computed(() => (status: TaskStatus) => 
    allTasks.value.filter(task => task.status === status)
  )

  const tasksByPriority = computed(() => (priority: TaskPriority) =>
    allTasks.value.filter(task => task.priority === priority)
  )

  const overdueTasks = computed(() => 
    allTasks.value.filter(task => task.isOverdue && !task.isDeleted)
  )

  const dueTodayTasks = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return allTasks.value.filter(task => {
      if (!task.dueDate || task.isDeleted) return false
      const dueDate = new Date(task.dueDate)
      return dueDate >= today && dueDate < tomorrow
    })
  })

  const selectedTasksList = computed(() => 
    Array.from(selectedTasks.value).map(id => tasks.value.get(id)).filter(Boolean) as Task[]
  )

  const isTaskSelected = computed(() => (id: string) => selectedTasks.value.has(id))

  const hasUnsavedChanges = computed(() => needsRefresh.value)

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * Fetch tasks with filtering and sorting
   */
  const fetchTasks = async (
    filters?: TaskFilterInput, 
    sort?: TaskSortInput, 
    options: { force?: boolean, first?: number, after?: string } = {}
  ): Promise<TaskConnection> => {
    try {
      isLoading.value = true
      error.value = null

      // Update filters and sort if provided
      if (filters) {
        activeFilters.value = { ...filters }
      }
      if (sort) {
        currentSort.value = { ...sort }
      }

      const connection = await taskService.getTasks({
        first: options.first || 20,
        after: options.after || null,
        filters: activeFilters.value,
        sort: currentSort.value
      })

      // Update tasks map
      connection.edges.forEach(edge => {
        tasks.value.set(edge.node.id, edge.node)
      })

      taskConnection.value = connection
      lastFetchTime.value = Date.now()
      needsRefresh.value = false

      return connection
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tasks'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch task statistics
   */
  const fetchTaskStats = async (input?: TaskStatsInput): Promise<TaskStats> => {
    try {
      const stats = await taskService.getTaskStats(input)
      taskStats.value = stats
      return stats
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch task statistics'
      throw err
    }
  }

  /**
   * Search tasks with full-text search
   */
  const searchTasks = async (
    query: string,
    options: { first?: number, after?: string, filters?: TaskFilterInput } = {}
  ): Promise<TaskConnection> => {
    try {
      isLoading.value = true
      error.value = null

      const connection = await taskService.searchTasks({
        query,
        first: options.first || 20,
        after: options.after || null,
        filters: options.filters
      })

      // Update tasks map with search results
      connection.edges.forEach(edge => {
        tasks.value.set(edge.node.id, edge.node)
      })

      // Store the connection result
      taskConnection.value = connection
      lastFetchTime.value = Date.now()

      return connection
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search tasks'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new task
   */
  const createTask = async (input: TaskInput): Promise<Task> => {
    try {
      isCreating.value = true
      error.value = null

      const task = await taskService.createTask(input)
      
      // Add to local state
      tasks.value.set(task.id, task)
      
      // Refresh stats
      await nextTick()
      fetchTaskStats()

      return task
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create task'
      throw err
    } finally {
      isCreating.value = false
    }
  }

  /**
   * Update an existing task
   */
  const updateTask = async (id: string, input: TaskUpdateInput): Promise<Task> => {
    try {
      isUpdating.value = true
      error.value = null

      const task = await taskService.updateTask(id, input)
      
      // Update local state
      tasks.value.set(task.id, task)
      
      // Refresh stats if status changed
      if (input.status) {
        await nextTick()
        fetchTaskStats()
      }

      return task
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update task'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  /**
   * Delete a task
   */
  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      isDeleting.value = true
      error.value = null

      const success = await taskService.deleteTask(id)
      
      if (success) {
        // Remove from local state
        tasks.value.delete(id)
        selectedTasks.value.delete(id)
        
        // Refresh stats
        await nextTick()
        fetchTaskStats()
      }

      return success
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete task'
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  /**
   * Bulk update multiple tasks
   */
  const bulkUpdateTasks = async (ids: string[], input: TaskUpdateInput): Promise<Task[]> => {
    try {
      isUpdating.value = true
      error.value = null

      const updatedTasks = await taskService.bulkUpdateTasks(ids, input)
      
      // Update local state
      updatedTasks.forEach(task => {
        tasks.value.set(task.id, task)
      })
      
      // Refresh stats
      await nextTick()
      fetchTaskStats()

      return updatedTasks
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update tasks'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  /**
   * Bulk delete multiple tasks
   */
  const bulkDeleteTasks = async (ids: string[]): Promise<boolean> => {
    try {
      isDeleting.value = true
      error.value = null

      const success = await taskService.bulkDeleteTasks(ids)
      
      if (success) {
        // Remove from local state
        ids.forEach(id => {
          tasks.value.delete(id)
          selectedTasks.value.delete(id)
        })
        
        // Refresh stats
        await nextTick()
        fetchTaskStats()
      }

      return success
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete tasks'
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  // ============================================================================
  // UI Actions
  // ============================================================================

  const selectTask = (id: string) => {
    selectedTasks.value.add(id)
  }

  const deselectTask = (id: string) => {
    selectedTasks.value.delete(id)
  }

  const selectAllTasks = () => {
    filteredTasks.value.forEach(task => {
      selectedTasks.value.add(task.id)
    })
  }

  const deselectAllTasks = () => {
    selectedTasks.value.clear()
  }

  const toggleTaskSelection = (id: string) => {
    if (selectedTasks.value.has(id)) {
      selectedTasks.value.delete(id)
    } else {
      selectedTasks.value.add(id)
    }
  }

  // ============================================================================
  // Filter Actions
  // ============================================================================

  const setFilters = (filters: TaskFilterInput) => {
    activeFilters.value = { ...filters }
    // Auto-refresh filtered tasks
    return fetchTasks()
  }

  const clearFilters = () => {
    activeFilters.value = { ...DEFAULT_FILTERS }
    return fetchTasks()
  }

  const setSort = (sort: TaskSortInput) => {
    currentSort.value = { ...sort }
    // Auto-refresh sorted tasks
    return fetchTasks()
  }

  // ============================================================================
  // Cache Actions
  // ============================================================================

  const invalidateCache = () => {
    needsRefresh.value = true
  }

  const refreshTasks = async () => {
    return fetchTasks(undefined, undefined, { force: true })
  }

  const clearCache = () => {
    tasks.value.clear()
    taskConnection.value = null
    taskStats.value = null
    selectedTasks.value.clear()
    lastFetchTime.value = null
    needsRefresh.value = false
    error.value = null
  }

  // ============================================================================
  // Real-time Subscriptions
  // ============================================================================

  const setupSubscriptions = () => {
    const auth = useAuth()
    if (!auth.user.value?.sub) return

    const userId = auth.user.value.sub

    // Subscribe to task updates
    const taskUpdateSub = taskService.subscribeToTaskUpdates(userId)
    subscriptions.set('taskUpdates', taskUpdateSub.subscribe({
      next: (result) => {
        if (result.data?.taskUpdated) {
          const updatedTask = result.data.taskUpdated
          tasks.value.set(updatedTask.id, updatedTask)
        }
      },
      error: (err) => {
        console.error('Task update subscription error:', err)
      }
    }))

    // Subscribe to task deletions
    const taskDeleteSub = taskService.subscribeToTaskDeletions(userId)
    subscriptions.set('taskDeletes', taskDeleteSub.subscribe({
      next: (result) => {
        if (result.data?.taskDeleted) {
          const deletedTaskId = result.data.taskDeleted.id
          tasks.value.delete(deletedTaskId)
          selectedTasks.value.delete(deletedTaskId)
        }
      },
      error: (err) => {
        console.error('Task delete subscription error:', err)
      }
    }))

    // Subscribe to stats updates
    const statsSub = taskService.subscribeToTaskStats(userId)
    subscriptions.set('taskStats', statsSub.subscribe({
      next: (result) => {
        if (result.data?.taskStatsUpdated) {
          taskStats.value = result.data.taskStatsUpdated
        }
      },
      error: (err) => {
        console.error('Task stats subscription error:', err)
      }
    }))
  }

  const cleanupSubscriptions = () => {
    subscriptions.forEach((subscription) => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe()
      }
    })
    subscriptions.clear()
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  // Watch for auth changes to setup/cleanup subscriptions
  const auth = useAuth()
  watch(
    () => auth.isAuthenticated.value,
    (isAuthenticated) => {
      if (isAuthenticated) {
        setupSubscriptions()
      } else {
        cleanupSubscriptions()
        clearCache()
      }
    },
    { immediate: true }
  )

  // Auto-refresh tasks periodically (every 5 minutes)
  let refreshInterval: NodeJS.Timeout | null = null
  if (typeof window !== 'undefined') {
    refreshInterval = setInterval(() => {
      if (auth.isAuthenticated.value && !needsRefresh.value) {
        // Only refresh if there's been no activity in the last 2 minutes
        const timeSinceLastFetch = lastFetchTime.value ? Date.now() - lastFetchTime.value : Infinity
        if (timeSinceLastFetch > 2 * 60 * 1000) {
          refreshTasks()
        }
      }
    }, 5 * 60 * 1000) // 5 minutes
  }

  // Cleanup on store destruction
  const cleanup = () => {
    cleanupSubscriptions()
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Return store interface
  return {
    // State
    tasks,
    taskConnection,
    taskStats,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    selectedTasks,
    activeFilters,
    currentSort,
    lastFetchTime,
    needsRefresh,

    // Getters
    allTasks,
    filteredTasks,
    taskById,
    tasksByStatus,
    tasksByPriority,
    overdueTasks,
    dueTodayTasks,
    selectedTasksList,
    isTaskSelected,
    hasUnsavedChanges,

    // Data Actions
    fetchTasks,
    fetchTaskStats,
    searchTasks,
    createTask,
    updateTask,
    deleteTask,
    bulkUpdateTasks,
    bulkDeleteTasks,

    // UI Actions
    selectTask,
    deselectTask,
    selectAllTasks,
    deselectAllTasks,
    toggleTaskSelection,

    // Filter Actions
    setFilters,
    clearFilters,
    setSort,

    // Cache Actions
    invalidateCache,
    refreshTasks,
    clearCache,

    // Lifecycle
    setupSubscriptions,
    cleanupSubscriptions,
    cleanup
  }
})

export default useTaskStore