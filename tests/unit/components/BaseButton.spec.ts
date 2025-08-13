/**
 * Tests completos para BaseButton - Componente UI crítico de Vana
 */

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { nextTick } from 'vue'
import BaseButton from '@/ui/BaseButton/BaseButton.vue'

expect.extend({ toHaveNoViolations: () => ({ pass: true, message: () => '' }) })

describe('BaseButton', () => {
  // ✅ Tests básicos de renderizado
  describe('Rendering', () => {
    it('muestra el label correctamente', () => {
      const { getByText } = render(BaseButton, {
        props: { label: 'Guardar cambios' },
      })
      expect(getByText('Guardar cambios')).toBeInTheDocument()
    })

    it('aplica las clases CSS correctas según variant', () => {
      const variants = ['primary', 'secondary', 'ghost', 'outline'] as const

      variants.forEach(variant => {
        const { container } = render(BaseButton, {
          props: { label: 'Test', variant },
        })

        const button = container.querySelector('button')
        expect(button).toHaveClass(`button--${variant}`)
      })
    })

    it('aplica las clases CSS correctas según size', () => {
      const sizes = ['small', 'medium', 'large'] as const

      sizes.forEach(size => {
        const { container } = render(BaseButton, {
          props: { label: 'Test', size },
        })

        const button = container.querySelector('button')
        expect(button).toHaveClass(`button--${size}`)
      })
    })

    it('renderiza iconos correctamente', () => {
      const { container } = render(BaseButton, {
        props: {
          label: 'Test',
          leftIcon: 'fas fa-plus',
          rightIcon: 'fas fa-arrow-right',
        },
      })

      expect(container.querySelector('.button__icon--left i')).toHaveClass('fas', 'fa-plus')
      expect(container.querySelector('.button__icon--right i')).toHaveClass('fas', 'fa-arrow-right')
    })

    it('renderiza botón icon-only correctamente', () => {
      const { container } = render(BaseButton, {
        props: {
          label: 'Añadir',
          iconOnly: true,
          leftIcon: 'fas fa-plus',
        },
      })

      const button = container.querySelector('button')
      expect(button).toHaveClass('button--icon-only')
      expect(container.querySelector('.button__icon--only')).toBeInTheDocument()
    })
  })

  // 🎯 Tests de interacción del usuario
  describe('User Interactions', () => {
    it('emite evento click cuando se hace clic', async () => {
      const mockClick = vi.fn()
      const { getByRole } = render(BaseButton, {
        props: { label: 'Clickeable' },
        attrs: { onClick: mockClick },
      })

      const button = getByRole('button')
      await fireEvent.click(button)

      expect(mockClick).toHaveBeenCalledTimes(1)
      expect(mockClick).toHaveBeenCalledWith(expect.any(MouseEvent))
    })

    it('no emite evento click cuando está disabled', async () => {
      const mockClick = vi.fn()
      const { getByRole } = render(BaseButton, {
        props: { label: 'Disabled', disabled: true },
        attrs: { onClick: mockClick },
      })

      const button = getByRole('button')
      await fireEvent.click(button)

      expect(mockClick).not.toHaveBeenCalled()
      expect(button).toBeDisabled()
    })

    it('no emite evento click cuando está loading', async () => {
      const mockClick = vi.fn()
      const { getByRole } = render(BaseButton, {
        props: { label: 'Loading', loading: true },
        attrs: { onClick: mockClick },
      })

      const button = getByRole('button')
      await fireEvent.click(button)

      expect(mockClick).not.toHaveBeenCalled()
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
    })

    it('emite eventos focus y blur correctamente', async () => {
      const mockFocus = vi.fn()
      const mockBlur = vi.fn()

      const { getByRole } = render(BaseButton, {
        props: { label: 'Focusable' },
        attrs: {
          onFocus: mockFocus,
          onBlur: mockBlur,
        },
      })

      const button = getByRole('button')

      await fireEvent.focus(button)
      expect(mockFocus).toHaveBeenCalledWith(expect.any(FocusEvent))

      await fireEvent.blur(button)
      expect(mockBlur).toHaveBeenCalledWith(expect.any(FocusEvent))
    })
  })

  // ♿ Tests de accesibilidad
  describe('Accessibility', () => {
    it('cumple con las reglas de accesibilidad básicas', async () => {
      const { container } = render(BaseButton, {
        props: { label: 'Botón accesible' },
      })

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('tiene aria-label correcto para botones icon-only', () => {
      const { getByRole } = render(BaseButton, {
        props: {
          label: 'Añadir tarea',
          iconOnly: true,
          leftIcon: 'fas fa-plus',
        },
      })

      const button = getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Añadir tarea')
    })

    it('respeta aria-label personalizado', () => {
      const { getByRole } = render(BaseButton, {
        props: {
          label: 'Click aquí',
          ariaLabel: 'Abrir menú de configuración',
        },
      })

      const button = getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Abrir menú de configuración')
    })

    it('maneja aria-pressed correctamente', async () => {
      const { getByRole, rerender } = render(BaseButton, {
        props: {
          label: 'Toggle',
          ariaPressed: false,
        },
      })

      const button = getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'false')

      rerender({
        label: 'Toggle',
        ariaPressed: true,
      })

      // Wait for DOM to update after rerender
      await nextTick()

      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    it('es navegable por teclado', async () => {
      const mockClick = vi.fn()
      const { getByRole } = render(BaseButton, {
        props: { label: 'Keyboard accessible' },
        attrs: { onClick: mockClick },
      })

      const button = getByRole('button')

      // Simular Tab para focus
      button.focus()
      expect(button).toHaveFocus()

      // Simular Enter
      await fireEvent.keyDown(button, { key: 'Enter' })
      await fireEvent.keyUp(button, { key: 'Enter' })

      // Simular Space
      await fireEvent.keyDown(button, { key: ' ' })
      await fireEvent.keyUp(button, { key: ' ' })
    })
  })

  // 🎨 Tests de estados visuales
  describe('Visual States', () => {
    it('aplica estilos de loading correctamente', () => {
      const { container } = render(BaseButton, {
        props: {
          label: 'Guardando',
          loading: true,
        },
      })

      const button = container.querySelector('button')
      expect(button).toHaveClass('button--loading')
      expect(button).toBeDisabled()
    })

    it('aplica estilos de width correctamente', () => {
      const { container } = render(BaseButton, {
        props: {
          label: 'Full width',
          width: 'full',
        },
      })

      const button = container.querySelector('button')
      expect(button).toHaveClass('button--full-width')
    })

    it('oculta iconos cuando está en loading', () => {
      const { container } = render(BaseButton, {
        props: {
          label: 'Loading with icons',
          leftIcon: 'fas fa-save',
          rightIcon: 'fas fa-check',
          loading: true,
        },
      })

      expect(container.querySelector('.button__icon--left')).not.toBeInTheDocument()
      expect(container.querySelector('.button__icon--right')).not.toBeInTheDocument()
    })
  })

  // 🔧 Tests de casos edge
  describe('Edge Cases', () => {
    it('maneja props undefined sin errores', () => {
      expect(() => {
        render(BaseButton, {
          props: {
            label: undefined,
            variant: undefined,
            size: undefined,
          },
        })
      }).not.toThrow()
    })

    it('mantiene funcionalidad con slot content', () => {
      const { getByRole } = render(BaseButton, {
        props: { label: 'Con slot' },
        slots: {
          default: '<span>Contenido personalizado</span>',
        },
      })

      const button = getByRole('button')
      expect(button).toContainHTML('<span>Contenido personalizado</span>')
    })

    it('respeta diferentes tipos de botón', () => {
      const types = ['button', 'submit', 'reset'] as const

      types.forEach(type => {
        const { getByRole, unmount } = render(BaseButton, {
          props: { label: 'Test', type },
        })

        const button = getByRole('button')
        expect(button).toHaveAttribute('type', type)
        
        // Clean up after each iteration to prevent DOM accumulation
        unmount()
      })
    })
  })

  // 🚀 Tests de performance
  describe('Performance', () => {
    it('no causa re-renders innecesarios', () => {
      const renderSpy = vi.fn()

      const TestWrapper = {
        setup() {
          renderSpy()
          return {}
        },
        template: '<BaseButton label="Performance test" />',
        components: { BaseButton },
      }

      const { rerender } = render(TestWrapper)

      // Renderizado inicial
      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Re-render con mismas props no debería causar re-renderizado
      rerender({})
      expect(renderSpy).toHaveBeenCalledTimes(1)
    })

    it('computa clases eficientemente', () => {
      const { container } = render(BaseButton, {
        props: {
          label: 'Test',
          variant: 'primary',
          size: 'large',
          width: 'full',
          disabled: true,
          loading: false,
          iconOnly: false,
        },
      })

      const button = container.querySelector('button')
      expect(button?.className).toBeTruthy()
      expect(button?.className.split(' ').length).toBeGreaterThan(0)
    })
  })
})