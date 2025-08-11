import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from '../BaseButton/BaseButton.vue'
import BaseInputText from '../BaseInputText/BaseInputText.vue'

const meta: Meta<typeof BaseModal> = {
  title: 'UI/Overlays/Base Modal',
  component: BaseModal,
  parameters: {
    docs: {
      description: {
        component:
          'A flexible modal component with comprehensive accessibility features, focus management, and various size options. Built following the Vana design system with BEM methodology.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-modals',
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'fullscreen'],
      description: 'Size variant of the modal',
    },
    centered: {
      control: 'boolean',
      description: 'Centers the modal vertically',
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: 'Allows closing modal by clicking backdrop',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Allows closing modal with Escape key',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Shows close button in header',
    },
    preventClose: {
      control: 'boolean',
      description: 'Prevents modal from being closed',
    },
    persistent: {
      control: 'boolean',
      description: 'Modal persists across route changes',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner overlay',
    },
    title: {
      control: 'text',
      description: 'Title text displayed in header',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle text displayed below title',
    },
    scrollable: {
      control: 'boolean',
      description: 'Makes modal body scrollable',
    },
    zIndex: {
      control: 'number',
      description: 'Z-index for modal overlay',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BaseModal>

export const Default: Story = {
  args: {
    title: 'Modal Title',
    subtitle: 'This is a basic modal with default settings.',
  },
  render: args => ({
    components: { BaseModal, BaseButton },
    setup() {
      const isOpen = ref(false)

      const openModal = () => {
        isOpen.value = true
      }

      const closeModal = () => {
        isOpen.value = false
      }

      return { args, isOpen, openModal, closeModal }
    },
    template: `
      <div>
        <BaseButton label="Open Modal" @click="openModal" />
        
        <BaseModal v-model="isOpen" v-bind="args">
          <p>This is the modal content. You can put any content here including forms, images, or other components.</p>
          <p>The modal provides full keyboard navigation and focus management for accessibility.</p>
          
          <template #footer>
            <BaseButton label="Cancel" variant="ghost" @click="closeModal" />
            <BaseButton label="Save" variant="primary" @click="closeModal" />
          </template>
        </BaseModal>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { BaseModal, BaseButton },
    setup() {
      const smallOpen = ref(false)
      const mediumOpen = ref(false)
      const largeOpen = ref(false)
      const fullscreenOpen = ref(false)

      return {
        smallOpen,
        mediumOpen,
        largeOpen,
        fullscreenOpen,
      }
    },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <BaseButton label="Small Modal" @click="smallOpen = true" />
        <BaseButton label="Medium Modal" @click="mediumOpen = true" />
        <BaseButton label="Large Modal" @click="largeOpen = true" />
        <BaseButton label="Fullscreen Modal" @click="fullscreenOpen = true" />
        
        <BaseModal v-model="smallOpen" size="small" title="Small Modal">
          <p>This is a small modal, perfect for simple confirmations or brief messages.</p>
          <template #footer>
            <BaseButton label="Close" @click="smallOpen = false" />
          </template>
        </BaseModal>
        
        <BaseModal v-model="mediumOpen" size="medium" title="Medium Modal">
          <p>This is a medium modal, the default size. Good for forms and moderate content.</p>
          <p>It provides a good balance between space and not overwhelming the viewport.</p>
          <template #footer>
            <BaseButton label="Close" @click="mediumOpen = false" />
          </template>
        </BaseModal>
        
        <BaseModal v-model="largeOpen" size="large" title="Large Modal">
          <p>This is a large modal, suitable for complex forms, tables, or detailed content.</p>
          <p>It uses more of the available viewport space while maintaining readability.</p>
          <p>Perfect for dashboards, settings panels, or data-heavy interfaces.</p>
          <template #footer>
            <BaseButton label="Close" @click="largeOpen = false" />
          </template>
        </BaseModal>
        
        <BaseModal v-model="fullscreenOpen" size="fullscreen" title="Fullscreen Modal">
          <p>This is a fullscreen modal that takes up the entire viewport.</p>
          <p>Ideal for immersive experiences, image viewers, or complex multi-step processes.</p>
          <p>On mobile devices, this provides a native app-like experience.</p>
          <template #footer>
            <BaseButton label="Close" @click="fullscreenOpen = false" />
          </template>
        </BaseModal>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different size variants available for various use cases.',
      },
    },
  },
}

export const ConfirmationModal: Story = {
  render: () => ({
    components: { BaseModal, BaseButton },
    setup() {
      const showConfirmation = ref(false)
      const showWarning = ref(false)
      const showDanger = ref(false)

      const handleConfirm = () => {
        alert('Action confirmed!')
        showConfirmation.value = false
      }

      const handleWarning = () => {
        alert('Warning acknowledged!')
        showWarning.value = false
      }

      const handleDanger = () => {
        alert('Dangerous action confirmed!')
        showDanger.value = false
      }

      return {
        showConfirmation,
        showWarning,
        showDanger,
        handleConfirm,
        handleWarning,
        handleDanger,
      }
    },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <BaseButton label="Show Confirmation" @click="showConfirmation = true" />
        <BaseButton label="Show Warning" variant="outline" @click="showWarning = true" />
        <BaseButton label="Show Danger" variant="secondary" @click="showDanger = true" />
        
        <BaseModal 
          v-model="showConfirmation" 
          size="small" 
          title="Confirm Action"
          class="confirmation-modal"
        >
          <div style="text-align: center;">
            <div class="icon icon--success" style="font-size: 48px; color: #10b981; margin-bottom: 16px;">
              ✓
            </div>
            <h3>Are you sure?</h3>
            <p>This action will save your changes and update your profile information.</p>
          </div>
          <template #footer>
            <BaseButton label="Cancel" variant="ghost" @click="showConfirmation = false" />
            <BaseButton label="Confirm" variant="primary" @click="handleConfirm" />
          </template>
        </BaseModal>
        
        <BaseModal 
          v-model="showWarning" 
          size="small" 
          title="Warning"
          class="confirmation-modal"
        >
          <div style="text-align: center;">
            <div class="icon icon--warning" style="font-size: 48px; color: #f59e0b; margin-bottom: 16px;">
              ⚠
            </div>
            <h3>Unsaved Changes</h3>
            <p>You have unsaved changes that will be lost if you continue.</p>
          </div>
          <template #footer>
            <BaseButton label="Cancel" variant="ghost" @click="showWarning = false" />
            <BaseButton label="Continue" variant="outline" @click="handleWarning" />
          </template>
        </BaseModal>
        
        <BaseModal 
          v-model="showDanger" 
          size="small" 
          title="Danger Zone"
          class="confirmation-modal"
        >
          <div style="text-align: center;">
            <div class="icon icon--danger" style="font-size: 48px; color: #ef4444; margin-bottom: 16px;">
              🗑
            </div>
            <h3>Delete Account</h3>
            <p>This action cannot be undone. All your data will be permanently deleted.</p>
          </div>
          <template #footer>
            <BaseButton label="Cancel" variant="ghost" @click="showDanger = false" />
            <BaseButton label="Delete" variant="secondary" @click="handleDanger" />
          </template>
        </BaseModal>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Confirmation modals with different contexts: success, warning, and danger.',
      },
    },
  },
}

export const FormModal: Story = {
  render: () => ({
    components: { BaseModal, BaseButton, BaseInputText },
    setup() {
      const showForm = ref(false)
      const formData = ref({
        name: '',
        email: '',
        phone: '',
        message: '',
      })

      const handleSubmit = () => {
        console.log('Form submitted:', formData.value)
        alert('Form submitted successfully!')
        showForm.value = false
        // Reset form
        formData.value = {
          name: '',
          email: '',
          phone: '',
          message: '',
        }
      }

      return {
        showForm,
        formData,
        handleSubmit,
      }
    },
    template: `
      <div>
        <BaseButton label="Open Contact Form" @click="showForm = true" />
        
        <BaseModal 
          v-model="showForm" 
          size="medium" 
          title="Contact Us"
          subtitle="Fill out the form below and we'll get back to you soon."
          class="form-modal"
        >
          <div class="form-group">
            <BaseInputText
              v-model="formData.name"
              label="Full Name"
              placeholder="Enter your full name"
              :required="true"
            />
          </div>
          
          <div class="form-group">
            <BaseInputText
              v-model="formData.email"
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              :required="true"
              left-icon="fas fa-envelope"
            />
          </div>
          
          <div class="form-group">
            <BaseInputText
              v-model="formData.phone"
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              :optional="true"
              left-icon="fas fa-phone"
            />
          </div>
          
          <div class="form-group">
            <BaseInputText
              v-model="formData.message"
              label="Message"
              placeholder="Tell us how we can help..."
              :required="true"
              help-text="Please provide as much detail as possible"
            />
          </div>
          
          <template #footer>
            <BaseButton label="Cancel" variant="ghost" @click="showForm = false" />
            <BaseButton label="Send Message" variant="primary" @click="handleSubmit" />
          </template>
        </BaseModal>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal with form inputs demonstrating proper form layout and validation.',
      },
    },
  },
}

export const LoadingModal: Story = {
  render: () => ({
    components: { BaseModal, BaseButton },
    setup() {
      const showLoading = ref(false)
      const isLoading = ref(false)

      const simulateLoading = () => {
        showLoading.value = true
        isLoading.value = true

        // Simulate API call
        setTimeout(() => {
          isLoading.value = false
        }, 3000)
      }

      return {
        showLoading,
        isLoading,
        simulateLoading,
      }
    },
    template: `
      <div>
        <BaseButton label="Show Loading Modal" @click="simulateLoading" />
        
        <BaseModal 
          v-model="showLoading" 
          size="medium" 
          title="Processing Request"
          subtitle="Please wait while we process your information"
          :loading="isLoading"
          :prevent-close="isLoading"
          :show-close-button="false"
        >
          <p>Your request is being processed. This may take a few moments.</p>
          <p>{{ isLoading ? 'Processing...' : 'Complete! You can now close this modal.' }}</p>
          
          <template #footer>
            <BaseButton 
              label="Close" 
              variant="primary" 
              :disabled="isLoading"
              @click="showLoading = false" 
            />
          </template>
        </BaseModal>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal with loading state that prevents closing until operation completes.',
      },
    },
  },
}

export const ScrollableModal: Story = {
  render: () => ({
    components: { BaseModal, BaseButton },
    setup() {
      const showScrollable = ref(false)

      const longContent = ref(`
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        
        Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
        
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
        
        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.
      `)

      return {
        showScrollable,
        longContent,
      }
    },
    template: `
      <div>
        <BaseButton label="Open Scrollable Modal" @click="showScrollable = true" />
        
        <BaseModal 
          v-model="showScrollable" 
          size="medium" 
          title="Terms of Service"
          subtitle="Please read through our terms and conditions"
          :scrollable="true"
        >
          <div style="white-space: pre-line;">{{ longContent }}</div>
          
          <template #footer>
            <BaseButton label="Decline" variant="ghost" @click="showScrollable = false" />
            <BaseButton label="Accept" variant="primary" @click="showScrollable = false" />
          </template>
        </BaseModal>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal with scrollable content that maintains header and footer visibility.',
      },
    },
  },
}

export const NonClosableModal: Story = {
  render: () => ({
    components: { BaseModal, BaseButton },
    setup() {
      const showNonClosable = ref(false)
      const allowClose = ref(false)

      const startProcess = () => {
        showNonClosable.value = true
        allowClose.value = false

        // Simulate process completion
        setTimeout(() => {
          allowClose.value = true
        }, 5000)
      }

      return {
        showNonClosable,
        allowClose,
        startProcess,
      }
    },
    template: `
      <div>
        <BaseButton label="Start Critical Process" @click="startProcess" />
        
        <BaseModal 
          v-model="showNonClosable" 
          size="small" 
          title="Critical Process Running"
          subtitle="Please do not close this window"
          :prevent-close="!allowClose"
          :close-on-backdrop="allowClose"
          :close-on-escape="allowClose"
          :show-close-button="allowClose"
        >
          <p>A critical process is running that cannot be interrupted.</p>
          <p v-if="!allowClose">Please wait for the process to complete...</p>
          <p v-else style="color: #10b981;">✓ Process completed! You may now close this modal.</p>
          
          <template #footer>
            <BaseButton 
              label="Close" 
              variant="primary" 
              :disabled="!allowClose"
              @click="showNonClosable = false" 
            />
          </template>
        </BaseModal>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Modal that prevents closing until a process completes, demonstrating the preventClose prop.',
      },
    },
  },
}

export const ModalWithCustomHeader: Story = {
  render: () => ({
    components: { BaseModal, BaseButton },
    setup() {
      const showCustom = ref(false)

      return {
        showCustom,
      }
    },
    template: `
      <div>
        <BaseButton label="Open Custom Header Modal" @click="showCustom = true" />
        
        <BaseModal v-model="showCustom" size="medium">
          <template #header>
            <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                V
              </div>
              <div>
                <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Vana Calendar</h2>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Smart scheduling for productive teams</p>
              </div>
            </div>
            <button
              style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; border-radius: 6px; cursor: pointer; color: #6b7280;"
              @click="showCustom = false"
            >
              ×
            </button>
          </template>
          
          <p>This modal demonstrates a custom header with branding and custom close button.</p>
          <p>The header slot gives you complete control over the header content and layout.</p>
          
          <template #footer>
            <BaseButton label="Get Started" variant="primary" @click="showCustom = false" />
          </template>
        </BaseModal>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modal with completely custom header content using the header slot.',
      },
    },
  },
}
