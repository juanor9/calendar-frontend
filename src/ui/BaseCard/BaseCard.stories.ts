import type { Meta, StoryObj } from '@storybook/vue3'
// Removed storybook/test import - not available
// Vue imports removed - not needed for static stories
import BaseCard from './BaseCard.vue'

const meta = {
  title: 'UI/Components/Base Card',
  component: BaseCard,
  parameters: {
    docs: {
      description: {
        component: `
# Base Card Component

A versatile card container component for organizing content, displaying information, and creating structured layouts following Vana's design system principles.

## Purpose

The BaseCard component serves as a foundational layout element for:
- Content organization and information grouping
- Dashboard widgets and data displays
- List items and content cards
- Interactive containers and clickable elements
- Form sections and input groupings
- Project cards and task items with actions

## Usage Context

This component is commonly used in:
- Dashboard interfaces for metrics and widgets
- Content management systems for article/item cards
- Project management for task and project displays
- User interfaces for profile cards and information panels
- E-commerce for product cards and feature highlights
- Navigation for menu items and category cards

## Styling Methodology

Built using BEM methodology with SCSS variables from Vana's design system:
- Consistent spacing using \`$spacing-*\` tokens for balanced layouts
- Color variants following \`$background-*\`, \`$border-*\`, and \`$shadow-*\` palettes
- Typography using \`$font-family-ui\` with proper hierarchy and readability
- Border radius with \`$radius-md\` for modern, professional appearance
- Smooth transitions with \`$transition-all\` for polished interactions
- Interactive states with hover, focus, and active feedback

## Design System Integration

Fully integrated with Vana's design tokens:
- **Variants**: Default (subtle background), elevated (shadow), outlined (border), ghost (transparent)
- **Padding**: None, small (8px), medium (16px), large (24px) for flexible content spacing
- **States**: Default, clickable (interactive), loading (async operations), disabled
- **Semantic**: Support for div, article, section elements based on content type
- **Slots**: Header, default content, footer, and actions for structured layouts
- **Accessibility**: ARIA attributes for screen readers and keyboard navigation

## Accessibility Notes

- Uses semantic HTML elements (div, article, section) based on content context
- Provides comprehensive ARIA support with \`role="button"\` for clickable cards
- Maintains proper focus management with tabindex and keyboard navigation
- Supports screen reader compatibility with \`aria-disabled\` and \`aria-busy\` states
- Loading state announcements with visible spinner and screen reader text
- Proper heading hierarchy within card headers for document structure
        `,
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-design-system-cards'
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'ghost'],
      description: 'Card visual variant affecting background, border, and shadow styling'
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Internal padding amount for content spacing'
    },
    clickable: {
      control: 'boolean',
      description: 'Enable interactive behavior with hover effects and click handling'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interactions and reduce visual prominence'
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner overlay during async operations'
    },
    as: {
      control: 'select',
      options: ['div', 'article', 'section'],
      description: 'HTML semantic element type for proper document structure'
    }
  },
  args: {
    onClick: () => {},
    onFocus: () => {},
    onBlur: () => {}
  }
} satisfies Meta<typeof BaseCard>

export default meta
type Story = StoryObj<typeof meta>

// 1. Default Story
export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'medium'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <p>This is a default card with medium padding and subtle background styling.</p>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default card with subtle background and medium padding. This is the basic usage with minimal configuration for general content display.'
      }
    }
  }
}

// 2. Variant Stories
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'medium'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <p>Elevated card with shadow for prominence and visual hierarchy.</p>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Elevated variant with shadow styling for prominence and visual separation from background content.'
      }
    }
  }
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    padding: 'medium'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <p>Outlined card with border for clean definition and minimal styling.</p>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Outlined variant with border styling for clean definition without background or shadow.'
      }
    }
  }
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    padding: 'medium'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <p>Ghost card with transparent background for minimal visual impact.</p>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Ghost variant with transparent background for minimal visual impact and content-first approach.'
      }
    }
  }
}

