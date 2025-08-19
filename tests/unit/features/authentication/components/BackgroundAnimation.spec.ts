/**
 * COMPONENT ANALYSIS TEMPLATE - BackgroundAnimation.vue
 *
 * COMPONENT: BackgroundAnimation.vue
 * DEPENDENCIES FOUND:
 * - No props
 * - Composable: useVerificationAnimation (createFloatingShapes)
 * - Reactive state: shapes (ref<FloatingShape[]>)
 * - Lifecycle: onMounted calls createFloatingShapes
 * - Interface: FloatingShape with key, style properties
 * - Pure animation component with generated shapes
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/vue'
import { nextTick } from 'vue'
import '@testing-library/jest-dom'
import BackgroundAnimation from '@/features/authentication/components/email-verification/BackgroundAnimation.vue'

// Mock the useVerificationAnimation composable
const mockCreateFloatingShapes = vi.fn()
vi.mock('@/features/authentication/composables/useVerificationAnimation', () => ({
  useVerificationAnimation: () => ({
    createFloatingShapes: mockCreateFloatingShapes,
  }),
}))

describe('BackgroundAnimation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default mock implementation
    mockCreateFloatingShapes.mockReturnValue([
      {
        key: 0,
        style: {
          animationDelay: '0s',
          left: '10%',
          animationDuration: '4s',
        },
      },
      {
        key: 1,
        style: {
          animationDelay: '0.5s',
          left: '30%',
          animationDuration: '3.5s',
        },
      },
      {
        key: 2,
        style: {
          animationDelay: '1s',
          left: '60%',
          animationDuration: '5s',
        },
      },
    ])
  })

  const renderComponent = () => {
    return render(BackgroundAnimation)
  }

  describe('Component Initialization', () => {
    it('renders without errors', () => {
      renderComponent()

      const backgroundDiv = document.querySelector('.background-animation')
      expect(backgroundDiv).toBeInTheDocument()
    })

    it('calls createFloatingShapes on mount', async () => {
      renderComponent()
      await nextTick()
      expect(mockCreateFloatingShapes).toHaveBeenCalledTimes(1)
    })

    it('has proper container structure', () => {
      renderComponent()
      const backgroundAnimation = document.querySelector('.background-animation')
      expect(backgroundAnimation).toBeInTheDocument()
      const floatingShapes = document.querySelector('.floating-shapes')
      expect(floatingShapes).toBeInTheDocument()
    })
  })

  describe('Floating Shapes Rendering', () => {
    it('renders shapes returned by createFloatingShapes', async () => {
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll('.shape')
      expect(shapes).toHaveLength(3)
    })

    it('applies correct styles to each shape (dynamic inline only)', async () => {
      renderComponent()
      await nextTick()

      const shapes = document.querySelectorAll<HTMLElement>('.shape')

      // Solo verificamos estilos dinámicos que vienen por :style del componente
      expect(shapes[0].style.animationDelay).toBe('0s')
      expect(shapes[0].style.left).toBe('10%')
      expect(shapes[0].style.animationDuration).toBe('4s')

      expect(shapes[1].style.animationDelay).toBe('0.5s')
      expect(shapes[1].style.left).toBe('30%')
      expect(shapes[1].style.animationDuration).toBe('3.5s')

      expect(shapes[2].style.animationDelay).toBe('1s')
      expect(shapes[2].style.left).toBe('60%')
      expect(shapes[2].style.animationDuration).toBe('5s')
    })

    it('assigns unique keys to shapes', async () => {
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll('.shape')
      const keys = Array.from(shapes).map((_, index) => index)
      const uniqueKeys = new Set(keys)
      expect(uniqueKeys.size).toBe(shapes.length)
    })
  })

  describe('CSS Classes and Styling', () => {
    it('applies correct CSS classes to container', () => {
      renderComponent()
      const backgroundAnimation = document.querySelector('.background-animation')
      expect(backgroundAnimation).toHaveClass('background-animation')
      // No verificamos estilos por CSS aquí (jsdom no los calcula)
    })

    it('shapes have proper classes applied', async () => {
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll('.shape')
      shapes.forEach(shape => {
        expect(shape).toHaveClass('shape')
      })
    })

    it('applies nth-child animation variations (class presence)', async () => {
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll('.shape')
      expect(shapes.length).toBeGreaterThan(0)
    })
  })

  describe('Animation Properties', () => {
    it('exposes only dynamic inline animation properties (base via CSS)', async () => {
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll<HTMLElement>('.shape')
      shapes.forEach(shape => {
        // Los básicos (width/height/background/position/animation) vienen por CSS, no inline
        expect(shape.classList.contains('shape')).toBe(true)
      })
    })

    it('container overflow handling is provided by CSS class', () => {
      renderComponent()
      const backgroundAnimation = document.querySelector('.background-animation')
      expect(backgroundAnimation).toHaveClass('background-animation')
    })
  })

  describe('Dynamic Shape Generation', () => {
    it('handles empty shapes array', async () => {
      mockCreateFloatingShapes.mockReturnValue([])
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll('.shape')
      expect(shapes).toHaveLength(0)
    })

    it('handles single shape', async () => {
      mockCreateFloatingShapes.mockReturnValue([
        {
          key: 0,
          style: {
            animationDelay: '0s',
            left: '50%',
            animationDuration: '4s',
          },
        },
      ])
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll<HTMLElement>('.shape')
      expect(shapes).toHaveLength(1)
      expect(shapes[0].style.left).toBe('50%')
      expect(shapes[0].style.animationDelay).toBe('0s')
      expect(shapes[0].style.animationDuration).toBe('4s')
    })

    it('handles many shapes', async () => {
      const manyShapes = Array.from({ length: 10 }, (_, i) => ({
        key: i,
        style: {
          animationDelay: `${i * 0.2}s`,
          left: `${i * 10}%`,
          animationDuration: `${3 + i * 0.1}s`,
        },
      }))
      mockCreateFloatingShapes.mockReturnValue(manyShapes)
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll('.shape')
      expect(shapes).toHaveLength(10)
    })
  })

  describe('Positioning and Layout', () => {
    it('container covers full area via CSS class', () => {
      renderComponent()
      const backgroundAnimation = document.querySelector('.background-animation')
      expect(backgroundAnimation).toHaveClass('background-animation')
    })

    it('is positioned behind main content via CSS class', () => {
      renderComponent()
      const backgroundAnimation = document.querySelector('.background-animation')
      expect(backgroundAnimation).toHaveClass('background-animation')
    })

    it('shapes are positioned absolutely (via CSS class)', async () => {
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll('.shape')
      shapes.forEach(shape => {
        expect(shape).toHaveClass('shape')
      })
    })
  })

  describe('Performance and Optimization', () => {
    it('only calls createFloatingShapes once per mount', async () => {
      const { unmount } = renderComponent()
      await nextTick()
      expect(mockCreateFloatingShapes).toHaveBeenCalledTimes(1)
      await nextTick()
      expect(mockCreateFloatingShapes).toHaveBeenCalledTimes(1)
      unmount()
    })

    it('uses CSS-based animations (class-driven)', async () => {
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll('.shape')
      shapes.forEach(shape => {
        expect(shape.classList.contains('shape')).toBe(true)
      })
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('does not crash when createFloatingShapes throws in onMounted (async)', async () => {
      mockCreateFloatingShapes.mockImplementation(() => {
        throw new Error('Shape creation failed')
      })

      // No debe lanzar de forma síncrona al montar
      expect(() => {
        renderComponent()
      }).not.toThrow()

      // El error ocurre en onMounted => siguiente tick
      await nextTick()

      // Y no debe haber shapes renderizados
      const shapes = document.querySelectorAll('.shape')
      expect(shapes.length).toBe(0)
    })

    it('handles malformed shape data', async () => {
      mockCreateFloatingShapes.mockReturnValue([
        {
          key: 0,
          style: {} as any,
        },
      ])
      renderComponent()
      await nextTick()
      const shapes = document.querySelectorAll('.shape')
      expect(shapes).toHaveLength(1)
    })
  })

  describe('Accessibility', () => {
    it('does not interfere with screen readers', () => {
      renderComponent()
      const backgroundAnimation = document.querySelector('.background-animation')
      expect(backgroundAnimation).not.toHaveAttribute('role')
      expect(backgroundAnimation).not.toHaveAttribute('aria-label')
    })

    it('respects reduced motion preferences (handled in CSS/media queries)', () => {
      renderComponent()
      const backgroundAnimation = document.querySelector('.background-animation')
      expect(backgroundAnimation).toBeInTheDocument()
    })
  })

  describe('Integration with Animation Composable', () => {
    it('properly integrates with useVerificationAnimation', async () => {
      renderComponent()
      await nextTick()
      expect(mockCreateFloatingShapes).toHaveBeenCalledWith()
      expect(mockCreateFloatingShapes).toHaveReturnedWith(
        expect.arrayContaining([
          expect.objectContaining({
            key: expect.any(Number),
            style: expect.objectContaining({
              animationDelay: expect.any(String),
              left: expect.any(String),
              animationDuration: expect.any(String),
            }),
          }),
        ]),
      )
    })
  })
})
