/**
 * COMPOSABLE ANALYSIS TEMPLATE - useVerificationAnimation.ts
 * 
 * COMPOSABLE: useVerificationAnimation.ts (Animation Effects)
 * DEPENDENCIES FOUND:
 * - DOM manipulation: document.querySelector
 * - Interface: FloatingShape with key and style properties
 * - Methods: showVerificationSuccess, createFloatingShapes, addSuccessClass
 * - Animation: CSS class manipulation and setTimeout
 * - Math: Math.random for shape positioning
 * - Pure utility composable for animation effects
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useVerificationAnimation } from '@/features/authentication/composables/useVerificationAnimation'

// Mock DOM methods
const mockQuerySelector = vi.fn()
vi.stubGlobal('document', {
  querySelector: mockQuerySelector
})

// Mock setTimeout
vi.stubGlobal('setTimeout', vi.fn())

describe('useVerificationAnimation Composable', () => {
  let mockElement: HTMLElement
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Create mock DOM element
    mockElement = {
      classList: {
        add: vi.fn(),
        remove: vi.fn()
      }
    } as any
    
    mockQuerySelector.mockReturnValue(mockElement)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('returns all required methods', () => {
      const animation = useVerificationAnimation()

      expect(animation).toHaveProperty('showVerificationSuccess')
      expect(animation).toHaveProperty('createFloatingShapes')
      expect(animation).toHaveProperty('addSuccessClass')
    })

    it('methods are functions', () => {
      const { showVerificationSuccess, createFloatingShapes, addSuccessClass } = useVerificationAnimation()

      expect(typeof showVerificationSuccess).toBe('function')
      expect(typeof createFloatingShapes).toBe('function')
      expect(typeof addSuccessClass).toBe('function')
    })
  })

  describe('Show Verification Success', () => {
    it('finds verification card element', () => {
      const { showVerificationSuccess } = useVerificationAnimation()
      
      showVerificationSuccess()
      
      expect(mockQuerySelector).toHaveBeenCalledWith('.verification-card')
    })

    it('adds success animation class to element', () => {
      const { showVerificationSuccess } = useVerificationAnimation()
      
      showVerificationSuccess()
      
      expect(mockElement.classList.add).toHaveBeenCalledWith('success-animation')
    })

    it('removes success animation class after timeout', () => {
      const { showVerificationSuccess } = useVerificationAnimation()
      const mockSetTimeout = vi.mocked(setTimeout)
      
      let timeoutCallback: Function
      mockSetTimeout.mockImplementation((callback: Function, delay: number) => {
        timeoutCallback = callback
        expect(delay).toBe(1000)
        return 123 as any
      })
      
      showVerificationSuccess()
      
      expect(mockElement.classList.add).toHaveBeenCalledWith('success-animation')
      
      // Execute timeout callback
      timeoutCallback!()
      
      expect(mockElement.classList.remove).toHaveBeenCalledWith('success-animation')
    })

    it('handles missing element gracefully', () => {
      const { showVerificationSuccess } = useVerificationAnimation()
      mockQuerySelector.mockReturnValue(null)
      
      expect(() => showVerificationSuccess()).not.toThrow()
      
      expect(mockQuerySelector).toHaveBeenCalledWith('.verification-card')
    })
  })

  describe('Create Floating Shapes', () => {
    it('creates array of floating shapes', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes = createFloatingShapes()
      
      expect(Array.isArray(shapes)).toBe(true)
      expect(shapes).toHaveLength(6)
    })

    it('each shape has required properties', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes = createFloatingShapes()
      
      shapes.forEach((shape, index) => {
        expect(shape).toHaveProperty('key', index)
        expect(shape).toHaveProperty('style')
        expect(shape.style).toHaveProperty('animationDelay')
        expect(shape.style).toHaveProperty('left')
        expect(shape.style).toHaveProperty('animationDuration')
      })
    })

    it('generates unique keys for each shape', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes = createFloatingShapes()
      
      const keys = shapes.map(shape => shape.key)
      const uniqueKeys = new Set(keys)
      
      expect(uniqueKeys.size).toBe(shapes.length)
    })

    it('generates varied animation delays', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes = createFloatingShapes()
      
      const delays = shapes.map(shape => shape.style.animationDelay)
      const uniqueDelays = new Set(delays)
      
      // Should have different delays for variety
      expect(uniqueDelays.size).toBeGreaterThan(1)
    })

    it('uses proper animation delay format', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes = createFloatingShapes()
      
      shapes.forEach(shape => {
        expect(shape.style.animationDelay).toMatch(/^\d+(?:\.\d+)?s$/)
      })
    })

    it('generates random left positions', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      // Mock Math.random to return predictable values
      const originalRandom = Math.random
      Math.random = vi.fn()
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.3)
        .mockReturnValueOnce(0.7)
        .mockReturnValueOnce(0.2)
      
      const shapes = createFloatingShapes()
      
      expect(shapes[0].style.left).toBe('10%')
      expect(shapes[1].style.left).toBe('50%')
      expect(shapes[2].style.left).toBe('90%')
      
      Math.random = originalRandom
    })

    it('generates varied animation durations', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes = createFloatingShapes()
      
      const durations = shapes.map(shape => shape.style.animationDuration)
      const uniqueDurations = new Set(durations)
      
      // Should have different durations for variety
      expect(uniqueDurations.size).toBeGreaterThan(1)
    })

    it('uses proper animation duration format', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes = createFloatingShapes()
      
      shapes.forEach(shape => {
        expect(shape.style.animationDuration).toMatch(/^\d+(?:\.\d+)?s$/)
      })
    })

    it('generates durations within expected range', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes = createFloatingShapes()
      
      shapes.forEach(shape => {
        const duration = parseFloat(shape.style.animationDuration)
        expect(duration).toBeGreaterThanOrEqual(3)
        expect(duration).toBeLessThanOrEqual(5)
      })
    })
  })
})

describe('Add Success Class', () => {
    it('adds success animation class to provided element', () => {
      const { addSuccessClass } = useVerificationAnimation()
      
      addSuccessClass(mockElement)
      
      expect(mockElement.classList.add).toHaveBeenCalledWith('success-animation')
    })

    it('removes success animation class after timeout', () => {
      const { addSuccessClass } = useVerificationAnimation()
      const mockSetTimeout = vi.mocked(setTimeout)
      
      let timeoutCallback: Function
      mockSetTimeout.mockImplementation((callback: Function, delay: number) => {
        timeoutCallback = callback
        expect(delay).toBe(1000)
        return 123 as any
      })
      
      addSuccessClass(mockElement)
      
      expect(mockElement.classList.add).toHaveBeenCalledWith('success-animation')
      
      // Execute timeout callback
      timeoutCallback!()
      
      expect(mockElement.classList.remove).toHaveBeenCalledWith('success-animation')
    })

    it('uses same timeout duration as showVerificationSuccess', () => {
      const { addSuccessClass } = useVerificationAnimation()
      const mockSetTimeout = vi.mocked(setTimeout)
      
      addSuccessClass(mockElement)
      
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 1000)
    })
  })

describe('Animation Timing', () => {
    it('uses consistent 1 second timeout for animations', () => {
      const { showVerificationSuccess, addSuccessClass } = useVerificationAnimation()
      const mockSetTimeout = vi.mocked(setTimeout)
      
      showVerificationSuccess()
      addSuccessClass(mockElement)
      
      expect(mockSetTimeout).toHaveBeenCalledTimes(2)
      expect(mockSetTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 1000)
      expect(mockSetTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 1000)
    })

    it('shapes have progressive animation delays', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes = createFloatingShapes()
      
      // Verify delay progression (each shape delayed by 0.5s)
      shapes.forEach((shape, index) => {
        const expectedDelay = `${index * 0.5}s`
        expect(shape.style.animationDelay).toBe(expectedDelay)
      })
    })
  })

describe('Shape Generation Consistency', () => {
    it('generates same number of shapes on multiple calls', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes1 = createFloatingShapes()
      const shapes2 = createFloatingShapes()
      
      expect(shapes1).toHaveLength(6)
      expect(shapes2).toHaveLength(6)
    })

    it('generates different random positions on multiple calls', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes1 = createFloatingShapes()
      const shapes2 = createFloatingShapes()
      
      const positions1 = shapes1.map(shape => shape.style.left)
      const positions2 = shapes2.map(shape => shape.style.left)
      
      // Should be different due to randomness
      expect(positions1).not.toEqual(positions2)
    })
  })

describe('Error Handling', () => {
    it('handles DOM query errors gracefully', () => {
      const { showVerificationSuccess } = useVerificationAnimation()
      
      mockQuerySelector.mockImplementation(() => {
        throw new Error('DOM error')
      })
      
      expect(() => showVerificationSuccess()).not.toThrow()
    })

    it('handles element without classList', () => {
      const { addSuccessClass } = useVerificationAnimation()
      
      const elementWithoutClassList = {} as HTMLElement
      
      expect(() => addSuccessClass(elementWithoutClassList)).not.toThrow()
    })

    it('handles null element gracefully', () => {
      const { addSuccessClass } = useVerificationAnimation()
      
      expect(() => addSuccessClass(null as any)).not.toThrow()
    })
  })

describe('Math.random Usage', () => {
    it('uses Math.random for shape positioning', () => {
      const originalRandom = Math.random
      const mockRandom = vi.fn().mockReturnValue(0.5)
      Math.random = mockRandom
      
      const { createFloatingShapes } = useVerificationAnimation()
      
      createFloatingShapes()
      
      expect(mockRandom).toHaveBeenCalled()
      
      Math.random = originalRandom
    })

    it('uses Math.random for animation duration variation', () => {
      const originalRandom = Math.random
      const mockRandom = vi.fn().mockReturnValue(0.5)
      Math.random = mockRandom
      
      const { createFloatingShapes } = useVerificationAnimation()
      
      createFloatingShapes()
      
      // Should be called for both position and duration for each shape
      expect(mockRandom).toHaveBeenCalledTimes(12) // 6 shapes × 2 calls each
      
      Math.random = originalRandom
    })
  })

describe('Type Safety', () => {
    it('createFloatingShapes returns properly typed shapes', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes = createFloatingShapes()
      
      shapes.forEach(shape => {
        expect(typeof shape.key).toBe('number')
        expect(typeof shape.style).toBe('object')
        expect(typeof shape.style.animationDelay).toBe('string')
        expect(typeof shape.style.left).toBe('string')
        expect(typeof shape.style.animationDuration).toBe('string')
      })
    })
  })

describe('Animation Class Names', () => {
    it('uses consistent class name for success animation', () => {
      const { showVerificationSuccess, addSuccessClass } = useVerificationAnimation()
      
      showVerificationSuccess()
      addSuccessClass(mockElement)
      
      expect(mockElement.classList.add).toHaveBeenCalledWith('success-animation')
      expect(mockElement.classList.add).toHaveBeenCalledTimes(2)
    })

    it('removes same class name that was added', () => {
      const { addSuccessClass } = useVerificationAnimation()
      const mockSetTimeout = vi.mocked(setTimeout)
      
      let timeoutCallback: Function
      mockSetTimeout.mockImplementation((callback: Function) => {
        timeoutCallback = callback
        return 123 as any
      })
      
      addSuccessClass(mockElement)
      timeoutCallback!()
      
      expect(mockElement.classList.add).toHaveBeenCalledWith('success-animation')
      expect(mockElement.classList.remove).toHaveBeenCalledWith('success-animation')
    })
  })

describe('Performance Considerations', () => {
    it('does not create new shapes unnecessarily', () => {
      const { createFloatingShapes } = useVerificationAnimation()
      
      const shapes1 = createFloatingShapes()
      const shapes2 = createFloatingShapes()
      
      // Each call should create fresh shapes, not reuse
      expect(shapes1).not.toBe(shapes2)
      expect(shapes1).toEqual(expect.any(Array))
      expect(shapes2).toEqual(expect.any(Array))
    })

    it('minimizes DOM queries', () => {
      const { showVerificationSuccess } = useVerificationAnimation()
      
      showVerificationSuccess()
      
      // Should only query once per call
      expect(mockQuerySelector).toHaveBeenCalledTimes(1)
    })
  })