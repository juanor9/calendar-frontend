import type { Meta, StoryObj } from '@storybook/vue3'
// Removed storybook/test import - not available
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

const meta = {
  title: 'UI/Components/Base Modal',
  component: BaseModal,
  parameters: {
    docs: {
      description: {
        component: `
# Base Modal Component

A comprehensive modal dialog component for overlaying content, forms, confirmations, and interactive experiences following Vana's design system principles.

## Purpose

The BaseModal component serves as a foundational overlay element for:
- Form dialogs and data entry interfaces
- Confirmation dialogs and user decisions  
- Content display and media galleries
- Alert messages and system notifications
- Settings panels and configuration interfaces
- Multi-step workflows and onboarding flows

## Usage Context

This component is commonly used in:
- Form interfaces for user input and data collection
- Confirmation flows for destructive or critical actions
- Content management for image galleries and media viewers
- Dashboard interfaces for settings and preference panels
- Authentication workflows for login and registration
- Onboarding sequences and feature introductions

## Styling Methodology

Built using BEM methodology with SCSS variables from Vana's design system:
- Consistent spacing using \`$spacing-*\` tokens for balanced layouts
- Modal sizes using \`$modal-*\` breakpoints (small: 400px, medium: 600px, large: 900px)
- Color variants following \`$background-*\`, \`$border-*\`, and \`$shadow-*\` palettes  
- Typography using \`$font-family-primary\` with proper hierarchy and readability
- Border radius with \`$radius-lg\` for modern, professional appearance
- Smooth transitions with \`$transition-*\` tokens for polished animations
- Backdrop blur effects and overlay styling for focus enhancement

## Design System Integration

Fully integrated with Vana's modal-specific design tokens:
- **Sizes**: Small (400px), medium (600px), large (900px), fullscreen (viewport) with responsive behavior
- **States**: Default, loading (async operations), scrollable (overflow content), centered positioning
- **Variants**: Default modal, confirmation dialog, alert dialog, form modal, media modal
- **Backdrop**: Configurable backdrop interaction, escape key handling, focus management
- **Animations**: Fade in/out with scale and translate effects following Material Design principles
- **Accessibility**: Full ARIA support, focus trapping, screen reader compatibility, keyboard navigation

## Accessibility Notes

- Uses semantic \`role="dialog"\` with \`aria-modal="true"\` for screen reader compatibility
- Provides comprehensive ARIA support with \`aria-labelledby\`, \`aria-describedby\` relationships
- Maintains proper focus management with focus trapping and restoration
- Supports keyboard navigation with Tab cycling and Escape key handling
- Loading state announcements with \`aria-busy\` and screen reader live regions
- Backdrop click and keyboard interactions with configurable behavior
- Proper heading hierarchy within modal headers for document structure
        `,
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-design-system-modals'
    }
  },
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Controls modal visibility state - true shows modal, false hides it'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'fullscreen'],
      description: 'Modal size affecting width and height constraints'
    },
    centered: {
      control: 'boolean',
      description: 'Center modal vertically in viewport'
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: 'Allow closing modal by clicking backdrop overlay'
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Allow closing modal with Escape key press'
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Display close button (×) in modal header'
    },
    preventClose: {
      control: 'boolean',
      description: 'Prevent modal from closing via backdrop or escape key'
    },
    persistent: {
      control: 'boolean',
      description: 'Keep modal mounted in DOM when closed (performance optimization)'
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner overlay during async operations'
    },
    title: {
      control: 'text',
      description: 'Modal title displayed in header with proper semantic structure'
    },
    subtitle: {
      control: 'text',
      description: 'Modal subtitle for additional context and description'
    },
    scrollable: {
      control: 'boolean',
      description: 'Enable scrolling for modal content that exceeds viewport height'
    },
    zIndex: {
      control: 'number',
      description: 'CSS z-index for modal stacking order (default: 1050)'
    }
  },
  args: {
    'onUpdate:modelValue': () => {},
    'onBefore-open': () => {},
    onOpened: () => {},
    'onBefore-close': () => {},
    onClosed: () => {},
    'onBackdrop-click': () => {},
    'onEscape-key': () => {}
  }
} satisfies Meta<typeof BaseModal>

export default meta
type Story = StoryObj<typeof meta>

// 1. Default Story
export const Default: Story = {
  args: {
    modelValue: true,
    size: 'medium',
    title: 'Modal Title'
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      const closeModal = () => { isOpen.value = false }
      
      return { args, isOpen, openModal, closeModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Open Modal
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <p>This is the default modal with medium size and standard configuration. It includes a title, close button, and basic content.</p>
          <p>You can close this modal by clicking the X button, pressing Escape, or clicking outside the modal area.</p>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default modal with medium size, title, and standard behavior. This is the basic usage for most modal scenarios.'
      }
    }
  }
}

// 2. Size Variants
export const Small: Story = {
  args: {
    modelValue: true,
    size: 'small',
    title: 'Small Modal',
    subtitle: 'Compact size for simple confirmations'
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      
      return { args, isOpen, openModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
          Open Small Modal
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <p>Small modal (400px max width) perfect for simple confirmations and compact content.</p>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Small modal variant (400px max width) ideal for confirmations, alerts, and compact content displays.'
      }
    }
  }
}

