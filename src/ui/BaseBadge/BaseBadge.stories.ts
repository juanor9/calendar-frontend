import type { Meta, StoryObj } from '@storybook/vue3'
// Removed storybook/test import - not available
import BaseBadge from './BaseBadge.vue'

const meta = {
  title: 'UI/Components/Base Badge',
  component: BaseBadge,
  parameters: {
    docs: {
      description: {
        component: `
# Base Badge Component

A versatile badge component for displaying labels, status indicators, tags, and interactive elements following Vana's design system principles.

## Purpose

The BaseBadge component serves as a foundational element for:
- Status indicators (success, warning, error, info)
- Content tags and labels
- Notification counters and alerts
- User role badges
- Filter chips and removable tags
- Interactive elements with click handlers

## Usage Context

This component is commonly used in:
- Dashboards for status visualization
- Content management for categorization
- Navigation for notification badges
- Forms for validation states
- Lists for item metadata
- Filters for active selections

## Styling Methodology

Built using BEM methodology with SCSS variables from Vana's design system:
- Consistent spacing using \`$spacing-*\` tokens
- Color variants following \`$interactive-*\`, \`$success-*\`, \`$warning-*\`, \`$error-*\` palettes
- Typography using \`$font-family-ui\` and \`$font-weight-medium\`
- Border radius with \`$radius-md\` and \`$radius-pill\` options
- Smooth transitions with \`$transition-all\`

## Design System Integration

Fully integrated with Vana's design tokens:
- **Colors**: Primary, secondary, success, warning, error, info, neutral variants
- **Sizes**: Small (20px), medium (24px), large (32px) heights
- **States**: Default, hover, focus, disabled, pulse animation
- **Modifiers**: Outline, pill shape, removable, clickable, dot indicator
- **Accessibility**: ARIA support, keyboard navigation, screen reader compatibility

## Accessibility Notes

- Uses semantic \`aria-disabled\` for disabled states
- Provides \`aria-label\` for remove buttons
- Maintains focus management for interactive elements
- Supports keyboard navigation for clickable badges
- Uses \`aria-hidden\` for decorative elements like dots and icons
        `,
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-design-system-badges'
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
      description: 'Badge color variant based on Vana design system'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Badge size affecting padding and typography'
    },
    outline: {
      control: 'boolean',
      description: 'Show outline variant with transparent background'
    },
    pill: {
      control: 'boolean',
      description: 'Apply pill-shaped border radius'
    },
    removable: {
      control: 'boolean',
      description: 'Show remove button with click handler'
    },
    dot: {
      control: 'boolean',
      description: 'Show as small dot indicator without text content'
    },
    pulse: {
      control: 'boolean',
      description: 'Apply pulse animation for attention'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interaction and reduce opacity'
    },
    clickable: {
      control: 'boolean',
      description: 'Enable hover effects and click handler'
    }
  },
  args: {
    onClick: () => {},
    onRemove: () => {}
  }
} satisfies Meta<typeof BaseBadge>

export default meta
type Story = StoryObj<typeof meta>

// 1. Default Story
export const Default: Story = {
  args: {
    variant: 'neutral'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Default Badge</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default badge with neutral variant and medium size. This is the basic usage with minimal configuration.'
      }
    }
  }
}

// 2. Size Variants
export const Small: Story = {
  args: {
    size: 'small',
    variant: 'primary'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Small</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Small badge variant (20px height) ideal for compact interfaces and secondary information.'
      }
    }
  }
}

export const Medium: Story = {
  args: {
    size: 'medium',
    variant: 'primary'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Medium</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Medium badge variant (24px height) - the default size for most use cases.'
      }
    }
  }
}

export const Large: Story = {
  args: {
    size: 'large',
    variant: 'primary'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Large</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Large badge variant (32px height) for prominent displays and primary actions.'
      }
    }
  }
}

// 3. Color Variants
export const Primary: Story = {
  args: {
    variant: 'primary'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Primary</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Primary variant using brand colors for main actions and important information.'
      }
    }
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Secondary</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Secondary variant for supporting information and alternative actions.'
      }
    }
  }
}