// 3. Padding Variants
export const PaddingNone: Story = {
  args: {
    variant: 'outlined',
    padding: 'none'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <div style="padding: 12px; background: #f3f4f6; border-radius: 4px; margin: -1px;">
          No internal padding - useful for full-width content like images or custom layouts.
        </div>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'No padding variant for full-width content like images, charts, or custom layouts that manage their own spacing.'
      }
    }
  }
}

export const PaddingSmall: Story = {
  args: {
    variant: 'elevated',
    padding: 'small'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <p style="margin: 0;">Small padding (8px) for compact content and tight layouts.</p>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Small padding (8px) for compact interfaces and space-efficient layouts.'
      }
    }
  }
}

export const PaddingLarge: Story = {
  args: {
    variant: 'elevated',
    padding: 'large'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <p style="margin: 0;">Large padding (24px) for spacious layouts and prominent content display.</p>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Large padding (24px) for spacious layouts and prominent content that needs breathing room.'
      }
    }
  }
}

// 4. WithHeader and WithFooter
export const WithHeader: Story = {
  args: {
    variant: 'elevated',
    padding: 'medium'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <template #header>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">Dashboard Overview</h3>
        </template>
        <p style="margin: 0 0 12px;">Your calendar activity and upcoming events.</p>
        <p style="margin: 0; color: #6b7280;">Last updated: 2 minutes ago</p>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Card with header slot containing title and heading elements with proper semantic structure.'
      }
    }
  }
}

export const WithFooter: Story = {
  args: {
    variant: 'outlined',
    padding: 'medium'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <h4 style="margin: 0 0 12px;">Meeting Summary</h4>
        <p style="margin: 0 0 12px;">Team standup completed with 5 participants.</p>
        <template #footer>
          <small style="color: #6b7280;">Meeting ended at 10:30 AM</small>
        </template>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Card with footer slot for metadata, timestamps, and supplementary information.'
      }
    }
  }
}

export const WithActions: Story = {
  args: {
    variant: 'elevated',
    padding: 'medium'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      const handleEdit = () => {
        console.log('Edit clicked')
      }
      const handleDelete = () => {
        console.log('Delete clicked')
      }
      return { args, handleEdit, handleDelete }
    },
    template: `
      <BaseCard v-bind="args">
        <h4 style="margin: 0 0 12px;">Project Alpha</h4>
        <p style="margin: 0 0 12px;">Design system implementation and component library development.</p>
        <template #actions>
          <button @click="handleEdit" style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer;">Edit</button>
          <button @click="handleDelete" style="padding: 6px 12px; border: 1px solid #ef4444; border-radius: 4px; background: white; color: #ef4444; cursor: pointer;">Delete</button>
        </template>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Card with actions slot for buttons, links, and interactive elements aligned to the right.'
      }
    }
  }
}

// 5. Interactive and Clickable
export const Interactive: Story = {
  args: {
    variant: 'outlined',
    padding: 'medium',
    clickable: true
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      const handleClick = () => {
        alert('Card clicked! This could navigate to a detail page or expand content.')
      }
      return { args, handleClick }
    },
    template: `
      <BaseCard v-bind="args" @click="handleClick">
        <h4 style="margin: 0 0 8px;">Interactive Card</h4>
        <p style="margin: 0; color: #6b7280;">Click this card to see hover effects and interaction behavior.</p>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive card with click handling, hover effects, and keyboard navigation support.'
      }
    }
  }
}

