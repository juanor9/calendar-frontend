import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SidebarMenu from '@/ui/SidebarMenu/SidebarMenu.vue'

describe('SidebarMenu', () => {
  const createWrapper = () => {
    return mount(SidebarMenu)
  }

  describe('Rendering', () => {
    it('renders correctly with basic structure', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('aside.sidebar-menu').exists()).toBe(true)
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('Navigation')
    })

    it('has correct semantic structure', () => {
      const wrapper = createWrapper()

      const aside = wrapper.find('aside')
      expect(aside.exists()).toBe(true)
      expect(aside.classes()).toContain('sidebar-menu')
    })

    it('renders without errors', () => {
      expect(() => {
        createWrapper()
      }).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('uses semantic aside element', () => {
      const wrapper = createWrapper()

      const aside = wrapper.find('aside')
      expect(aside.exists()).toBe(true)
    })

    it('has proper heading structure', () => {
      const wrapper = createWrapper()

      const heading = wrapper.find('h3')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBe('Navigation')
    })
  })

  describe('CSS Classes', () => {
    it('applies correct CSS class', () => {
      const wrapper = createWrapper()

      expect(wrapper.classes()).toContain('sidebar-menu')
    })
  })

  describe('Component Structure', () => {
    it('matches expected HTML structure', () => {
      const wrapper = createWrapper()

      // Vue adds scoped data attributes, so we check for the class and structure
      expect(wrapper.find('aside.sidebar-menu').exists()).toBe(true)
      expect(wrapper.find('h3').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('Navigation')
      expect(wrapper.html()).toContain('</aside>')
    })
  })

  describe('Edge Cases', () => {
    it('handles multiple instances', () => {
      const wrapper1 = createWrapper()
      const wrapper2 = createWrapper()

      expect(wrapper1.find('.sidebar-menu').exists()).toBe(true)
      expect(wrapper2.find('.sidebar-menu').exists()).toBe(true)
    })

    it('can be unmounted without errors', () => {
      const wrapper = createWrapper()

      expect(() => {
        wrapper.unmount()
      }).not.toThrow()
    })
  })
})