export const Success: Story = {
  args: {
    variant: 'success'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Success</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Success variant for positive states, completed actions, and confirmations.'
      }
    }
  }
}

export const Warning: Story = {
  args: {
    variant: 'warning'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Warning</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Warning variant for cautionary information and pending states.'
      }
    }
  }
}

export const Error: Story = {
  args: {
    variant: 'error'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Error</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Error variant for error states, failures, and critical alerts.'
      }
    }
  }
}

export const Info: Story = {
  args: {
    variant: 'info'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Info</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Info variant for informational content and neutral notifications.'
      }
    }
  }
}

export const Neutral: Story = {
  args: {
    variant: 'neutral'
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Neutral</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Neutral variant for general purpose content and default states.'
      }
    }
  }
}

// 4. Modifier Variants
export const Outline: Story = {
  args: {
    variant: 'primary',
    outline: true
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Outline</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Outline variant with transparent background and colored border for subtle emphasis.'
      }
    }
  }
}

export const Pill: Story = {
  args: {
    variant: 'primary',
    pill: true
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Pill Shape</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pill-shaped variant with fully rounded corners for modern, soft appearance.'
      }
    }
  }
}

// 5. Interactive Variants
export const Removable: Story = {
  args: {
    variant: 'info',
    removable: true
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args" @remove="args.onRemove">Removable Tag</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Removable variant with close button for tags, filters, and dynamic content.'
      }
    }
  }
}

export const Clickable: Story = {
  args: {
    variant: 'secondary',
    clickable: true
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args" @click="args.onClick">Clickable Badge</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Clickable variant with hover effects and click handling for interactive elements.'
      }
    }
  }
}

// 6. Special States
export const WithDot: Story = {
  args: {
    variant: 'success',
    dot: true
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Dot indicator variant for status displays and compact notification badges.'
      }
    }
  }
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true
  },
  render: (args) => ({
    components: { BaseBadge },
    setup() {
      return { args }
    },
    template: '<BaseBadge v-bind="args">Disabled</BaseBadge>'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state with reduced opacity and no interaction capabilities.'
      }
    }
  }
}

// 7. Color Variants Showcase
export const ColorVariants: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <BaseBadge variant="primary">Primary</BaseBadge>
            <span style="font-size: 12px; color: #6b7280;">Brand Color</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <BaseBadge variant="secondary">Secondary</BaseBadge>
            <span style="font-size: 12px; color: #6b7280;">Alternative</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <BaseBadge variant="success">Success</BaseBadge>
            <span style="font-size: 12px; color: #6b7280;">Positive</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <BaseBadge variant="warning">Warning</BaseBadge>
            <span style="font-size: 12px; color: #6b7280;">Caution</span>
          </div>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <BaseBadge variant="error">Error</BaseBadge>
            <span style="font-size: 12px; color: #6b7280;">Critical</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <BaseBadge variant="info">Info</BaseBadge>
            <span style="font-size: 12px; color: #6b7280;">Information</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <BaseBadge variant="neutral">Neutral</BaseBadge>
            <span style="font-size: 12px; color: #6b7280;">Default</span>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of all color variants available in the Vana design system.'
      }
    }
  }
}

// 8. Size Comparison
export const SizeComparison: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <BaseBadge size="small" variant="primary">Small</BaseBadge>
          <span style="font-size: 12px; color: #6b7280;">20px height</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <BaseBadge size="medium" variant="primary">Medium</BaseBadge>
          <span style="font-size: 12px; color: #6b7280;">24px height</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <BaseBadge size="large" variant="primary">Large</BaseBadge>
          <span style="font-size: 12px; color: #6b7280;">32px height</span>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Size comparison showing all three available sizes with their respective heights.'
      }
    }
  }
}

