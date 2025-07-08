import { mount } from '@vue/test-utils'
import DefaultLayout from '@/layouts/DefaultLayout/DefaultLayout.vue'

describe('DefaultLayout.vue', () => {
  it('renders layout with header and sidebar', () => {
    const wrapper = mount(DefaultLayout, {
      global: {
        stubs: ['router-view']
      }
    })

    expect(wrapper.find('.header-bar').exists()).toBe(true)
    expect(wrapper.find('.sidebar-menu').exists()).toBe(true)
    expect(wrapper.find('.default-layout__main').exists()).toBe(true)
  })
})
