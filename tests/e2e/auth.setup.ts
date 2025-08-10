/**
 * Setup de autenticación para tests E2E de Vana
 */

import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  // Navegar a la página de login
  await page.goto('/login')

  // Realizar login (mock para tests)
  await page.fill('[data-testid=email-input]', 'test@vana.app')
  await page.fill('[data-testid=password-input]', 'test-password')
  await page.click('[data-testid=login-button]')

  // Esperar a que la autenticación sea exitosa
  await expect(page).toHaveURL('/dashboard')

  // Guardar estado de autenticación
  await page.context().storageState({ path: authFile })
})