export const Medium: Story = {
  args: {
    modelValue: true,
    size: 'medium',
    title: 'Medium Modal',
    subtitle: 'Standard size for most use cases'
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      
      return { args, isOpen, openModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Open Medium Modal
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <p>Medium modal (600px max width) - the default size for most modal scenarios including forms, content display, and user interactions.</p>
          <p>This size provides a good balance between content space and visual prominence on the page.</p>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Medium modal variant (600px max width) - the default size for most modal use cases including forms and content display.'
      }
    }
  }
}

export const Large: Story = {
  args: {
    modelValue: true,
    size: 'large',
    title: 'Large Modal',
    subtitle: 'Spacious layout for complex content'
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      
      return { args, isOpen, openModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Open Large Modal
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px;">
            <div>
              <h4 style="margin: 0 0 12px; font-weight: 600;">Left Column</h4>
              <p>Large modal (900px max width) provides ample space for complex layouts, multi-column content, and detailed interfaces.</p>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li>Complex forms with multiple sections</li>
                <li>Data tables and detailed information</li>
                <li>Multi-step workflows</li>
                <li>Rich media content</li>
              </ul>
            </div>
            <div>
              <h4 style="margin: 0 0 12px; font-weight: 600;">Right Column</h4>
              <p>Perfect for dashboard modals, settings panels, and content management interfaces that require more screen real estate.</p>
              <div style="padding: 16px; background: #f8fafc; border-radius: 6px; margin-top: 12px;">
                <strong>Best Practices:</strong> Use large modals when content complexity justifies the screen space usage.
              </div>
            </div>
          </div>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Large modal variant (900px max width) for complex content, multi-column layouts, and detailed interfaces.'
      }
    }
  }
}

export const FullScreen: Story = {
  args: {
    modelValue: true,
    size: 'fullscreen',
    title: 'Fullscreen Modal',
    subtitle: 'Maximum space for immersive experiences'
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      
      return { args, isOpen, openModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 12px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 500;">
          Open Fullscreen Modal
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <div style="min-height: 400px; display: flex; flex-direction: column; gap: 24px;">
            <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 8px;">
              <h3 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #1f2937;">Fullscreen Experience</h3>
              <p style="margin: 0; font-size: 16px; color: #6b7280;">This modal takes up the entire viewport for immersive experiences.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
              <div style="padding: 20px; background: #fef7ff; border: 1px solid #e9d5ff; border-radius: 8px;">
                <h4 style="margin: 0 0 8px; color: #7c3aed;">Media Galleries</h4>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Perfect for image carousels and video players</p>
              </div>
              <div style="padding: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
                <h4 style="margin: 0 0 8px; color: #059669;">Rich Editors</h4>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Ideal for document editing and content creation</p>
              </div>
              <div style="padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
                <h4 style="margin: 0 0 8px; color: #dc2626;">Data Visualization</h4>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Great for charts, dashboards, and analytics</p>
              </div>
            </div>
            
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; background: #f8fafc; border-radius: 8px; border: 2px dashed #cbd5e1;">
              <div style="text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">🖥️</div>
                <p style="margin: 0; color: #64748b; font-size: 16px;">Fullscreen modals utilize the entire viewport</p>
              </div>
            </div>
          </div>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Fullscreen modal variant that occupies the entire viewport for immersive experiences, media galleries, and complex applications.'
      }
    }
  }
}

// 3. WithHeader variations
export const WithHeader: Story = {
  args: {
    modelValue: true,
    size: 'medium',
    title: 'Settings Panel',
    subtitle: 'Manage your account preferences'
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      
      return { args, isOpen, openModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Open Settings Modal
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <template #header>
            <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
              <div style="width: 40px; height: 40px; background: #6366f1; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">⚙️</div>
              <div>
                <h3 style="margin: 0 0 4px; font-size: 18px; font-weight: 600;">Advanced Settings</h3>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Configure your calendar preferences and notifications</p>
              </div>
            </div>
          </template>
          
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="padding: 16px; background: #f8fafc; border-radius: 8px;">
              <h4 style="margin: 0 0 8px; font-weight: 600;">Notification Settings</h4>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Control when and how you receive notifications</p>
            </div>
            <div style="padding: 16px; background: #f8fafc; border-radius: 8px;">
              <h4 style="margin: 0 0 8px; font-weight: 600;">Privacy Controls</h4>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Manage your data and visibility preferences</p>
            </div>
            <div style="padding: 16px; background: #f8fafc; border-radius: 8px;">
              <h4 style="margin: 0 0 8px; font-weight: 600;">Calendar Sync</h4>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Connect external calendars and services</p>
            </div>
          </div>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal with custom header content using the header slot for rich layouts including icons, complex titles, and additional context.'
      }
    }
  }
}

