import type { Meta, StoryObj } from '@storybook/vue3'
import ArrowLeftIcon from './ArrowLeftIcon.vue'

const meta = {
  title: 'Icons/ArrowLeftIcon',
  component: ArrowLeftIcon,
  parameters: {
    docs: {
      description: {
        component: `
# Arrow Left Icon

A left-pointing arrow icon used for navigation, typically in back buttons and breadcrumbs.

## Usage

This icon is commonly used for:
- Back navigation buttons
- Previous/left navigation controls
- Breadcrumb navigation
- Mobile menu back actions

## Design

Based on Heroicons arrow-left design with:
- Clean, minimal stroke design
- Consistent weight (1.5px)
- Round line caps and joins
- Scalable SVG format

## Accessibility

- Uses currentColor for automatic theming
- Scales properly with font size
- Compatible with screen readers when used in buttons with proper labels
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // No props - icon inherits size and color from parent
  },
} satisfies Meta<typeof ArrowLeftIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default arrow left icon at standard size.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 12px; color: #6b7280;">
          <ArrowLeftIcon />
          <div>Small</div>
        </div>
        <div style="font-size: 16px; color: #374151;">
          <ArrowLeftIcon />
          <div>Medium</div>
        </div>
        <div style="font-size: 24px; color: #111827;">
          <ArrowLeftIcon />
          <div>Large</div>
        </div>
        <div style="font-size: 32px; color: #000;">
          <ArrowLeftIcon />
          <div>XL</div>
        </div>
      </div>
    `,
    components: { ArrowLeftIcon },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Arrow left icon in various sizes, inheriting size from font-size.',
      },
    },
  },
}

export const Colors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="color: #6366f1; font-size: 24px;">
          <ArrowLeftIcon />
          <div style="font-size: 12px;">Primary</div>
        </div>
        <div style="color: #10b981; font-size: 24px;">
          <ArrowLeftIcon />
          <div style="font-size: 12px;">Success</div>
        </div>
        <div style="color: #f59e0b; font-size: 24px;">
          <ArrowLeftIcon />
          <div style="font-size: 12px;">Warning</div>
        </div>
        <div style="color: #ef4444; font-size: 24px;">
          <ArrowLeftIcon />
          <div style="font-size: 12px;">Error</div>
        </div>
        <div style="color: #6b7280; font-size: 24px;">
          <ArrowLeftIcon />
          <div style="font-size: 12px;">Gray</div>
        </div>
      </div>
    `,
    components: { ArrowLeftIcon },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Arrow left icon with different color themes using currentColor.',
      },
    },
  },
}

export const InButton: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem;">
        <button style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white; color: #374151; cursor: pointer;">
          <ArrowLeftIcon />
          Back
        </button>
        <button style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #6366f1; color: white; cursor: pointer;">
          <ArrowLeftIcon />
          Previous
        </button>
        <button style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white; color: #6b7280; cursor: pointer;">
          <ArrowLeftIcon />
        </button>
      </div>
    `,
    components: { ArrowLeftIcon },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Arrow left icon used in various button styles and layouts.',
      },
    },
  },
}

export const NavigationContext: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;">
        <!-- Header with back button -->
        <header style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #e5e7eb;">
          <button style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: none; border-radius: 0.5rem; background: #f3f4f6; color: #6b7280; cursor: pointer;">
            <ArrowLeftIcon />
          </button>
          <h1 style="font-size: 20px; font-weight: 600; margin: 0;">Settings</h1>
        </header>
        
        <!-- Breadcrumb -->
        <nav style="display: flex; align-items: center; gap: 0.5rem; padding: 0 1rem; color: #6b7280; font-size: 14px;">
          <span>Home</span>
          <ArrowLeftIcon style="transform: rotate(180deg);" />
          <span>Account</span>
          <ArrowLeftIcon style="transform: rotate(180deg);" />
          <span style="color: #374151; font-weight: 500;">Settings</span>
        </nav>
      </div>
    `,
    components: { ArrowLeftIcon },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Arrow left icon in realistic navigation contexts including headers and breadcrumbs.',
      },
    },
  },
}