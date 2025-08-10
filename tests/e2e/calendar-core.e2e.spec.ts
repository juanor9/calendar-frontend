/**
 * Tests E2E críticos para funcionalidades core del calendario de Vana
 * Valida los flujos principales definidos en el MVP
 */

import { test, expect, Page } from '@playwright/test'

// Usar autenticación preconfigurada
test.use({ storageState: 'playwright/.auth/user.json' })

test.describe('Calendario - Funcionalidades Core', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar')

    // Esperar a que el calendario cargue completamente
    await expect(page.locator('[data-testid=calendar-container]')).toBeVisible()
  })

  test('debe cargar el calendario con vista semanal por defecto', async ({ page }) => {
    // Verificar que la vista semanal está activa
    await expect(page.locator('[data-testid=calendar-view-week]')).toHaveClass(/active/)

    // Verificar que se muestran los 7 días de la semana
    const daysOfWeek = page.locator('[data-testid=calendar-day-column]')
    await expect(daysOfWeek).toHaveCount(7)

    // Verificar navegación de fechas
    const currentWeek = await page.locator('[data-testid=current-date-range]').textContent()
    expect(currentWeek).toBeTruthy()
  })

  test('debe permitir cambiar entre vistas de calendario', async ({ page }) => {
    // Cambiar a vista diaria
    await page.click('[data-testid=calendar-view-day-button]')
    await expect(page.locator('[data-testid=calendar-view-day]')).toHaveClass(/active/)

    // Cambiar a vista mensual
    await page.click('[data-testid=calendar-view-month-button]')
    await expect(page.locator('[data-testid=calendar-view-month]')).toHaveClass(/active/)

    // Volver a vista semanal
    await page.click('[data-testid=calendar-view-week-button]')
    await expect(page.locator('[data-testid=calendar-view-week]')).toHaveClass(/active/)
  })

  test('debe navegar entre fechas correctamente', async ({ page }) => {
    // Obtener fecha actual
    const initialDate = await page.locator('[data-testid=current-date-range]').textContent()

    // Navegar a la semana siguiente
    await page.click('[data-testid=calendar-next-button]')
    const nextWeekDate = await page.locator('[data-testid=current-date-range]').textContent()

    expect(nextWeekDate).not.toBe(initialDate)

    // Navegar a la semana anterior
    await page.click('[data-testid=calendar-prev-button]')
    await page.click('[data-testid=calendar-prev-button]') // Dos veces para ir una semana atrás

    const prevWeekDate = await page.locator('[data-testid=current-date-range]').textContent()
    expect(prevWeekDate).not.toBe(initialDate)
  })

  test('debe mostrar loading state mientras carga datos', async ({ page }) => {
    // Interceptar requests para simular carga lenta
    await page.route('**/graphql', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.continue()
    })

    // Recargar página para ver loading
    await page.reload()

    // Verificar que aparece el loading state
    await expect(page.locator('[data-testid=calendar-loading]')).toBeVisible()

    // Verificar que el loading desaparece
    await expect(page.locator('[data-testid=calendar-loading]')).not.toBeVisible({
      timeout: 5000,
    })
  })

  test('debe manejar errores de carga gracefully', async ({ page }) => {
    // Simular error de red
    await page.route('**/graphql', route => route.abort('failed'))

    // Recargar para triggear el error
    await page.reload()

    // Verificar que aparece mensaje de error
    await expect(page.locator('[data-testid=calendar-error]')).toBeVisible()

    // Verificar que hay botón de retry
    await expect(page.locator('[data-testid=retry-button]')).toBeVisible()
  })
})