export const Clickable: Story = {
  args: {
    variant: 'ghost',
    padding: 'medium',
    clickable: true
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      const handleClick = () => {
        console.log('Navigation triggered')
      }
      return { args, handleClick }
    },
    template: `
      <BaseCard v-bind="args" @click="handleClick">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; background: #6366f1; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">📅</div>
          <div>
            <h4 style="margin: 0 0 4px;">Calendar Settings</h4>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Manage your calendar preferences</p>
          </div>
          <div style="margin-left: auto; color: #9ca3af;">→</div>
        </div>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Clickable navigation card with subtle hover effects and directional indicator.'
      }
    }
  }
}

// 6. Loading and Disabled States
export const Loading: Story = {
  args: {
    variant: 'elevated',
    padding: 'medium',
    loading: true
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <h4 style="margin: 0 0 12px;">Dashboard Metrics</h4>
        <p style="margin: 0;">Loading analytics data and performance metrics...</p>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Loading state with spinner overlay for async operations and data fetching scenarios.'
      }
    }
  }
}

export const Disabled: Story = {
  args: {
    variant: 'outlined',
    padding: 'medium',
    disabled: true
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      return { args }
    },
    template: `
      <BaseCard v-bind="args">
        <h4 style="margin: 0 0 12px;">Premium Feature</h4>
        <p style="margin: 0;">This feature is available with a premium subscription.</p>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state with reduced opacity for unavailable or locked content.'
      }
    }
  }
}

