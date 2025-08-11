import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import SidebarMenu from './SidebarMenu.vue'

const meta: Meta<typeof SidebarMenu> = {
  title: 'UI/Navigation/Sidebar Menu',
  component: SidebarMenu,
  parameters: {
    docs: {
      description: {
        component:
          'A flexible sidebar navigation component with collapsible state, multiple width options, and responsive behavior. Built following the Vana design system with BEM methodology.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-sidebar',
    },
    layout: 'fullscreen',
  },
  argTypes: {
    collapsed: {
      control: 'boolean',
      description: 'Controls collapsed/expanded state of the sidebar',
    },
    position: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the sidebar',
    },
    width: {
      control: 'select',
      options: ['narrow', 'medium', 'wide'],
      description: 'Width variant of the sidebar',
    },
    variant: {
      control: 'select',
      options: ['default', 'minimal', 'bordered'],
      description: 'Visual style variant',
    },
    showToggle: {
      control: 'boolean',
      description: 'Shows/hides the collapse toggle button',
    },
    persistent: {
      control: 'boolean',
      description: 'Persistent positioning (relative vs fixed)',
    },
    overlay: {
      control: 'boolean',
      description: 'Overlay mode for mobile interfaces',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SidebarMenu>

export const Default: Story = {
  args: {
    collapsed: false,
    position: 'left',
    width: 'medium',
    variant: 'default',
    showToggle: true,
    persistent: true,
    overlay: false,
  },
  render: args => ({
    components: { SidebarMenu },
    setup() {
      const collapsed = ref(args.collapsed)

      const handleToggle = (isCollapsed: boolean) => {
        console.log('Sidebar toggled:', isCollapsed)
      }

      const handleItemClick = (item: unknown, event: MouseEvent) => {
        console.log('Menu item clicked:', item, event)
      }

      return {
        args,
        collapsed,
        handleToggle,
        handleItemClick,
      }
    },
    template: `
      <div style="display: flex; min-height: 100vh;">
        <SidebarMenu 
          v-bind="args" 
          v-model:collapsed="collapsed"
          @toggle="handleToggle"
          @item-click="handleItemClick"
        />
        
        <div style="flex: 1; padding: 24px; background: #f9fafb;">
          <h1>Main Content Area</h1>
          <p>This is the main content area next to the sidebar.</p>
          <p><strong>Sidebar State:</strong> {{ collapsed ? 'Collapsed' : 'Expanded' }}</p>
          <button 
            @click="collapsed = !collapsed"
            style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            Toggle Sidebar
          </button>
        </div>
      </div>
    `,
  }),
}

export const CollapsedState: Story = {
  args: {
    collapsed: true,
    position: 'left',
    width: 'medium',
    variant: 'default',
    showToggle: true,
  },
  render: args => ({
    components: { SidebarMenu },
    setup() {
      const collapsed = ref(args.collapsed)
      return { args, collapsed }
    },
    template: `
      <div style="display: flex; min-height: 100vh;">
        <SidebarMenu v-bind="args" v-model:collapsed="collapsed" />
        
        <div style="flex: 1; padding: 24px; background: #f9fafb;">
          <h1>Collapsed Sidebar Demo</h1>
          <p>The sidebar is now collapsed, showing only icons. Hover over menu items to see their labels in tooltips (when implemented).</p>
          <button 
            @click="collapsed = false"
            style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            Expand Sidebar
          </button>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sidebar in collapsed state showing only icons and minimal width.',
      },
    },
  },
}

export const WidthVariants: Story = {
  render: () => ({
    components: { SidebarMenu },
    setup() {
      const narrowCollapsed = ref(false)
      const mediumCollapsed = ref(false)
      const wideCollapsed = ref(false)

      return {
        narrowCollapsed,
        mediumCollapsed,
        wideCollapsed,
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; min-height: 300px;">
          <SidebarMenu width="narrow" v-model:collapsed="narrowCollapsed" />
          <div style="flex: 1; padding: 16px; background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
            <h3>Narrow Width Sidebar</h3>
          </div>
        </div>
        
        <div style="display: flex; min-height: 300px;">
          <SidebarMenu width="medium" v-model:collapsed="mediumCollapsed" />
          <div style="flex: 1; padding: 16px; background: #e5e7eb; display: flex; align-items: center; justify-content: center;">
            <h3>Medium Width Sidebar (Default)</h3>
          </div>
        </div>
        
        <div style="display: flex; min-height: 300px;">
          <SidebarMenu width="wide" v-model:collapsed="wideCollapsed" />
          <div style="flex: 1; padding: 16px; background: #d1d5db; display: flex; align-items: center; justify-content: center;">
            <h3>Wide Width Sidebar</h3>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different width variants: narrow (200px), medium (256px), and wide (320px).',
      },
    },
  },
}

export const StyleVariants: Story = {
  render: () => ({
    components: { SidebarMenu },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; min-height: 300px;">
          <SidebarMenu variant="default" />
          <div style="flex: 1; padding: 16px; background: #f9fafb; display: flex; align-items: center; justify-content: center;">
            <h3>Default Variant</h3>
          </div>
        </div>
        
        <div style="display: flex; min-height: 300px; background: #f3f4f6;">
          <SidebarMenu variant="minimal" />
          <div style="flex: 1; padding: 16px; display: flex; align-items: center; justify-content: center;">
            <h3>Minimal Variant (Transparent)</h3>
          </div>
        </div>
        
        <div style="display: flex; min-height: 300px;">
          <SidebarMenu variant="bordered" />
          <div style="flex: 1; padding: 16px; background: #f9fafb; display: flex; align-items: center; justify-content: center;">
            <h3>Bordered Variant</h3>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Different style variants: default with background, minimal transparent, and bordered with enhanced border.',
      },
    },
  },
}

export const RightPositioned: Story = {
  args: {
    position: 'right',
    collapsed: false,
    width: 'medium',
  },
  render: args => ({
    components: { SidebarMenu },
    setup() {
      const collapsed = ref(args.collapsed)
      return { args, collapsed }
    },
    template: `
      <div style="display: flex; min-height: 100vh;">
        <div style="flex: 1; padding: 24px; background: #f9fafb;">
          <h1>Main Content</h1>
          <p>This layout demonstrates a right-positioned sidebar.</p>
          <p>The sidebar appears on the right side of the main content.</p>
        </div>
        
        <SidebarMenu v-bind="args" v-model:collapsed="collapsed" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sidebar positioned on the right side of the content area.',
      },
    },
  },
}

export const CustomContent: Story = {
  render: () => ({
    components: { SidebarMenu },
    setup() {
      const collapsed = ref(false)

      const menuItems = ref([
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'fas fa-tachometer-alt',
          route: '/dashboard',
          badge: null,
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: 'fas fa-calendar',
          route: '/calendar',
          badge: null,
        },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: 'fas fa-tasks',
          route: '/tasks',
          badge: '5',
        },
        {
          id: 'projects',
          label: 'Projects',
          icon: 'fas fa-folder',
          route: '/projects',
          children: [
            { id: 'active', label: 'Active Projects', route: '/projects/active' },
            { id: 'archived', label: 'Archived', route: '/projects/archived' },
          ],
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'fas fa-cog',
          route: '/settings',
        },
      ])

      return { collapsed, menuItems }
    },
    template: `
      <div style="display: flex; min-height: 100vh;">
        <SidebarMenu v-model:collapsed="collapsed">
          <!-- Custom Header -->
          <template #header>
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">
                V
              </div>
              <span v-if="!collapsed" style="font-weight: 600; color: #1f2937;">Vana Pro</span>
            </div>
            
            <button
              @click="collapsed = !collapsed"
              style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; border-radius: 6px; cursor: pointer; color: #6b7280;"
            >
              <i :class="collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
            </button>
          </template>
          
          <!-- Custom Menu -->
          <template #menu="{ collapsed: isCollapsed }">
            <!-- Main Navigation -->
            <div style="margin-bottom: 24px;">
              <h3 v-if="!isCollapsed" style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 8px; font-weight: 600;">
                Main
              </h3>
              
              <ul style="list-style: none; margin: 0; padding: 0;">
                <li v-for="item in menuItems.slice(0, 3)" :key="item.id" style="margin-bottom: 4px;">
                  <a 
                    :href="item.route"
                    style="display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 6px; color: #6b7280; text-decoration: none; transition: all 0.2s;"
                    @mouseover="$event.target.style.backgroundColor = '#f3f4f6'; $event.target.style.color = '#1f2937';"
                    @mouseout="$event.target.style.backgroundColor = 'transparent'; $event.target.style.color = '#6b7280';"
                  >
                    <i :class="item.icon" style="width: 16px; text-align: center;"></i>
                    <span v-if="!isCollapsed" style="flex: 1;">{{ item.label }}</span>
                    <span 
                      v-if="!isCollapsed && item.badge" 
                      style="background: #ef4444; color: white; font-size: 11px; padding: 2px 6px; border-radius: 12px; min-width: 18px; text-align: center;"
                    >
                      {{ item.badge }}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            
            <!-- Tools Section -->
            <div>
              <h3 v-if="!isCollapsed" style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 8px; font-weight: 600;">
                Tools
              </h3>
              
              <ul style="list-style: none; margin: 0; padding: 0;">
                <li v-for="item in menuItems.slice(3)" :key="item.id" style="margin-bottom: 4px;">
                  <a 
                    :href="item.route"
                    style="display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 6px; color: #6b7280; text-decoration: none; transition: all 0.2s;"
                    @mouseover="$event.target.style.backgroundColor = '#f3f4f6'; $event.target.style.color = '#1f2937';"
                    @mouseout="$event.target.style.backgroundColor = 'transparent'; $event.target.style.color = '#6b7280';"
                  >
                    <i :class="item.icon" style="width: 16px; text-align: center;"></i>
                    <span v-if="!isCollapsed" style="flex: 1;">{{ item.label }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </template>
          
          <!-- Custom Footer -->
          <template #footer="{ collapsed: isCollapsed }">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 6px; cursor: pointer; transition: background-color 0.2s;"
                 @mouseover="$event.target.style.backgroundColor = '#f3f4f6';"
                 @mouseout="$event.target.style.backgroundColor = 'transparent';"
            >
              <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">
                JD
              </div>
              
              <div v-if="!isCollapsed" style="flex: 1; min-width: 0;">
                <div style="font-weight: 500; color: #1f2937; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  Jane Doe
                </div>
                <div style="font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  jane.doe@vana.com
                </div>
              </div>
              
              <div v-if="!isCollapsed" style="color: #6b7280;">
                <i class="fas fa-cog" style="font-size: 14px;"></i>
              </div>
            </div>
          </template>
        </SidebarMenu>
        
        <div style="flex: 1; padding: 24px; background: #f9fafb;">
          <h1>Custom Sidebar Content</h1>
          <p>This example shows how to use the sidebar slots to create completely custom header, menu, and footer sections.</p>
          <p>The sidebar includes:</p>
          <ul>
            <li>Custom branded header with logo</li>
            <li>Grouped navigation with sections</li>
            <li>Badge indicators for notifications</li>
            <li>User profile in footer with avatar</li>
          </ul>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sidebar with completely custom content using header, menu, and footer slots.',
      },
    },
  },
}

export const ResponsiveBehavior: Story = {
  render: () => ({
    components: { SidebarMenu },
    setup() {
      const isMobileMenuOpen = ref(false)

      const toggleMobileMenu = () => {
        isMobileMenuOpen.value = !isMobileMenuOpen.value
      }

      return {
        isMobileMenuOpen,
        toggleMobileMenu,
      }
    },
    template: `
      <div>
        <!-- Mobile Header -->
        <header style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: white; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">
              V
            </div>
            <span style="font-weight: 600;">Vana</span>
          </div>
          
          <button 
            @click="toggleMobileMenu"
            style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: none; background: none; border-radius: 6px; cursor: pointer; color: #6b7280;"
          >
            <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
        </header>
        
        <!-- Sidebar with Overlay -->
        <SidebarMenu 
          :collapsed="false"
          :overlay="true"
          v-model:collapsed="!isMobileMenuOpen"
        />
        
        <!-- Main Content -->
        <div style="padding: 20px;">
          <h1>Mobile Responsive Sidebar</h1>
          <p>On mobile devices, the sidebar transforms into an overlay menu.</p>
          <p>Click the hamburger menu in the header to open/close the sidebar.</p>
          <p>The sidebar includes a backdrop overlay and proper focus management.</p>
          <p><strong>Menu State:</strong> {{ isMobileMenuOpen ? 'Open' : 'Closed' }}</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Responsive sidebar behavior on mobile devices with overlay mode and backdrop.',
      },
    },
  },
}