// 9. Interactive Behaviors
export const InteractiveBehaviors: Story = {
  render: () => ({
    components: { BaseBadge },
    setup() {
      const handleClick = (type: string) => {
        alert(`${type} badge clicked!`)
      }
      const handleRemove = (type: string) => {
        alert(`${type} badge removed!`)
      }
      return { handleClick, handleRemove }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <BaseBadge 
            variant="primary" 
            clickable 
            @click="handleClick('Clickable')"
          >
            Clickable Badge
          </BaseBadge>
          <BaseBadge 
            variant="warning" 
            removable 
            @remove="handleRemove('Removable')"
          >
            Removable Tag
          </BaseBadge>
          <BaseBadge 
            variant="success" 
            clickable 
            removable 
            @click="handleClick('Interactive')"
            @remove="handleRemove('Interactive')"
          >
            Click or Remove
          </BaseBadge>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <BaseBadge variant="error" pulse>Pulsing Alert</BaseBadge>
          <BaseBadge variant="info" dot size="small" />
          <BaseBadge variant="success" dot />
          <BaseBadge variant="warning" dot size="large" />
          <span style="font-size: 14px; color: #6b7280;">Dot indicators</span>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive badge behaviors including clickable, removable, pulsing, and dot variants.'
      }
    }
  }
}

// 10. With Animations
export const WithAnimations: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <BaseBadge variant="error" pulse>Urgent</BaseBadge>
          <span style="font-size: 12px; color: #6b7280;">Pulse Animation</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <BaseBadge variant="warning" pulse pill>Alert</BaseBadge>
          <span style="font-size: 12px; color: #6b7280;">Pulse + Pill</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <BaseBadge variant="info" pulse dot size="large" />
          <span style="font-size: 12px; color: #6b7280;">Pulsing Dot</span>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Animation variants using pulse effect for attention-grabbing elements.'
      }
    }
  }
}

// 11. Outline Variants
export const OutlineVariants: Story = {
  render: () => ({
    components: { BaseBadge },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <BaseBadge variant="primary" outline>Primary</BaseBadge>
          <BaseBadge variant="secondary" outline>Secondary</BaseBadge>
          <BaseBadge variant="success" outline>Success</BaseBadge>
          <BaseBadge variant="warning" outline>Warning</BaseBadge>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <BaseBadge variant="error" outline>Error</BaseBadge>
          <BaseBadge variant="info" outline>Info</BaseBadge>
          <BaseBadge variant="neutral" outline>Neutral</BaseBadge>
        </div>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <BaseBadge variant="primary" outline pill>Pill Outline</BaseBadge>
          <BaseBadge variant="success" outline removable>Removable Outline</BaseBadge>
          <BaseBadge variant="warning" outline dot />
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Outline variants for all colors with subtle styling and transparent backgrounds.'
      }
    }
  }
}