test.describe('Gestión de Tareas - Flujos Críticos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar')
    await expect(page.locator('[data-testid=calendar-container]')).toBeVisible()
  })

  test('debe crear una nueva tarea desde el calendario', async ({ page }) => {
    // Abrir modal de nueva tarea
    await page.click('[data-testid=new-task-button]')

    // Verificar que el modal está abierto
    await expect(page.locator('[data-testid=task-modal]')).toBeVisible()

    // Llenar formulario de tarea
    await page.fill('[data-testid=task-title-input]', 'Nueva tarea de prueba')
    await page.fill('[data-testid=task-description-input]', 'Descripción de la tarea')
    await page.selectOption('[data-testid=task-priority-select]', 'HIGH')
    await page.fill('[data-testid=task-duration-input]', '60')

    // Establecer fecha límite
    await page.click('[data-testid=task-due-date-picker]')
    await page.click('[data-testid=date-picker-today]')

    // Guardar tarea
    await page.click('[data-testid=save-task-button]')

    // Verificar que el modal se cierra
    await expect(page.locator('[data-testid=task-modal]')).not.toBeVisible()

    // Verificar que la tarea aparece en el calendario
    await expect(page.locator('[data-testid*=task-card]')).toContainText('Nueva tarea de prueba')
  })

  test('debe editar una tarea existente', async ({ page }) => {
    // Crear una tarea primero (setup)
    await createTestTask(page, 'Tarea para editar')

    // Hacer clic en la tarea para editarla
    await page.click('[data-testid*=task-card]:has-text("Tarea para editar")')

    // Verificar que el modal de edición está abierto
    await expect(page.locator('[data-testid=task-modal]')).toBeVisible()

    // Editar el título
    await page.fill('[data-testid=task-title-input]', 'Tarea editada')

    // Cambiar prioridad
    await page.selectOption('[data-testid=task-priority-select]', 'CRITICAL')

    // Guardar cambios
    await page.click('[data-testid=save-task-button]')

    // Verificar que los cambios se reflejan
    await expect(page.locator('[data-testid*=task-card]')).toContainText('Tarea editada')
    await expect(page.locator('[data-testid*=task-card]:has-text("Tarea editada")')).toHaveClass(
      /priority-critical/
    )
  })

  test('debe eliminar una tarea con confirmación', async ({ page }) => {
    // Crear una tarea primero
    await createTestTask(page, 'Tarea para eliminar')

    // Hacer clic derecho para abrir menú contextual
    await page.click('[data-testid*=task-card]:has-text("Tarea para eliminar")', {
      button: 'right',
    })

    // Hacer clic en eliminar
    await page.click('[data-testid=delete-task-menu-item]')

    // Verificar que aparece confirmación
    await expect(page.locator('[data-testid=delete-confirmation-dialog]')).toBeVisible()

    // Confirmar eliminación
    await page.click('[data-testid=confirm-delete-button]')

    // Verificar que la tarea ya no existe
    await expect(
      page.locator('[data-testid*=task-card]:has-text("Tarea para eliminar")')
    ).not.toBeVisible()
  })

  test('debe marcar tarea como completada', async ({ page }) => {
    // Crear una tarea primero
    await createTestTask(page, 'Tarea para completar')

    // Hacer clic en el checkbox de la tarea
    await page.click(
      '[data-testid*=task-checkbox]:near([data-testid*=task-card]:has-text("Tarea para completar"))'
    )

    // Verificar que la tarea se marca como completada
    await expect(
      page.locator('[data-testid*=task-card]:has-text("Tarea para completar")')
    ).toHaveClass(/completed/)

    // Verificar que el checkbox está marcado
    await expect(
      page.locator(
        '[data-testid*=task-checkbox]:near([data-testid*=task-card]:has-text("Tarea para completar"))'
      )
    ).toBeChecked()
  })
})

test.describe('Drag and Drop - Funcionalidad Crítica', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar')
    await expect(page.locator('[data-testid=calendar-container]')).toBeVisible()
  })

  test('debe permitir arrastrar tarea a diferente horario', async ({ page }) => {
    // Crear una tarea de prueba
    await createTestTask(page, 'Tarea movible', { time: '09:00' })

    // Localizar la tarea y el slot de destino
    const taskCard = page.locator('[data-testid*=task-card]:has-text("Tarea movible")')
    const targetSlot = page.locator('[data-testid=time-slot-11-00]')

    // Realizar drag and drop
    await taskCard.dragTo(targetSlot)

    // Verificar que la tarea se movió al nuevo horario
    const movedTask = page.locator(
      '[data-testid=time-slot-11-00] [data-testid*=task-card]:has-text("Tarea movible")'
    )
    await expect(movedTask).toBeVisible()
  })

  test('debe permitir arrastrar tarea a diferente día', async ({ page }) => {
    // Crear una tarea de prueba para lunes
    await createTestTask(page, 'Tarea cross-day', { day: 'monday' })

    // Localizar la tarea y el día de destino (miércoles)
    const taskCard = page.locator('[data-testid*=task-card]:has-text("Tarea cross-day")')
    const wednesdayColumn = page.locator('[data-testid=calendar-day-wednesday]')

    // Realizar drag and drop
    await taskCard.dragTo(wednesdayColumn)

    // Verificar que la tarea se movió al miércoles
    const movedTask = page.locator(
      '[data-testid=calendar-day-wednesday] [data-testid*=task-card]:has-text("Tarea cross-day")'
    )
    await expect(movedTask).toBeVisible()
  })

  test('debe mostrar feedback visual durante drag', async ({ page }) => {
    await createTestTask(page, 'Tarea con feedback')

    const taskCard = page.locator('[data-testid*=task-card]:has-text("Tarea con feedback")')

    // Iniciar drag
    await taskCard.hover()
    await page.mouse.down()

    // Verificar que aparece el ghost element
    await expect(page.locator('[data-testid=drag-ghost]')).toBeVisible()

    // Verificar que los drop zones se highlightean
    await expect(page.locator('[data-testid=drop-zone].highlighted').first()).toBeVisible()

    // Finalizar drag
    await page.mouse.up()
  })

  test('debe rechazar drop en zona inválida', async ({ page }) => {
    await createTestTask(page, 'Tarea con restricción')

    const taskCard = page.locator('[data-testid*=task-card]:has-text("Tarea con restricción")')
    const invalidZone = page.locator('[data-testid=calendar-header]') // Header no es drop zone válido

    // Intentar drag a zona inválida
    await taskCard.dragTo(invalidZone)

    // Verificar que la tarea permanece en su posición original
    await expect(taskCard).toBeVisible()

    // Verificar que aparece mensaje de error
    await expect(page.locator('[data-testid=drop-error-toast]')).toBeVisible()
  })
})

