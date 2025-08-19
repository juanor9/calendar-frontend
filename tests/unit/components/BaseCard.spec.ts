import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCard from '@/shared/ui/BaseCard/BaseCard.vue'

describe('BaseCard', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(BaseCard, {
        slots: {
          default: 'Card content',
        },
      })

      expect(wrapper.find('.card').exists()).toBe(true)
      expect(wrapper.find('.card--default').exists()).toBe(true)
      expect(wrapper.find('.card--padding-medium').exists()).toBe(true)
      expect(wrapper.text()).toContain('Card content')
    })

    it('renders with custom variant', () => {
      const wrapper = mount(BaseCard, {
        props: {
          variant: 'elevated',
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('.card--elevated').exists()).toBe(true)
    })

    it('renders with custom padding', () => {
      const wrapper = mount(BaseCard, {
        props: {
          padding: 'large',
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('.card--padding-large').exists()).toBe(true)
    })

    it('renders with custom HTML element', () => {
      const wrapper = mount(BaseCard, {
        props: {
          as: 'article',
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.element.tagName.toLowerCase()).toBe('article')
    })

    it('renders all slot content correctly', () => {
      const wrapper = mount(BaseCard, {
        slots: {
          header: '<h3>Header content</h3>',
          default: 'Body content',
          footer: '<p>Footer content</p>',
          actions: '<button>Action</button>',
        },
      })

      expect(wrapper.find('.card__header').exists()).toBe(true)
      expect(wrapper.find('.card__body').exists()).toBe(true)
      expect(wrapper.find('.card__footer').exists()).toBe(true)
      expect(wrapper.find('.card__actions').exists()).toBe(true)
      expect(wrapper.html()).toContain('Header content')
      expect(wrapper.html()).toContain('Body content')
      expect(wrapper.html()).toContain('Footer content')
      expect(wrapper.html()).toContain('Action')
    })
  })

  describe('Loading State', () => {
    it('shows loading state when loading is true', () => {
      const wrapper = mount(BaseCard, {
        props: {
          loading: true,
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('.card--loading').exists()).toBe(true)
      expect(wrapper.find('.card__loading').exists()).toBe(true)
      expect(wrapper.find('.card__spinner').exists()).toBe(true)
      expect(wrapper.find('.sr-only').text()).toBe('Cargando...')
      expect(wrapper.find('.card__content').exists()).toBe(false)
    })

    it('shows content when not loading', () => {
      const wrapper = mount(BaseCard, {
        props: {
          loading: false,
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('.card__loading').exists()).toBe(false)
      expect(wrapper.find('.card__content').exists()).toBe(true)
    })
  })

  describe('Clickable Functionality', () => {
    it('adds clickable classes and attributes when clickable', () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('.card--clickable').exists()).toBe(true)
      expect(wrapper.attributes('tabindex')).toBe('0')
      expect(wrapper.attributes('role')).toBe('button')
    })

    it('does not add clickable attributes when not clickable', () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: false,
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('.card--clickable').exists()).toBe(false)
      expect(wrapper.attributes('tabindex')).toBeUndefined()
      expect(wrapper.attributes('role')).toBeUndefined()
    })

    it('emits click event when clicked and clickable', async () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('does not emit click event when not clickable', async () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: false,
        },
        slots: {
          default: 'Content',
        },
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('emits click event on Enter key press', async () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      await wrapper.trigger('keydown.enter')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('emits click event on Space key press', async () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      await wrapper.trigger('keydown.space')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('emits focus and blur events when clickable', async () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      await wrapper.trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()

      await wrapper.trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('does not emit focus and blur events when not clickable', async () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: false,
        },
        slots: {
          default: 'Content',
        },
      })

      await wrapper.trigger('focus')
      expect(wrapper.emitted('focus')).toBeFalsy()

      await wrapper.trigger('blur')
      expect(wrapper.emitted('blur')).toBeFalsy()
    })
  })

  describe('Disabled State', () => {
    it('applies disabled classes and attributes', () => {
      const wrapper = mount(BaseCard, {
        props: {
          disabled: true,
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('.card--disabled').exists()).toBe(true)
      expect(wrapper.find('.card--clickable').exists()).toBe(false)
      expect(wrapper.attributes('aria-disabled')).toBe('true')
      expect(wrapper.attributes('tabindex')).toBeUndefined()
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mount(BaseCard, {
        props: {
          disabled: true,
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('does not emit click on keyboard events when disabled', async () => {
      const wrapper = mount(BaseCard, {
        props: {
          disabled: true,
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      await wrapper.trigger('keydown.enter')
      await wrapper.trigger('keydown.space')
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Accessibility', () => {
    it('sets correct ARIA attributes', () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: true,
          disabled: true,
          loading: true,
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.attributes('aria-disabled')).toBe('true')
      expect(wrapper.attributes('aria-busy')).toBe('true')
    })

    it('provides screen reader text for loading state', () => {
      const wrapper = mount(BaseCard, {
        props: {
          loading: true,
        },
        slots: {
          default: 'Content',
        },
      })

      const srText = wrapper.find('.sr-only')
      expect(srText.exists()).toBe(true)
      expect(srText.text()).toBe('Cargando...')
      expect(srText.attributes('aria-hidden')).toBeUndefined()

      const spinner = wrapper.find('.card__spinner')
      expect(spinner.attributes('aria-hidden')).toBe('true')
    })

    it('has correct role when clickable', () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.attributes('role')).toBe('button')
    })

    it('does not have role when not clickable', () => {
      const wrapper = mount(BaseCard, {
        props: {
          clickable: false,
        },
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.attributes('role')).toBeUndefined()
    })
  })

  describe('Variants', () => {
    const variants = ['default', 'elevated', 'outlined', 'ghost'] as const

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        const wrapper = mount(BaseCard, {
          props: {
            variant,
          },
          slots: {
            default: 'Content',
          },
        })

        expect(wrapper.find(`.card--${variant}`).exists()).toBe(true)
      })
    })
  })

  describe('Padding Options', () => {
    const paddingOptions = ['none', 'small', 'medium', 'large'] as const

    paddingOptions.forEach(padding => {
      it(`renders ${padding} padding correctly`, () => {
        const wrapper = mount(BaseCard, {
          props: {
            padding,
          },
          slots: {
            default: 'Content',
          },
        })

        expect(wrapper.find(`.card--padding-${padding}`).exists()).toBe(true)
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles loading state priority over disabled state', () => {
      const wrapper = mount(BaseCard, {
        props: {
          loading: true,
          disabled: true,
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      // Should show loading, not just disabled state
      expect(wrapper.find('.card--loading').exists()).toBe(true)
      expect(wrapper.find('.card__loading').exists()).toBe(true)
    })

    it('does not emit events when loading', async () => {
      const wrapper = mount(BaseCard, {
        props: {
          loading: true,
          clickable: true,
        },
        slots: {
          default: 'Content',
        },
      })

      await wrapper.trigger('click')
      await wrapper.trigger('keydown.enter')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('handles empty slots gracefully', () => {
      const wrapper = mount(BaseCard)

      expect(wrapper.find('.card__header').exists()).toBe(false)
      expect(wrapper.find('.card__body').exists()).toBe(false)
      expect(wrapper.find('.card__footer').exists()).toBe(false)
      expect(wrapper.find('.card__actions').exists()).toBe(false)
      expect(wrapper.find('.card__content').exists()).toBe(true)
    })
  })
})