export const WithFooter: Story = {
  args: {
    modelValue: true,
    size: 'medium',
    title: 'Confirm Action',
    showCloseButton: false
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      const closeModal = () => { isOpen.value = false }
      const confirmAction = () => { 
        alert('Action confirmed!')
        isOpen.value = false 
      }
      
      return { args, isOpen, openModal, closeModal, confirmAction }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Delete Item
        </button>
        <BaseModal v-model="isOpen" v-bind="args" :close-on-backdrop="false" :close-on-escape="false">
          <div style="text-align: center; padding: 20px;">
            <div style="width: 64px; height: 64px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; color: #dc2626;">
              ⚠️
            </div>
            <h3 style="margin: 0 0 12px; font-size: 20px; font-weight: 600; color: #1f2937;">Are you sure?</h3>
            <p style="margin: 0 0 24px; color: #6b7280; line-height: 1.5;">This action cannot be undone. This will permanently delete the item and remove all associated data.</p>
          </div>
          
          <template #footer>
            <button @click="closeModal" style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer;">
              Cancel
            </button>
            <button @click="confirmAction" style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
              Yes, delete it
            </button>
          </template>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal with footer slot for actions and buttons. Perfect for confirmation dialogs and forms with submit/cancel actions.'
      }
    }
  }
}

export const WithActions: Story = {
  args: {
    modelValue: true,
    size: 'medium',
    title: 'Edit Profile',
    subtitle: 'Update your personal information'
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      const closeModal = () => { isOpen.value = false }
      const saveChanges = () => { 
        alert('Changes saved!')
        isOpen.value = false 
      }
      
      return { args, isOpen, openModal, closeModal, saveChanges }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Edit Profile
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <form style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Full Name</label>
              <input type="text" value="John Doe" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
            </div>
            <div>
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Email</label>
              <input type="email" value="john@example.com" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
            </div>
            <div>
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Bio</label>
              <textarea style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; height: 80px; resize: vertical;" placeholder="Tell us about yourself..."></textarea>
            </div>
          </form>
          
          <template #footer>
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span style="font-size: 12px; color: #9ca3af;">All changes are saved automatically</span>
              <div style="display: flex; gap: 8px;">
                <button @click="closeModal" style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer;">
                  Cancel
                </button>
                <button @click="saveChanges" style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                  Save Changes
                </button>
              </div>
            </div>
          </template>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal with both header and footer content, demonstrating a complete form interface with actions and status information.'
      }
    }
  }
}

// 4. Dialog Types
export const ConfirmDialog: Story = {
  args: {
    modelValue: true,
    size: 'small',
    title: 'Confirm Delete',
    showCloseButton: false,
    closeOnBackdrop: false,
    closeOnEscape: false
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      const closeModal = () => { isOpen.value = false }
      const confirmDelete = () => { 
        alert('Item deleted!')
        isOpen.value = false 
      }
      
      return { args, isOpen, openModal, closeModal, confirmDelete }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Delete Item
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <div style="text-align: center; padding: 8px 0;">
            <div style="width: 56px; height: 56px; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #dc2626; font-size: 24px;">
              🗑️
            </div>
            <p style="margin: 0 0 20px; color: #374151;">Are you sure you want to delete this item? This action cannot be undone.</p>
          </div>
          
          <template #footer>
            <button @click="closeModal" style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer;">
              Cancel
            </button>
            <button @click="confirmDelete" style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
              Delete
            </button>
          </template>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog with persistent behavior - prevents closing until user makes a explicit choice.'
      }
    }
  }
}

export const AlertDialog: Story = {
  args: {
    modelValue: true,
    size: 'small',
    title: 'Success!',
    showCloseButton: false
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      const closeModal = () => { isOpen.value = false }
      
      return { args, isOpen, openModal, closeModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Show Success
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <div style="text-align: center; padding: 8px 0;">
            <div style="width: 56px; height: 56px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #10b981; font-size: 24px;">
              ✅
            </div>
            <p style="margin: 0 0 20px; color: #374151;">Your changes have been saved successfully!</p>
          </div>
          
          <template #footer>
            <button @click="closeModal" style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; width: 100%;">
              Continue
            </button>
          </template>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Alert dialog for notifications and status messages with single action button.'
      }
    }
  }
}

export const FormModal: Story = {
  args: {
    modelValue: true,
    size: 'medium',
    title: 'Create New Event',
    subtitle: 'Add an event to your calendar'
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      const closeModal = () => { isOpen.value = false }
      const createEvent = () => { 
        alert('Event created!')
        isOpen.value = false 
      }
      
      return { args, isOpen, openModal, closeModal, createEvent }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Create Event
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <form style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Event Title *</label>
                <input type="text" placeholder="Team Meeting" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
              </div>
              <div>
                <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Category</label>
                <select style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                  <option>Work</option>
                  <option>Personal</option>
                  <option>Meeting</option>
                </select>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Start Date</label>
                <input type="datetime-local" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
              </div>
              <div>
                <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">End Date</label>
                <input type="datetime-local" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
              </div>
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Location</label>
              <input type="text" placeholder="Conference Room A or Zoom link" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Description</label>
              <textarea placeholder="Add event details, agenda, or notes..." style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; height: 80px; resize: vertical;"></textarea>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8fafc; border-radius: 6px;">
              <input type="checkbox" id="allDay" style="margin: 0;" />
              <label for="allDay" style="margin: 0; font-size: 14px; color: #374151;">All day event</label>
            </div>
          </form>
          
          <template #footer>
            <button @click="closeModal" style="padding: 10px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer;">
              Cancel
            </button>
            <button @click="createEvent" style="padding: 10px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
              Create Event
            </button>
          </template>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Form modal with complex form fields, validation, and proper submit/cancel actions for data entry scenarios.'
      }
    }
  }
}