export const InteractiveDemo: Story = {
  render: () => ({
    components: { SidebarMenu },
    setup() {
      const sidebarConfig = ref({
        collapsed: false,
        position: 'left',
        width: 'medium',
        variant: 'default',
        showToggle: true,
        persistent: true,
        overlay: false,
      })

      const handleItemClick = (item: unknown, _event: MouseEvent) => {
        console.log('Item clicked:', item)
      }

      const resetDefaults = () => {
        sidebarConfig.value = {
          collapsed: false,
          position: 'left',
          width: 'medium',
          variant: 'default',
          showToggle: true,
          persistent: true,
          overlay: false,
        }
      }

      return {
        sidebarConfig,
        handleItemClick,
        resetDefaults,
      }
    },
    template: `
      <div style="display: flex; min-height: 100vh;">
        <SidebarMenu 
          v-bind="sidebarConfig"
          @item-click="handleItemClick"
        />
        
        <div style="flex: 1; padding: 24px; background: #f9fafb;">
          <h1>Interactive Sidebar Demo</h1>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
            <h2 style="margin: 0 0 16px 0;">Sidebar Configuration</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
              <div>
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">Position</label>
                <select v-model="sidebarConfig.position" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
              
              <div>
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">Width</label>
                <select v-model="sidebarConfig.width" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                  <option value="narrow">Narrow</option>
                  <option value="medium">Medium</option>
                  <option value="wide">Wide</option>
                </select>
              </div>
              
              <div>
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">Variant</label>
                <select v-model="sidebarConfig.variant" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                  <option value="default">Default</option>
                  <option value="minimal">Minimal</option>
                  <option value="bordered">Bordered</option>
                </select>
              </div>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" v-model="sidebarConfig.collapsed" />
                Collapsed
              </label>
              
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" v-model="sidebarConfig.showToggle" />
                Show Toggle
              </label>
              
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" v-model="sidebarConfig.persistent" />
                Persistent
              </label>
              
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" v-model="sidebarConfig.overlay" />
                Overlay Mode
              </label>
            </div>
            
            <button 
              @click="resetDefaults"
              style="margin-top: 16px; padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              Reset to Defaults
            </button>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <h2 style="margin: 0 0 16px 0;">Current Configuration</h2>
            <pre style="background: #f3f4f6; padding: 12px; border-radius: 4px; overflow-x: auto; font-family: monospace; font-size: 14px;">{{ JSON.stringify(sidebarConfig, null, 2) }}</pre>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo allowing you to test all sidebar configuration options and see the results in real-time.',
      },
    },
  },
}
