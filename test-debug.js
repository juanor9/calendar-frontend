// Debug script para entender el problema de BaseBadge
import { mount } from '@vue/test-utils'
import BaseBadge from './src/ui/BaseBadge/BaseBadge.vue'
import { vi } from 'vitest'

console.log('=== DEBUGGING BASEBADGE ATTRS ===')

const mockClick = vi.fn()
const wrapper = mount(BaseBadge, {
  attrs: {
    'data-testid': 'badge-test',
    onClick: mockClick,
  },
  slots: {
    default: 'Test Badge',
  },
})

// Ver qué classes tiene realmente
console.log('Classes:', wrapper.classes())

// Ver si el componente está accediendo a attrs correctamente
console.log('Data-testid attr:', wrapper.find('.badge').attributes('data-testid'))

// Verificar si podemos acceder al componente y sus attrs internos
const component = wrapper.vm
console.log('Component useAttrs:', component.$attrs)