// 5. Animation Variants
export const AnimationVariants: Story = {
  args: {
    modelValue: true,
    size: 'medium',
    title: 'Animation Demo'
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const fadeModal = ref(false)
      const slideModal = ref(false)
      const zoomModal = ref(false)
      
      const openFade = () => { fadeModal.value = true }
      const openSlide = () => { slideModal.value = true }
      const openZoom = () => { zoomModal.value = true }
      
      return { args, fadeModal, slideModal, zoomModal, openFade, openSlide, openZoom }
    },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button @click="openFade" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Fade Animation
        </button>
        <button @click="openSlide" style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Slide Animation
        </button>
        <button @click="openZoom" style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Zoom Animation
        </button>
        
        <!-- Fade Modal (Default) -->
        <BaseModal v-model="fadeModal" v-bind="args" title="Fade Animation">
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">✨</div>
            <p>This modal uses the default fade-in animation with a subtle scale and translate effect.</p>
          </div>
        </BaseModal>
        
        <!-- Slide Modal -->  
        <BaseModal v-model="slideModal" v-bind="args" title="Slide Animation" style="--modal-transform: translateY(100px);">
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">⬆️</div>
            <p>This modal demonstrates a slide-up animation effect from the bottom of the screen.</p>
          </div>
        </BaseModal>
        
        <!-- Zoom Modal -->
        <BaseModal v-model="zoomModal" v-bind="args" title="Zoom Animation" style="--modal-transform: scale(0.8);">
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
            <p>This modal showcases a zoom-in effect that scales from smaller to normal size.</p>
          </div>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different animation variants showing fade, slide, and zoom entrance effects for modal appearances.'
      }
    }
  }
}

// 6. Special States
export const Loading: Story = {
  args: {
    modelValue: true,
    size: 'medium',
    title: 'Processing Request',
    loading: true
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const isLoading = ref(false)
      
      const openModal = () => { 
        isOpen.value = true 
        isLoading.value = false
      }
      
      const startLoading = () => {
        isLoading.value = true
        // Simulate async operation
        setTimeout(() => {
          isLoading.value = false
        }, 3000)
      }
      
      return { args, isOpen, isLoading, openModal, startLoading }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Open Loading Modal
        </button>
        <BaseModal v-model="isOpen" v-bind="args" :loading="isLoading">
          <div style="padding: 20px; text-align: center;">
            <h4 style="margin: 0 0 16px; font-weight: 600;">Submit Form</h4>
            <p style="margin: 0 0 24px; color: #6b7280;">Click the button below to simulate a loading state.</p>
            <button @click="startLoading" :disabled="isLoading" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; opacity: isLoading ? 0.6 : 1;">
              {{ isLoading ? 'Processing...' : 'Submit' }}
            </button>
          </div>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Loading state modal with spinner overlay for async operations and form submissions.'
      }
    }
  }
}

export const Scrollable: Story = {
  args: {
    modelValue: true,
    size: 'medium',
    title: 'Long Content',
    subtitle: 'Modal with scrollable content area',
    scrollable: true
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      
      return { args, isOpen, openModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Open Scrollable Modal
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="padding: 16px; background: #dbeafe; border-radius: 8px;">
              <h4 style="margin: 0 0 8px; color: #1e40af;">Scrollable Content Demo</h4>
              <p style="margin: 0; font-size: 14px;">This modal demonstrates scrollable content when the modal body exceeds the available viewport height.</p>
            </div>
            
            ${Array.from({ length: 15 }, (_, i) => `
              <div style="padding: 16px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h5 style="margin: 0 0 8px; font-weight: 600;">Section ${i + 1}</h5>
                <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                  This is content section ${i + 1}. When there's more content than can fit in the available viewport height, 
                  the modal body becomes scrollable while keeping the header and footer fixed in place. This ensures users 
                  can always access the modal controls while browsing through lengthy content.
                </p>
              </div>
            `).join('')}
            
            <div style="padding: 20px; background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 8px; text-align: center;">
              <h4 style="margin: 0 0 8px; color: #166534;">End of Content</h4>
              <p style="margin: 0; font-size: 14px; color: #166534;">You've reached the end of the scrollable content area!</p>
            </div>
          </div>
          
          <template #footer>
            <span style="flex: 1; font-size: 12px; color: #9ca3af;">Scroll up to see more content</span>
            <button style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Got it
            </button>
          </template>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Scrollable modal with long content that exceeds viewport height, demonstrating fixed header/footer with scrollable body.'
      }
    }
  }
}