// 12. InContext - Real Usage Examples
export const InContext: Story = {
  render: () => ({
    components: { BaseBadge },
    setup() {
      const removeTag = (tag: string) => {
        console.log(`Removed tag: ${tag}`)
      }
      const viewDetails = (item: string) => {
        console.log(`View details for: ${item}`)
      }
      return { removeTag, viewDetails }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 800px;">
        
        <!-- Dashboard Status Indicators -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Dashboard Status Indicators</h3>
          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <BaseBadge variant="success" dot size="small" />
              <span>System Online</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <BaseBadge variant="warning" dot size="small" />
              <span>Maintenance Mode</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <BaseBadge variant="error" dot size="small" pulse />
              <span>Service Down</span>
            </div>
            <BaseBadge variant="info" size="small">5 Updates</BaseBadge>
          </div>
        </div>

        <!-- Content Management Tags -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Content Tags</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <BaseBadge variant="primary" pill removable @remove="removeTag('React')">React</BaseBadge>
            <BaseBadge variant="secondary" pill removable @remove="removeTag('Vue')">Vue</BaseBadge>
            <BaseBadge variant="info" pill removable @remove="removeTag('TypeScript')">TypeScript</BaseBadge>
            <BaseBadge variant="neutral" pill removable @remove="removeTag('JavaScript')">JavaScript</BaseBadge>
            <BaseBadge variant="success" pill removable @remove="removeTag('CSS')">CSS</BaseBadge>
          </div>
        </div>

        <!-- Notification Counters -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Notification Badges</h3>
          <div style="display: flex; gap: 16px; align-items: center;">
            <div style="position: relative; display: inline-block;">
              <div style="width: 40px; height: 40px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📧</div>
              <BaseBadge 
                variant="error" 
                size="small" 
                style="position: absolute; top: -6px; right: -6px; min-width: 20px; height: 20px; border-radius: 50%;"
              >3</BaseBadge>
            </div>
            <div style="position: relative; display: inline-block;">
              <div style="width: 40px; height: 40px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">🔔</div>
              <BaseBadge 
                variant="warning" 
                size="small"
                style="position: absolute; top: -6px; right: -6px; min-width: 20px; height: 20px; border-radius: 50%;"
              >12</BaseBadge>
            </div>
            <div style="position: relative; display: inline-block;">
              <div style="width: 40px; height: 40px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">💬</div>
              <BaseBadge 
                variant="primary" 
                size="small"
                style="position: absolute; top: -6px; right: -6px; min-width: 20px; height: 20px; border-radius: 50%;"
              >99+</BaseBadge>
            </div>
          </div>
        </div>

        <!-- Filter Chips -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Active Filters</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <BaseBadge variant="primary" outline clickable @click="viewDetails('Category')">Category: Design</BaseBadge>
            <BaseBadge variant="success" outline clickable @click="viewDetails('Status')">Status: Published</BaseBadge>
            <BaseBadge variant="info" outline removable @remove="removeTag('Author')">Author: John Doe</BaseBadge>
            <BaseBadge variant="neutral" outline removable @remove="removeTag('Date')">Last 30 days</BaseBadge>
            <span style="color: #6b7280; font-size: 14px;">4 filters active</span>
          </div>
        </div>

        <!-- User Role Badges -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">User Management</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; justify-content: space-between; padding: 8px 0;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">JD</div>
                <span>John Doe</span>
              </div>
              <div style="display: flex; gap: 8px; align-items: center;">
                <BaseBadge variant="primary" size="small">Admin</BaseBadge>
                <BaseBadge variant="success" size="small" dot />
                <span style="font-size: 12px; color: #6b7280;">Online</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; justify-content: space-between; padding: 8px 0;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">AS</div>
                <span>Alice Smith</span>
              </div>
              <div style="display: flex; gap: 8px; align-items: center;">
                <BaseBadge variant="secondary" size="small">Editor</BaseBadge>
                <BaseBadge variant="neutral" size="small" dot />
                <span style="font-size: 12px; color: #6b7280;">Away</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; justify-content: space-between; padding: 8px 0;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">MB</div>
                <span>Mike Brown</span>
              </div>
              <div style="display: flex; gap: 8px; align-items: center;">
                <BaseBadge variant="neutral" size="small" outline>Viewer</BaseBadge>
                <BaseBadge variant="error" size="small" dot />
                <span style="font-size: 12px; color: #6b7280;">Offline</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Status in Project Management -->
        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Project Tasks</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 6px;">
              <input type="checkbox" checked style="margin: 0;" />
              <span style="flex: 1;">Design system documentation</span>
              <BaseBadge variant="success" size="small">Completed</BaseBadge>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 6px;">
              <input type="checkbox" style="margin: 0;" />
              <span style="flex: 1;">Component testing</span>
              <BaseBadge variant="warning" size="small">In Progress</BaseBadge>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 6px;">
              <input type="checkbox" style="margin: 0;" />
              <span style="flex: 1;">Performance optimization</span>
              <BaseBadge variant="error" size="small" pulse>Urgent</BaseBadge>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 6px;">
              <input type="checkbox" style="margin: 0;" />
              <span style="flex: 1;">Code review</span>
              <BaseBadge variant="neutral" size="small" outline>Pending</BaseBadge>
            </div>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples showing badges in context: status indicators, content tags, notification counters, filter chips, user role badges, and task management interfaces.'
      }
    }
  }
}