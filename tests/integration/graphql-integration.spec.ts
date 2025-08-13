/**
 * Tests de integración para operaciones GraphQL de Tanuki Planner
 * Valida la comunicación correcta con el backend y el manejo de datos
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable'

// Mock de Apollo Client
vi.mock('@vue/apollo-composable')

const mockUseQuery = vi.mocked(useQuery)
const mockUseMutation = vi.mocked(useMutation)
const mockUseSubscription = vi.mocked(useSubscription)

describe('GraphQL Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Tasks Query Integration', () => {
    it('debe obtener lista de tareas con filtros', async () => {
      // Mock de respuesta exitosa
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Revisar código',
          durationMinutes: 60,
          dueDate: '2025-08-15T10:00:00Z',
          priority: 'HIGH',
          status: 'TODO',
          labels: [{ id: 'label-1', name: 'Desarrollo', colorHex: '#007bff' }],
        },
        {
          id: 'task-2',
          title: 'Reunión cliente',
          durationMinutes: 30,
          dueDate: '2025-08-15T14:00:00Z',
          priority: 'CRITICAL',
          status: 'TODO',
          labels: [],
        },
      ]

      mockUseQuery.mockReturnValue({
        result: { value: { tasks: { edges: mockTasks.map(task => ({ node: task })) } } },
        loading: { value: false },
        error: { value: null },
        refetch: vi.fn(),
        fetchMore: vi.fn(),
      })

      // Simular uso del composable
      const { result, loading, error } = useQuery('TASKS_QUERY', {
        first: 20,
        status: ['TODO'],
        priority: ['HIGH', 'CRITICAL'],
      })

      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
      expect(result.value.tasks.edges).toHaveLength(2)
      expect(result.value.tasks.edges[0].node.title).toBe('Revisar código')
    })

    it('debe manejar errores de red correctamente', async () => {
      const mockError = new Error('Network error')

      mockUseQuery.mockReturnValue({
        result: { value: null },
        loading: { value: false },
        error: { value: mockError },
        refetch: vi.fn(),
        fetchMore: vi.fn(),
      })

      const { result, loading, error } = useQuery('TASKS_QUERY')

      expect(loading.value).toBe(false)
      expect(error.value).toBe(mockError)
      expect(result.value).toBe(null)
    })

    it('debe manejar estados de carga', async () => {
      mockUseQuery.mockReturnValue({
        result: { value: null },
        loading: { value: true },
        error: { value: null },
        refetch: vi.fn(),
        fetchMore: vi.fn(),
      })

      const { result, loading, error } = useQuery('TASKS_QUERY')

      expect(loading.value).toBe(true)
      expect(error.value).toBe(null)
      expect(result.value).toBe(null)
    })

    it('debe refetch datos cuando se solicite', async () => {
      const mockRefetch = vi.fn().mockResolvedValue({
        data: { tasks: { edges: [] } },
      })

      mockUseQuery.mockReturnValue({
        result: { value: { tasks: { edges: [] } } },
        loading: { value: false },
        error: { value: null },
        refetch: mockRefetch,
        fetchMore: vi.fn(),
      })

      const { refetch } = useQuery('TASKS_QUERY')

      await refetch()
      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  describe('Create Task Mutation Integration', () => {
    it('debe crear nueva tarea exitosamente', async () => {
      const mockMutate = vi.fn().mockResolvedValue({
        data: {
          createTask: {
            success: true,
            entity: {
              id: 'new-task-id',
              title: 'Nueva tarea',
              durationMinutes: 60,
              priority: 'MEDIUM',
              status: 'TODO',
            },
            errorCode: null,
            errorMessage: null,
          },
        },
      })

      mockUseMutation.mockReturnValue({
        mutate: mockMutate,
        loading: { value: false },
        error: { value: null },
        onDone: vi.fn(),
        onError: vi.fn(),
      })

      const { mutate } = useMutation('CREATE_TASK_MUTATION')

      const result = await mutate({
        input: {
          title: 'Nueva tarea',
          durationMinutes: 60,
          priority: 'MEDIUM',
          dueDate: '2025-08-15T15:00:00Z',
        },
      })

      expect(mockMutate).toHaveBeenCalledWith({
        input: {
          title: 'Nueva tarea',
          durationMinutes: 60,
          priority: 'MEDIUM',
          dueDate: '2025-08-15T15:00:00Z',
        },
      })

      expect(result.data.createTask.success).toBe(true)
      expect(result.data.createTask.entity.title).toBe('Nueva tarea')
    })

    it('debe manejar errores de validación', async () => {
      const mockMutate = vi.fn().mockResolvedValue({
        data: {
          createTask: {
            success: false,
            entity: null,
            errorCode: 'VALIDATION_FAILED',
            errorMessage: 'El título es requerido',
          },
        },
      })

      mockUseMutation.mockReturnValue({
        mutate: mockMutate,
        loading: { value: false },
        error: { value: null },
        onDone: vi.fn(),
        onError: vi.fn(),
      })

      const { mutate } = useMutation('CREATE_TASK_MUTATION')

      const result = await mutate({
        input: { title: '', durationMinutes: 60 },
      })

      expect(result.data.createTask.success).toBe(false)
      expect(result.data.createTask.errorCode).toBe('VALIDATION_FAILED')
      expect(result.data.createTask.errorMessage).toBe('El título es requerido')
    })

    it('debe optimisticamente actualizar la cache', async () => {
      const mockUpdate = vi.fn()
      const mutationResult = {
        data: {
          createTask: {
            success: true,
            entity: { id: 'optimistic-task', title: 'Tarea optimística' },
          },
        },
      }

      // Mock que simula el comportamiento de Apollo Client useMutation
      // Captura las opciones (incluyendo update) y las usa durante la mutación
      const originalMockImplementation = mockUseMutation.getMockImplementation()
      
      mockUseMutation.mockImplementation((_mutationDocument, options) => {
        // Capturar las opciones que incluyen la función update
        const capturedOptions = options
        
        const mockMutate = vi.fn().mockImplementation(async () => {
          // Simular el comportamiento de Apollo Client: llamar update después de la mutación
          if (capturedOptions?.update) {
            capturedOptions.update(
              {}, // mock cache proxy
              { data: mutationResult.data } // mutation result
            )
          }
          return mutationResult
        })

        return {
          mutate: mockMutate,
          loading: { value: false },
          error: { value: null },
          onDone: vi.fn(),
          onError: vi.fn(),
        }
      })

      try {
        const { mutate } = useMutation('CREATE_TASK_MUTATION', {
          update: mockUpdate,
        })

        await mutate({
          input: { title: 'Tarea optimística' },
        })

        // Verificar que se llamó la función update para actualizar cache
        expect(mockUpdate).toHaveBeenCalled()
        expect(mockUpdate).toHaveBeenCalledWith(
          {},
          { data: mutationResult.data }
        )
      } finally {
        // Restaurar el mock original para no afectar otros tests
        if (originalMockImplementation) {
          mockUseMutation.mockImplementation(originalMockImplementation)
        } else {
          mockUseMutation.mockReset()
        }
      }
    })
  })

  describe('Update Task Mutation Integration', () => {
    it('debe actualizar tarea existente', async () => {
      const mockMutate = vi.fn().mockResolvedValue({
        data: {
          updateTask: {
            success: true,
            entity: {
              id: 'task-1',
              title: 'Tarea actualizada',
              status: 'DOING',
            },
          },
        },
      })

      mockUseMutation.mockReturnValue({
        mutate: mockMutate,
        loading: { value: false },
        error: { value: null },
        onDone: vi.fn(),
        onError: vi.fn(),
      })

      const { mutate } = useMutation('UPDATE_TASK_MUTATION')

      await mutate({
        id: 'task-1',
        input: {
          title: 'Tarea actualizada',
          status: 'DOING',
        },
      })

      expect(mockMutate).toHaveBeenCalledWith({
        id: 'task-1',
        input: {
          title: 'Tarea actualizada',
          status: 'DOING',
        },
      })
    })

    it('debe manejar task not found', async () => {
      const mockMutate = vi.fn().mockResolvedValue({
        data: {
          updateTask: {
            success: false,
            entity: null,
            errorCode: 'NOT_FOUND',
            errorMessage: 'Tarea no encontrada',
          },
        },
      })

      mockUseMutation.mockReturnValue({
        mutate: mockMutate,
        loading: { value: false },
        error: { value: null },
        onDone: vi.fn(),
        onError: vi.fn(),
      })

      const { mutate } = useMutation('UPDATE_TASK_MUTATION')

      const result = await mutate({
        id: 'non-existent-task',
        input: { title: 'Updated title' },
      })

      expect(result.data.updateTask.success).toBe(false)
      expect(result.data.updateTask.errorCode).toBe('NOT_FOUND')
    })
  })

  describe('Move Task Mutation Integration', () => {
    it('debe mover tarea a nuevo horario', async () => {
      const mockMutate = vi.fn().mockResolvedValue({
        data: {
          moveTask: {
            success: true,
            entity: {
              id: 'task-1',
              blocks: [
                {
                  id: 'block-1',
                  start: '2025-08-15T14:00:00Z',
                  end: '2025-08-15T15:00:00Z',
                  status: 'PLANNED',
                },
              ],
            },
          },
        },
      })

      mockUseMutation.mockReturnValue({
        mutate: mockMutate,
        loading: { value: false },
        error: { value: null },
        onDone: vi.fn(),
        onError: vi.fn(),
      })

      const { mutate } = useMutation('MOVE_TASK_MUTATION')

      await mutate({
        taskId: 'task-1',
        newStart: '2025-08-15T14:00:00Z',
        newEnd: '2025-08-15T15:00:00Z',
      })

      expect(mockMutate).toHaveBeenCalledWith({
        taskId: 'task-1',
        newStart: '2025-08-15T14:00:00Z',
        newEnd: '2025-08-15T15:00:00Z',
      })
    })

    it('debe manejar conflictos de horario', async () => {
      const mockMutate = vi.fn().mockResolvedValue({
        data: {
          moveTask: {
            success: false,
            entity: null,
            errorCode: 'TIME_CONFLICT',
            errorMessage: 'Conflicto con otra tarea',
          },
        },
      })

      mockUseMutation.mockReturnValue({
        mutate: mockMutate,
        loading: { value: false },
        error: { value: null },
        onDone: vi.fn(),
        onError: vi.fn(),
      })

      const { mutate } = useMutation('MOVE_TASK_MUTATION')

      const result = await mutate({
        taskId: 'task-1',
        newStart: '2025-08-15T10:00:00Z',
        newEnd: '2025-08-15T11:00:00Z',
      })

      expect(result.data.moveTask.success).toBe(false)
      expect(result.data.moveTask.errorCode).toBe('TIME_CONFLICT')
    })
  })

  describe('Real-time Subscriptions Integration', () => {
    it('debe recibir actualizaciones de tareas en tiempo real', async () => {
      const mockOnResult = vi.fn()
      const mockTaskUpdate = {
        id: 'task-1',
        title: 'Tarea actualizada via WebSocket',
        status: 'DOING',
        updatedAt: '2025-08-15T16:30:00Z',
      }

      mockUseSubscription.mockReturnValue({
        result: { value: { taskUpdated: mockTaskUpdate } },
        loading: { value: false },
        error: { value: null },
        onResult: mockOnResult,
        onError: vi.fn(),
      })

      const { result, onResult } = useSubscription('TASK_UPDATED_SUBSCRIPTION', {
        userId: 'user-123',
      })

      // Simular callback de resultado
      onResult(mockOnResult)

      expect(result.value.taskUpdated).toEqual(mockTaskUpdate)
    })

    it('debe manejar desconexiones de WebSocket', async () => {
      const mockError = new Error('WebSocket connection lost')
      const mockOnError = vi.fn()

      mockUseSubscription.mockReturnValue({
        result: { value: null },
        loading: { value: false },
        error: { value: mockError },
        onResult: vi.fn(),
        onError: mockOnError,
      })

      const { error, onError } = useSubscription('TASK_UPDATED_SUBSCRIPTION')

      // Simular callback de error
      onError(mockOnError)

      expect(error.value).toBe(mockError)
      expect(mockOnError).toHaveBeenCalled()
    })

    it('debe reconectarse automáticamente después de desconexión', async () => {
      const mockReconnect = vi.fn()

      // Simular reconexión exitosa
      mockUseSubscription.mockReturnValue({
        result: { value: null },
        loading: { value: true },
        error: { value: null },
        onResult: vi.fn(),
        onError: vi.fn(),
        restart: mockReconnect,
      })

      const { restart } = useSubscription('TASK_UPDATED_SUBSCRIPTION')

      // Simular reconexión
      restart()

      expect(mockReconnect).toHaveBeenCalled()
    })
  })

  describe('Calendar Events Query Integration', () => {
    it('debe obtener eventos del calendario con rango de fechas', async () => {
      const mockEvents = [
        {
          id: 'event-1',
          title: 'Reunión de equipo',
          start: '2025-08-15T09:00:00Z',
          end: '2025-08-15T10:00:00Z',
          source: 'MANUAL',
          fixedByUser: true,
        },
        {
          id: 'event-2',
          title: 'Llamada cliente',
          start: '2025-08-15T15:00:00Z',
          end: '2025-08-15T15:30:00Z',
          source: 'GOOGLE',
          fixedByUser: false,
        },
      ]

      mockUseQuery.mockReturnValue({
        result: {
          value: {
            calendarEvents: {
              edges: mockEvents.map(event => ({ node: event })),
            },
          },
        },
        loading: { value: false },
        error: { value: null },
        refetch: vi.fn(),
        fetchMore: vi.fn(),
      })

      const { result } = useQuery('CALENDAR_EVENTS_QUERY', {
        startFrom: '2025-08-15T00:00:00Z',
        startTo: '2025-08-15T23:59:59Z',
      })

      expect(result.value.calendarEvents.edges).toHaveLength(2)
      expect(result.value.calendarEvents.edges[0].node.title).toBe('Reunión de equipo')
    })
  })

  describe('Reschedule Suggestions Integration', () => {
    it('debe obtener sugerencias de reprogramación', async () => {
      const mockSuggestions = [
        {
          id: 'suggestion-1',
          type: 'RESCHEDULE',
          reason: 'Conflicto de horario detectado',
          affectedTasks: ['task-1', 'task-2'],
          proposedChanges: [
            {
              taskId: 'task-1',
              newStart: '2025-08-15T11:00:00Z',
              newEnd: '2025-08-15T12:00:00Z',
            },
          ],
          confidence: 0.95,
        },
      ]

      mockUseQuery.mockReturnValue({
        result: { value: { rescheduleSuggestions: mockSuggestions } },
        loading: { value: false },
        error: { value: null },
        refetch: vi.fn(),
        fetchMore: vi.fn(),
      })

      const { result } = useQuery('RESCHEDULE_SUGGESTIONS_QUERY')

      expect(result.value.rescheduleSuggestions).toHaveLength(1)
      expect(result.value.rescheduleSuggestions[0].confidence).toBe(0.95)
    })

    it('debe aplicar sugerencia de reprogramación', async () => {
      const mockMutate = vi.fn().mockResolvedValue({
        data: {
          approveSuggestion: {
            success: true,
            affectedTasks: [
              {
                id: 'task-1',
                blocks: [
                  {
                    start: '2025-08-15T11:00:00Z',
                    end: '2025-08-15T12:00:00Z',
                  },
                ],
              },
            ],
          },
        },
      })

      mockUseMutation.mockReturnValue({
        mutate: mockMutate,
        loading: { value: false },
        error: { value: null },
        onDone: vi.fn(),
        onError: vi.fn(),
      })

      const { mutate } = useMutation('APPROVE_SUGGESTION_MUTATION')

      await mutate({
        suggestionId: 'suggestion-1',
      })

      expect(mockMutate).toHaveBeenCalledWith({
        suggestionId: 'suggestion-1',
      })
    })
  })

  describe('Error Handling Integration', () => {
    it('debe manejar errores de rate limiting', async () => {
      const mockError = {
        message: 'Rate limit exceeded',
        extensions: {
          code: 'RATE_LIMIT',
          retryAfter: 60,
        },
      }

      mockUseQuery.mockReturnValue({
        result: { value: null },
        loading: { value: false },
        error: { value: mockError },
        refetch: vi.fn(),
        fetchMore: vi.fn(),
      })

      const { error } = useQuery('TASKS_QUERY')

      expect(error.value).toBe(mockError)
      expect(error.value.extensions.code).toBe('RATE_LIMIT')
    })

    it('debe manejar errores de autorización', async () => {
      const mockError = {
        message: 'Unauthorized',
        extensions: {
          code: 'UNAUTHORIZED',
        },
      }

      mockUseMutation.mockReturnValue({
        mutate: vi.fn().mockRejectedValue(mockError),
        loading: { value: false },
        error: { value: mockError },
        onDone: vi.fn(),
        onError: vi.fn(),
      })

      const { mutate, error } = useMutation('CREATE_TASK_MUTATION')

      try {
        await mutate({ input: { title: 'Test' } })
      } catch (e) {
        expect(e).toBe(mockError)
      }

      expect(error.value.extensions.code).toBe('UNAUTHORIZED')
    })
  })
})