export const Persistent: Story = {
  args: {
    modelValue: true,
    size: 'small',
    title: 'Required Action',
    closeOnBackdrop: false,
    closeOnEscape: false,
    showCloseButton: false,
    preventClose: true
  },
  render: (args) => ({
    components: { BaseModal },
    setup() {
      const isOpen = ref(false)
      const openModal = () => { isOpen.value = true }
      const closeModal = () => { isOpen.value = false }
      
      return { args, isOpen, openModal, closeModal }
    },
    template: `
      <div>
        <button @click="openModal" style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Open Persistent Modal
        </button>
        <BaseModal v-model="isOpen" v-bind="args">
          <div style="text-align: center; padding: 8px 0;">
            <div style="width: 56px; height: 56px; background: #fef3c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #f59e0b; font-size: 24px;">
              ⚡
            </div>
            <h4 style="margin: 0 0 12px; font-weight: 600;">Action Required</h4>
            <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.5;">
              This modal cannot be closed by clicking outside or pressing Escape. 
              You must make a choice to proceed.
            </p>
          </div>
          
          <template #footer>
            <button @click="closeModal" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; width: 100%;">
              I Understand
            </button>
          </template>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Persistent modal that prevents closing via backdrop click or Escape key, requiring explicit user action.'
      }
    }
  }
}

// 7. SizeComparison
export const SizeComparison: Story = {
  args: {
    modelValue: true
  },
  render: () => ({
    components: { BaseModal },
    setup() {
      const smallModal = ref(false)
      const mediumModal = ref(false)
      const largeModal = ref(false)
      const fullscreenModal = ref(false)
      
      const openSmall = () => { smallModal.value = true }
      const openMedium = () => { mediumModal.value = true }
      const openLarge = () => { largeModal.value = true }
      const openFullscreen = () => { fullscreenModal.value = true }
      
      return { 
        smallModal, mediumModal, largeModal, fullscreenModal,
        openSmall, openMedium, openLarge, openFullscreen 
      }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px;">
          <h4 style="margin: 0 0 8px; font-weight: 600;">Small Modal</h4>
          <p style="margin: 0 0 16px; font-size: 12px; color: #6b7280;">400px max width</p>
          <button @click="openSmall" style="padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            Open Small
          </button>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px;">
          <h4 style="margin: 0 0 8px; font-weight: 600;">Medium Modal</h4>
          <p style="margin: 0 0 16px; font-size: 12px; color: #6b7280;">600px max width</p>
          <button @click="openMedium" style="padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            Open Medium
          </button>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px;">
          <h4 style="margin: 0 0 8px; font-weight: 600;">Large Modal</h4>
          <p style="margin: 0 0 16px; font-size: 12px; color: #6b7280;">900px max width</p>
          <button @click="openLarge" style="padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            Open Large
          </button>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px;">
          <h4 style="margin: 0 0 8px; font-weight: 600;">Fullscreen Modal</h4>
          <p style="margin: 0 0 16px; font-size: 12px; color: #6b7280;">100vw × 100vh</p>
          <button @click="openFullscreen" style="padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            Open Fullscreen
          </button>
        </div>
        
        <!-- Modals -->
        <BaseModal v-model="smallModal" size="small" title="Small Modal" subtitle="Compact size for simple content">
          <p>This is a small modal perfect for confirmations, alerts, and simple forms.</p>
        </BaseModal>
        
        <BaseModal v-model="mediumModal" size="medium" title="Medium Modal" subtitle="Default size for most use cases">
          <p>This is a medium modal - the default size that works well for most content types including forms, settings, and information displays.</p>
        </BaseModal>
        
        <BaseModal v-model="largeModal" size="large" title="Large Modal" subtitle="Spacious layout for complex content">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h4 style="margin: 0 0 12px;">Left Column</h4>
              <p>Large modals provide ample space for complex layouts and detailed content.</p>
            </div>
            <div>
              <h4 style="margin: 0 0 12px;">Right Column</h4>
              <p>Perfect for multi-column layouts, data tables, and rich content presentations.</p>
            </div>
          </div>
        </BaseModal>
        
        <BaseModal v-model="fullscreenModal" size="fullscreen" title="Fullscreen Modal" subtitle="Maximum space for immersive experiences">
          <div style="display: flex; flex-direction: column; gap: 24px; min-height: 300px;">
            <div style="text-align: center; padding: 40px; background: #f8fafc; border-radius: 8px;">
              <h3 style="margin: 0 0 16px; font-size: 24px;">Fullscreen Experience</h3>
              <p>This modal occupies the entire viewport for immersive content experiences.</p>
            </div>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 8px; border: 2px dashed #d1d5db;">
              <p style="margin: 0; color: #64748b;">Full viewport utilization</p>
            </div>
          </div>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Size comparison showing all four available modal sizes with their respective dimensions and use cases.'
      }
    }
  }
}

// 8. Interactive Behaviors
export const InteractiveBehaviors: Story = {
  args: {
    modelValue: true
  },
  render: () => ({
    components: { BaseModal },
    setup() {
      const backdropModal = ref(false)
      const escapeModal = ref(false)
      const focusModal = ref(false)
      
      const openBackdrop = () => { backdropModal.value = true }
      const openEscape = () => { escapeModal.value = true }
      const openFocus = () => { focusModal.value = true }
      
      const handleBackdropClick = () => {
        alert('Backdrop clicked! Modal can be closed by clicking outside.')
      }
      
      const handleEscapeKey = () => {
        alert('Escape key pressed! Modal will close.')
      }
      
      return { 
        backdropModal, escapeModal, focusModal,
        openBackdrop, openEscape, openFocus,
        handleBackdropClick, handleEscapeKey
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button @click="openBackdrop" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Backdrop Interaction
          </button>
          <button @click="openEscape" style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Escape Key Demo
          </button>
          <button @click="openFocus" style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Focus Management
          </button>
        </div>
        
        <!-- Backdrop Modal -->
        <BaseModal 
          v-model="backdropModal" 
          title="Backdrop Interaction" 
          subtitle="Click outside to close"
          @backdrop-click="handleBackdropClick"
        >
          <div style="padding: 20px; text-align: center;">
            <p style="margin: 0 0 16px;">This modal can be closed by clicking on the backdrop (dark overlay area).</p>
            <div style="padding: 16px; background: #dbeafe; border-radius: 8px;">
              <strong>Try it:</strong> Click outside this modal to close it
            </div>
          </div>
        </BaseModal>
        
        <!-- Escape Key Modal -->
        <BaseModal 
          v-model="escapeModal" 
          title="Escape Key Handling" 
          subtitle="Press Escape to close"
          @escape-key="handleEscapeKey"
        >
          <div style="padding: 20px; text-align: center;">
            <p style="margin: 0 0 16px;">This modal responds to the Escape key for quick dismissal.</p>
            <div style="padding: 16px; background: #f0fdf4; border-radius: 8px;">
              <strong>Try it:</strong> Press the Escape key to close this modal
            </div>
          </div>
        </BaseModal>
        
        <!-- Focus Management Modal -->
        <BaseModal 
          v-model="focusModal" 
          title="Focus Management" 
          subtitle="Keyboard navigation demonstration"
        >
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <p>This modal demonstrates proper focus management and keyboard navigation:</p>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <button style="padding: 8px 12px; border: 1px solid #d1d5db; background: white; border-radius: 6px; cursor: pointer;">First Focusable Button</button>
              <input type="text" placeholder="Focusable input field" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;" />
              <select style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                <option>Focusable select</option>
                <option>Option 2</option>
              </select>
              <button style="padding: 8px 12px; border: 1px solid #d1d5db; background: white; border-radius: 6px; cursor: pointer;">Last Focusable Button</button>
            </div>
            <div style="padding: 12px; background: #fef3c7; border-radius: 6px; font-size: 14px;">
              <strong>Focus Trap:</strong> Tab key cycles through focusable elements within the modal. Focus cannot escape to background content.
            </div>
          </div>
        </BaseModal>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive behaviors including backdrop clicking, escape key handling, and focus management with keyboard navigation.'
      }
    }
  }
}

// 9. InContext - Real Usage Examples
export const InContext: Story = {
  args: {
    modelValue: true
  },
  render: () => ({
    components: { BaseModal },
    setup() {
      const loginModal = ref(false)
      const confirmModal = ref(false)
      const settingsModal = ref(false)
      const galleryModal = ref(false)
      const onboardingModal = ref(false)
      
      const openLogin = () => { loginModal.value = true }
      const openConfirm = () => { confirmModal.value = true }
      const openSettings = () => { settingsModal.value = true }
      const openGallery = () => { galleryModal.value = true }
      const openOnboarding = () => { onboardingModal.value = true }
      
      const handleLogin = () => { 
        alert('Logged in successfully!')
        loginModal.value = false 
      }
      const handleDelete = () => { 
        alert('Project deleted!')
        confirmModal.value = false 
      }
      const handleSaveSettings = () => { 
        alert('Settings saved!')
        settingsModal.value = false 
      }
      
      return { 
        loginModal, confirmModal, settingsModal, galleryModal, onboardingModal,
        openLogin, openConfirm, openSettings, openGallery, openOnboarding,
        handleLogin, handleDelete, handleSaveSettings
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1200px;">
        
        <!-- Context Examples Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          
          <!-- Login Form Context -->
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
            <h4 style="margin: 0 0 12px; font-weight: 600; color: #1f2937;">🔐 Authentication Modal</h4>
            <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280;">Login form with validation and error handling</p>
            <button @click="openLogin" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">
              Open Login Modal
            </button>
          </div>
          
          <!-- Confirmation Dialog Context -->
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
            <h4 style="margin: 0 0 12px; font-weight: 600; color: #1f2937;">⚠️ Confirmation Dialog</h4>
            <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280;">Destructive action confirmation with persistent behavior</p>
            <button @click="openConfirm" style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">
              Delete Project
            </button>
          </div>
          
          <!-- Settings Panel Context -->
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
            <h4 style="margin: 0 0 12px; font-weight: 600; color: #1f2937;">⚙️ Settings Panel</h4>
            <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280;">Complex configuration interface with multiple sections</p>
            <button @click="openSettings" style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">
              Open Settings
            </button>
          </div>
          
          <!-- Media Gallery Context -->
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
            <h4 style="margin: 0 0 12px; font-weight: 600; color: #1f2937;">🖼️ Media Gallery</h4>
            <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280;">Fullscreen media viewer with navigation</p>
            <button @click="openGallery" style="padding: 8px 16px; background: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">
              View Gallery
            </button>
          </div>
          
          <!-- Onboarding Flow Context -->
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
            <h4 style="margin: 0 0 12px; font-weight: 600; color: #1f2937;">🚀 Onboarding Flow</h4>
            <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280;">Multi-step user introduction and setup process</p>
            <button @click="openOnboarding" style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">
              Start Tour
            </button>
          </div>
        </div>
        
        <!-- Login Modal -->
        <BaseModal v-model="loginModal" size="small" title="Welcome Back" subtitle="Sign in to your account">
          <form style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Email</label>
              <input type="email" placeholder="you@example.com" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
            </div>
            <div>
              <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Password</label>
              <input type="password" placeholder="Enter your password" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
            </div>
            <div style="display: flex; justify-content: between; align-items: center; font-size: 14px;">
              <label style="display: flex; align-items: center; gap: 6px;">
                <input type="checkbox" style="margin: 0;" />
                Remember me
              </label>
              <a href="#" style="color: #6366f1; text-decoration: none;">Forgot password?</a>
            </div>
          </form>
          
          <template #footer>
            <button style="padding: 10px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer;">
              Cancel
            </button>
            <button @click="handleLogin" style="padding: 10px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
              Sign In
            </button>
          </template>
        </BaseModal>
        
        <!-- Confirmation Modal -->
        <BaseModal 
          v-model="confirmModal" 
          size="small" 
          title="Delete Project" 
          :close-on-backdrop="false" 
          :close-on-escape="false"
          :show-close-button="false"
        >
          <div style="text-align: center; padding: 8px 0;">
            <div style="width: 56px; height: 56px; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #dc2626; font-size: 24px;">
              🗑️
            </div>
            <h4 style="margin: 0 0 8px; font-weight: 600; color: #1f2937;">Are you absolutely sure?</h4>
            <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; line-height: 1.5;">
              This action cannot be undone. This will permanently delete the 
              <strong>"Website Redesign"</strong> project and remove all associated data.
            </p>
            <div style="padding: 12px; background: #fef2f2; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 12px; color: #dc2626;">⚠️ This will delete 15 tasks, 8 files, and 23 comments</p>
            </div>
          </div>
          
          <template #footer>
            <button @click="confirmModal = false" style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer;">
              Cancel
            </button>
            <button @click="handleDelete" style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
              Yes, delete project
            </button>
          </template>
        </BaseModal>
        
        <!-- Settings Modal -->
        <BaseModal v-model="settingsModal" size="large" title="Calendar Settings" subtitle="Customize your calendar experience">
          <div style="display: grid; grid-template-columns: 200px 1fr; gap: 24px; min-height: 400px;">
            <!-- Settings Navigation -->
            <div style="border-right: 1px solid #e5e7eb; padding-right: 16px;">
              <nav style="display: flex; flex-direction: column; gap: 4px;">
                <a href="#" style="padding: 8px 12px; border-radius: 6px; text-decoration: none; color: #6366f1; background: #eff6ff; font-weight: 500; font-size: 14px;">General</a>
                <a href="#" style="padding: 8px 12px; border-radius: 6px; text-decoration: none; color: #6b7280; font-size: 14px;">Notifications</a>
                <a href="#" style="padding: 8px 12px; border-radius: 6px; text-decoration: none; color: #6b7280; font-size: 14px;">Privacy</a>
                <a href="#" style="padding: 8px 12px; border-radius: 6px; text-decoration: none; color: #6b7280; font-size: 14px;">Integrations</a>
                <a href="#" style="padding: 8px 12px; border-radius: 6px; text-decoration: none; color: #6b7280; font-size: 14px;">Advanced</a>
              </nav>
            </div>
            
            <!-- Settings Content -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
              <div>
                <h4 style="margin: 0 0 16px; font-weight: 600;">General Settings</h4>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <div>
                    <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Time Zone</label>
                    <select style="width: 300px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                      <option>Pacific Time (PT)</option>
                      <option>Eastern Time (ET)</option>
                      <option>Central Time (CT)</option>
                    </select>
                  </div>
                  <div>
                    <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Default View</label>
                    <select style="width: 300px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                      <option>Week View</option>
                      <option>Month View</option>
                      <option>Day View</option>
                    </select>
                  </div>
                  <div>
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; color: #374151;">
                      <input type="checkbox" checked />
                      Show weekends
                    </label>
                  </div>
                  <div>
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; color: #374151;">
                      <input type="checkbox" />
                      24-hour time format
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style="margin: 0 0 16px; font-weight: 600;">Working Hours</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 400px;">
                  <div>
                    <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">Start Time</label>
                    <input type="time" value="09:00" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
                  </div>
                  <div>
                    <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #374151;">End Time</label>
                    <input type="time" value="17:00" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <template #footer>
            <span style="flex: 1; font-size: 12px; color: #9ca3af;">Changes are saved automatically</span>
            <button style="padding: 10px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer;">
              Reset to Default
            </button>
            <button @click="handleSaveSettings" style="padding: 10px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
              Save Changes
            </button>
          </template>
        </BaseModal>
        
        <!-- Gallery Modal -->
        <BaseModal v-model="galleryModal" size="fullscreen" title="Project Gallery" subtitle="Design system mockups and wireframes">
          <div style="display: flex; flex-direction: column; gap: 24px; min-height: 500px;">
            <div style="display: flex; justify-content: center; align-items: center; flex: 1; background: #1f2937; border-radius: 8px; position: relative;">
              <div style="text-align: center; color: white;">
                <div style="font-size: 64px; margin-bottom: 16px;">🖼️</div>
                <h3 style="margin: 0 0 8px; font-size: 24px;">Image Placeholder</h3>
                <p style="margin: 0; opacity: 0.7;">High-resolution project mockup would display here</p>
              </div>
              
              <!-- Navigation Controls -->
              <button style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; cursor: pointer; font-size: 20px;">‹</button>
              <button style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; cursor: pointer; font-size: 20px;">›</button>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 8px;">
              <div style="width: 60px; height: 40px; background: #e5e7eb; border: 2px solid #6366f1; border-radius: 4px; cursor: pointer;"></div>
              <div style="width: 60px; height: 40px; background: #e5e7eb; border: 2px solid transparent; border-radius: 4px; cursor: pointer;"></div>
              <div style="width: 60px; height: 40px; background: #e5e7eb; border: 2px solid transparent; border-radius: 4px; cursor: pointer;"></div>
              <div style="width: 60px; height: 40px; background: #e5e7eb; border: 2px solid transparent; border-radius: 4px; cursor: pointer;"></div>
              <div style="width: 60px; height: 40px; background: #e5e7eb; border: 2px solid transparent; border-radius: 4px; cursor: pointer;"></div>
            </div>
          </div>
          
          <template #footer>
            <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
              <span style="font-size: 14px; color: #6b7280;">Image 1 of 5</span>
              <span style="font-size: 14px; color: #6b7280;">•</span>
              <span style="font-size: 14px; color: #6b7280;">design-system-mockup.png</span>
            </div>
            <button style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer;">
              Download
            </button>
            <button style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Share
            </button>
          </template>
        </BaseModal>
        
        <!-- Onboarding Modal -->
        <BaseModal 
          v-model="onboardingModal" 
          size="medium" 
          title="Welcome to Vana Calendar!" 
          subtitle="Let's get you set up in just a few steps"
          :close-on-backdrop="false"
        >
          <div style="text-align: center; padding: 20px 0;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: white; font-size: 32px; font-weight: 700;">V</div>
            
            <h3 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #1f2937;">Ready to transform your scheduling?</h3>
            <p style="margin: 0 0 32px; color: #6b7280; font-size: 16px; line-height: 1.6;">
              Vana's intelligent calendar learns your preferences and helps you manage time more effectively. 
              Let's start with a quick tour of the key features.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px;">
              <div style="text-align: center;">
                <div style="width: 48px; height: 48px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 20px;">🤖</div>
                <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 600;">Smart Scheduling</h4>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">AI-powered suggestions</p>
              </div>
              <div style="text-align: center;">
                <div style="width: 48px; height: 48px; background: #f0fdf4; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 20px;">⚡</div>
                <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 600;">Quick Actions</h4>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">One-click operations</p>
              </div>
              <div style="text-align: center;">
                <div style="width: 48px; height: 48px; background: #fef7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 20px;">🔄</div>
                <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 600;">Sync Everything</h4>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">All your calendars unified</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 24px;">
              <div style="width: 8px; height: 8px; background: #6366f1; border-radius: 50%;"></div>
              <div style="width: 8px; height: 8px; background: #d1d5db; border-radius: 50%;"></div>
              <div style="width: 8px; height: 8px; background: #d1d5db; border-radius: 50%;"></div>
              <div style="width: 8px; height: 8px; background: #d1d5db; border-radius: 50%;"></div>
            </div>
          </div>
          
          <template #footer>
            <button @click="onboardingModal = false" style="padding: 10px 16px; border: 1px solid #d1d5db; background: white; color: #374151; border-radius: 6px; cursor: pointer;">
              Skip Tour
            </button>
            <button style="padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
              Next Step →
            </button>
          </template>
        </BaseModal>
        
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples showing BaseModal in authentic contexts: authentication forms, confirmation dialogs, settings panels, media galleries, and onboarding flows with appropriate sizing, behavior, and interactions.'
      }
    }
  }
}