// 7. Complete Card Example
export const CompleteExample: Story = {
  args: {
    variant: 'elevated',
    padding: 'medium',
    as: 'article'
  },
  render: (args) => ({
    components: { BaseCard },
    setup() {
      const handleView = () => {
        console.log('View details clicked')
      }
      const handleEdit = () => {
        console.log('Edit clicked')
      }
      return { args, handleView, handleEdit }
    },
    template: `
      <BaseCard v-bind="args">
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="margin: 0 0 4px; font-size: 18px; font-weight: 600;">Weekly Team Meeting</h3>
              <div style="display: flex; align-items: center; gap: 12px; font-size: 14px; color: #6b7280;">
                <span>🗓 Every Monday</span>
                <span>⏰ 10:00 AM - 11:00 AM</span>
              </div>
            </div>
            <span style="padding: 4px 8px; background: #dcfce7; color: #166534; border-radius: 12px; font-size: 12px; font-weight: 500;">Active</span>
          </div>
        </template>
        <div style="margin: 16px 0;">
          <p style="margin: 0 0 12px; color: #374151;">Regular team standup to discuss progress, blockers, and upcoming priorities.</p>
          <div style="display: flex; gap: 16px; font-size: 14px; color: #6b7280;">
            <span><strong>5</strong> participants</span>
            <span><strong>Conference Room A</strong></span>
            <span><strong>Zoom</strong> backup</span>
          </div>
        </div>
        <template #footer>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; color: #9ca3af;">Last updated 2 hours ago</span>
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; background: #10b981; border-radius: 50%;"></span>
              <span style="font-size: 12px; color: #6b7280;">Next: Tomorrow 10:00 AM</span>
            </div>
          </div>
        </template>
        <template #actions>
          <button @click="handleView" style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer; font-size: 14px;">View Details</button>
          <button @click="handleEdit" style="padding: 6px 12px; border: 1px solid #6366f1; border-radius: 4px; background: #6366f1; color: white; cursor: pointer; font-size: 14px;">Edit</button>
        </template>
      </BaseCard>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete card example with header, content, footer, and actions showcasing real-world meeting card usage.'
      }
    }
  }
}

// 8. Variant Showcase
export const VariantShowcase: Story = {
  render: () => ({
    components: { BaseCard },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <BaseCard variant="default" padding="medium">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <h4 style="margin: 0; font-size: 14px;">Default</h4>
                <span style="font-size: 12px; color: #6b7280;">Subtle background</span>
              </div>
            </BaseCard>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <BaseCard variant="elevated" padding="medium">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <h4 style="margin: 0; font-size: 14px;">Elevated</h4>
                <span style="font-size: 12px; color: #6b7280;">Shadow depth</span>
              </div>
            </BaseCard>
          </div>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <BaseCard variant="outlined" padding="medium">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <h4 style="margin: 0; font-size: 14px;">Outlined</h4>
                <span style="font-size: 12px; color: #6b7280;">Clean borders</span>
              </div>
            </BaseCard>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <BaseCard variant="ghost" padding="medium">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <h4 style="margin: 0; font-size: 14px;">Ghost</h4>
                <span style="font-size: 12px; color: #6b7280;">Transparent</span>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all four card variants with their distinct visual characteristics and use cases.'
      }
    }
  }
}

// 9. Padding Comparison
export const PaddingComparison: Story = {
  render: () => ({
    components: { BaseCard },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1;">
            <BaseCard variant="outlined" padding="none">
              <div style="padding: 12px; background: #f8fafc; border-radius: 4px; margin: -1px; text-align: center;">
                <h4 style="margin: 0 0 4px; font-size: 14px;">No Padding</h4>
                <span style="font-size: 12px; color: #6b7280;">Custom content spacing</span>
              </div>
            </BaseCard>
          </div>
          <div style="flex: 1;">
            <BaseCard variant="outlined" padding="small">
              <div style="text-align: center;">
                <h4 style="margin: 0 0 4px; font-size: 14px;">Small</h4>
                <span style="font-size: 12px; color: #6b7280;">8px padding</span>
              </div>
            </BaseCard>
          </div>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1;">
            <BaseCard variant="outlined" padding="medium">
              <div style="text-align: center;">
                <h4 style="margin: 0 0 4px; font-size: 14px;">Medium</h4>
                <span style="font-size: 12px; color: #6b7280;">16px padding (default)</span>
              </div>
            </BaseCard>
          </div>
          <div style="flex: 1;">
            <BaseCard variant="outlined" padding="large">
              <div style="text-align: center;">
                <h4 style="margin: 0 0 4px; font-size: 14px;">Large</h4>
                <span style="font-size: 12px; color: #6b7280;">24px padding</span>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Padding comparison showing all four padding options and their appropriate use cases.'
      }
    }
  }
}

// 10. InContext - Real Usage Examples
export const InContext: Story = {
  render: () => ({
    components: { BaseCard },
    setup() {
      const handleCardClick = (title: string) => {
        console.log(`${title} card clicked`)
      }
      const handleAction = (action: string, item: string) => {
        console.log(`${action} ${item}`)
      }
      
      return { handleCardClick, handleAction }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1000px;">
        
        <!-- Dashboard Widgets -->
        <div>
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">📊 Dashboard Widgets</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            <BaseCard variant="elevated" padding="medium">
              <template #header>
                <h4 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">Today's Meetings</h4>
              </template>
              <div style="text-align: center; padding: 16px 0;">
                <div style="font-size: 32px; font-weight: 700; color: #6366f1; margin-bottom: 4px;">7</div>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">3 completed, 4 upcoming</p>
              </div>
              <template #footer>
                <span style="font-size: 12px; color: #10b981;">↗ 12% vs yesterday</span>
              </template>
            </BaseCard>
            
            <BaseCard variant="elevated" padding="medium">
              <template #header>
                <h4 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">Focus Time</h4>
              </template>
              <div style="text-align: center; padding: 16px 0;">
                <div style="font-size: 32px; font-weight: 700; color: #059669; margin-bottom: 4px;">4h</div>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Deep work sessions</p>
              </div>
              <template #footer>
                <span style="font-size: 12px; color: #6b7280;">Next: 2:00 PM - 4:00 PM</span>
              </template>
            </BaseCard>
            
            <BaseCard variant="elevated" padding="medium">
              <template #header>
                <h4 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">Productivity</h4>
              </template>
              <div style="text-align: center; padding: 16px 0;">
                <div style="font-size: 32px; font-weight: 700; color: #dc2626; margin-bottom: 4px;">85%</div>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Goal completion rate</p>
              </div>
              <template #footer>
                <span style="font-size: 12px; color: #dc2626;">↘ 5% vs last week</span>
              </template>
            </BaseCard>
          </div>
        </div>

        <!-- Project Management Cards -->
        <div>
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">📋 Project Cards</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <BaseCard variant="outlined" padding="medium" clickable @click="handleCardClick('Design System')">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 18px;">DS</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 4px; font-size: 16px; font-weight: 600;">Design System v2.0</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Component library and documentation updates</p>
                </div>
                <div style="text-align: right;">
                  <span style="padding: 4px 8px; background: #fef3c7; color: #d97706; border-radius: 12px; font-size: 12px; font-weight: 500;">In Progress</span>
                  <div style="margin-top: 4px; font-size: 12px; color: #6b7280;">Due: Dec 15</div>
                </div>
              </div>
            </BaseCard>
            
            <BaseCard variant="outlined" padding="medium" clickable @click="handleCardClick('Mobile App')">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 18px;">📱</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 4px; font-size: 16px; font-weight: 600;">Mobile App Redesign</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">iOS and Android interface improvements</p>
                </div>
                <div style="text-align: right;">
                  <span style="padding: 4px 8px; background: #dcfce7; color: #166534; border-radius: 12px; font-size: 12px; font-weight: 500;">Completed</span>
                  <div style="margin-top: 4px; font-size: 12px; color: #6b7280;">Finished: Nov 28</div>
                </div>
              </div>
            </BaseCard>
            
            <BaseCard variant="outlined" padding="medium" clickable @click="handleCardClick('User Research')">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 18px;">🔍</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 4px; font-size: 16px; font-weight: 600;">User Research Study</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Calendar usage patterns and pain points</p>
                </div>
                <div style="text-align: right;">
                  <span style="padding: 4px 8px; background: #fee2e2; color: #dc2626; border-radius: 12px; font-size: 12px; font-weight: 500;">Planning</span>
                  <div style="margin-top: 4px; font-size: 12px; color: #6b7280;">Starts: Jan 10</div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- Content Cards List -->
        <div>
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">📄 Content Management</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
            <BaseCard variant="elevated" padding="medium" as="article">
              <template #header>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Getting Started Guide</h4>
                  <span style="padding: 2px 6px; background: #dbeafe; color: #1e40af; border-radius: 8px; font-size: 10px; font-weight: 500;">PUBLISHED</span>
                </div>
              </template>
              <p style="margin: 0 0 12px; color: #374151; font-size: 14px; line-height: 1.5;">Complete tutorial for new users to set up their calendar and configure preferences.</p>
              <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                <span style="padding: 2px 6px; background: #f3f4f6; color: #374151; border-radius: 8px; font-size: 11px;">Tutorial</span>
                <span style="padding: 2px 6px; background: #f3f4f6; color: #374151; border-radius: 8px; font-size: 11px;">Onboarding</span>
              </div>
              <template #footer>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 12px; color: #9ca3af;">Updated 3 days ago</span>
                  <span style="font-size: 12px; color: #6b7280;">1,234 views</span>
                </div>
              </template>
              <template #actions>
                <button @click="handleAction('edit', 'guide')" style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer; font-size: 12px;">Edit</button>
                <button @click="handleAction('view', 'guide')" style="padding: 4px 8px; border: 1px solid #6366f1; border-radius: 4px; background: #6366f1; color: white; cursor: pointer; font-size: 12px;">View</button>
              </template>
            </BaseCard>
            
            <BaseCard variant="elevated" padding="medium" as="article">
              <template #header>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <h4 style="margin: 0; font-size: 16px; font-weight: 600;">API Documentation</h4>
                  <span style="padding: 2px 6px; background: #fef3c7; color: #d97706; border-radius: 8px; font-size: 10px; font-weight: 500;">DRAFT</span>
                </div>
              </template>
              <p style="margin: 0 0 12px; color: #374151; font-size: 14px; line-height: 1.5;">Comprehensive API reference for developers integrating with Vana's calendar system.</p>
              <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                <span style="padding: 2px 6px; background: #f3f4f6; color: #374151; border-radius: 8px; font-size: 11px;">API</span>
                <span style="padding: 2px 6px; background: #f3f4f6; color: #374151; border-radius: 8px; font-size: 11px;">Developer</span>
              </div>
              <template #footer>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 12px; color: #9ca3af;">Draft saved 1 hour ago</span>
                  <span style="font-size: 12px; color: #6b7280;">Ready for review</span>
                </div>
              </template>
              <template #actions>
                <button @click="handleAction('continue', 'documentation')" style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer; font-size: 12px;">Continue</button>
                <button @click="handleAction('publish', 'documentation')" style="padding: 4px 8px; border: 1px solid #059669; border-radius: 4px; background: #059669; color: white; cursor: pointer; font-size: 12px;">Publish</button>
              </template>
            </BaseCard>
          </div>
        </div>

        <!-- User Profile Cards -->
        <div>
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">👥 Team Members</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <BaseCard variant="ghost" padding="medium" clickable @click="handleCardClick('Sarah')">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #ec4899, #be185d); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 18px;">SJ</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 4px; font-size: 16px; font-weight: 600;">Sarah Johnson</h4>
                  <p style="margin: 0 0 4px; color: #6b7280; font-size: 14px;">Product Designer</p>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
                    <span style="font-size: 12px; color: #10b981; font-weight: 500;">Available</span>
                  </div>
                </div>
                <div style="font-size: 12px; color: #9ca3af;">→</div>
              </div>
            </BaseCard>
            
            <BaseCard variant="ghost" padding="medium" clickable @click="handleCardClick('Mike')">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 18px;">MC</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 4px; font-size: 16px; font-weight: 600;">Mike Chen</h4>
                  <p style="margin: 0 0 4px; color: #6b7280; font-size: 14px;">Frontend Developer</p>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%;"></div>
                    <span style="font-size: 12px; color: #f59e0b; font-weight: 500;">In Meeting</span>
                  </div>
                </div>
                <div style="font-size: 12px; color: #9ca3af;">→</div>
              </div>
            </BaseCard>
            
            <BaseCard variant="ghost" padding="medium" clickable @click="handleCardClick('Emma')">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #047857); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 18px;">ET</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 4px; font-size: 16px; font-weight: 600;">Emma Thompson</h4>
                  <p style="margin: 0 0 4px; color: #6b7280; font-size: 14px;">Project Manager</p>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; background: #6b7280; border-radius: 50%;"></div>
                    <span style="font-size: 12px; color: #6b7280; font-weight: 500;">Offline</span>
                  </div>
                </div>
                <div style="font-size: 12px; color: #9ca3af;">→</div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- Settings Cards -->
        <div>
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">⚙️ Settings & Preferences</h3>
          <div style="display: flex; flex-direction: column; gap: 8px; max-width: 500px;">
            <BaseCard variant="ghost" padding="medium" clickable @click="handleCardClick('Notifications')">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 36px; height: 36px; background: #fef3c7; border-radius: 8px; display: flex; align-items: center; justify-content: center;">🔔</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 2px; font-size: 14px; font-weight: 600;">Notification Settings</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">Manage email and push notifications</p>
                </div>
                <div style="color: #9ca3af; font-size: 18px;">›</div>
              </div>
            </BaseCard>
            
            <BaseCard variant="ghost" padding="medium" clickable @click="handleCardClick('Privacy')">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 36px; height: 36px; background: #dbeafe; border-radius: 8px; display: flex; align-items: center; justify-content: center;">🔒</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 2px; font-size: 14px; font-weight: 600;">Privacy & Security</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">Control your data and access permissions</p>
                </div>
                <div style="color: #9ca3af; font-size: 18px;">›</div>
              </div>
            </BaseCard>
            
            <BaseCard variant="ghost" padding="medium" clickable @click="handleCardClick('Calendar')">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 36px; height: 36px; background: #f3e8ff; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📅</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 2px; font-size: 14px; font-weight: 600;">Calendar Preferences</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">Time zones, working hours, and display options</p>
                </div>
                <div style="color: #9ca3af; font-size: 18px;">›</div>
              </div>
            </BaseCard>
          </div>
        </div>

      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples showing BaseCard in authentic contexts: dashboard widgets, project management, content lists, user profiles, and settings interfaces with proper semantic structure and interactive behaviors.'
      }
    }
  }
}