test.describe('Reprogramación Automática - IA Core', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar')
    await expect(page.locator('[data-testid=calendar-container]')).toBeVisible()
  })

  test('debe sugerir reprogramación cuando hay conflictos', async ({ page }) => {
    // Crear dos tareas que se superponen
    await createTestTask(page, 'Tarea A', { time: '10:00', duration: 120 })
    await createTestTask(page, 'Tarea B', { time: '10:30', duration: 90 })

    // Esperar a que aparezca la sugerencia de IA
    await expect(page.locator('[data-testid=ai-suggestion-popup]')).toBeVisible()

    // Verificar contenido de la sugerencia
    await expect(page.locator('[data-testid=suggestion-text]')).toContainText('conflicto')

    // Ver botones de acción
    await expect(page.locator('[data-testid=accept-suggestion-button]')).toBeVisible()
    await expect(page.locator('[data-testid=reject-suggestion-button]')).toBeVisible()
  })

  test('debe aplicar sugerencia de reprogramación', async ({ page }) => {
    // Crear conflicto
    await createTestTask(page, 'Tarea Original', { time: '14:00' })
    await createTestTask(page, 'Tarea Conflictiva', { time: '14:00' })

    // Esperar sugerencia y aceptarla
    await expect(page.locator('[data-testid=ai-suggestion-popup]')).toBeVisible()
    await page.click('[data-testid=accept-suggestion-button]')

    // Verificar que las tareas se reubican sin conflicto
    const task1 = page.locator('[data-testid*=task-card]:has-text("Tarea Original")')
    const task2 = page.locator('[data-testid*=task-card]:has-text("Tarea Conflictiva")')

    // Ambas tareas deben estar visibles pero en diferentes horarios
    await expect(task1).toBeVisible()
    await expect(task2).toBeVisible()

    // Verificar que no hay overlap
    const task1Bounds = await task1.boundingBox()
    const task2Bounds = await task2.boundingBox()

    expect(task1Bounds).toBeTruthy()
    expect(task2Bounds).toBeTruthy()

    // No deben solaparse verticalmente (diferentes horarios)
    const noOverlap =
      task1Bounds!.y + task1Bounds!.height <= task2Bounds!.y ||
      task2Bounds!.y + task2Bounds!.height <= task1Bounds!.y

    expect(noOverlap).toBe(true)
  })

  test('debe respetar reglas de horario del usuario', async ({ page }) => {
    // Configurar reglas de horario (no meetings después de 18:00)
    await page.goto('/settings/time-preferences')
    await page.click('[data-testid=add-time-rule-button]')
    await page.selectOption('[data-testid=rule-type-select]', 'NO_MEETINGS')
    await page.fill('[data-testid=rule-start-time]', '18:00')
    await page.fill('[data-testid=rule-end-time]', '23:59')
    await page.click('[data-testid=save-rule-button]')

    // Volver al calendario
    await page.goto('/calendar')

    // Intentar crear tarea después de 18:00
    await createTestTask(page, 'Tarea Tardía', { time: '19:00' })

    // La IA debería sugerir un horario alternativo
    await expect(page.locator('[data-testid=ai-suggestion-popup]')).toBeVisible()
    await expect(page.locator('[data-testid=suggestion-text]')).toContainText('reglas de horario')

    // Aceptar sugerencia
    await page.click('[data-testid=accept-suggestion-button]')

    // Verificar que la tarea se reubica antes de 18:00
    const task = page.locator('[data-testid*=task-card]:has-text("Tarea Tardía")')
    const taskTimeSlot = await task.locator('..').getAttribute('data-testid')

    // El slot debe ser anterior a 18:00
    expect(taskTimeSlot).toMatch(/time-slot-(0\d|1[0-7])-/)
  })
})

// Utility functions
async function createTestTask(
  page: Page,
  title: string,
  options: { time?: string; day?: string; duration?: number } = {}
) {
  const { time = '10:00', day = 'monday', duration = 60 } = options

  await page.click('[data-testid=new-task-button]')
  await page.fill('[data-testid=task-title-input]', title)
  await page.fill('[data-testid=task-duration-input]', duration.toString())

  if (time) {
    await page.fill('[data-testid=task-time-input]', time)
  }

  if (day && day !== 'monday') {
    await page.click(`[data-testid=task-day-${day}]`)
  }

  await page.click('[data-testid=save-task-button]')

  // Esperar a que la tarea aparezca
  await expect(page.locator(`[data-testid*=task-card]:has-text("${title}")`)).toBeVisible()
}
