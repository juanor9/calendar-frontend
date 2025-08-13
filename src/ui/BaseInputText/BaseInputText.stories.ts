import type { Meta, StoryObj } from '@storybook/vue3'
// Removed storybook/test import - not available
import { ref, type Ref } from 'vue'
import BaseInputText from './BaseInputText.vue'

const meta = {
  title: 'UI/Components/Base Input Text',
  component: BaseInputText,
  parameters: {
    docs: {
      description: {
        component: `
# Base Input Text Component

A comprehensive text input component for form interfaces, search functionality, and data entry following Vana's design system principles.

## Purpose

The BaseInputText component serves as a foundational element for:
- Form data entry and validation
- Search interfaces and filtering
- User authentication flows
- Content editing and management
- Settings and configuration panels
- Real-time data input with validation feedback

## Usage Context

This component is commonly used in:
- Registration and login forms
- Profile editing interfaces
- Search and filter panels
- Content creation forms
- Administrative dashboards
- Data collection interfaces

## Styling Methodology

Built using BEM methodology with SCSS variables from Vana's design system:
- Consistent spacing using \`$spacing-*\` tokens
- Color variants following \`$interactive-*\`, \`$success-*\`, \`$warning-*\`, \`$error-*\` palettes
- Typography using \`$font-family-ui\` and responsive font sizes
- Border radius with \`$radius-md\` for modern appearance
- Smooth transitions with \`$transition-all\` for interactive states
- Focus ring using \`$focus-ring\` for accessibility

## Design System Integration

Fully integrated with Vana's design tokens:
- **Sizes**: Small (32px), medium (40px), large (48px) heights
- **Types**: Text, email, password, search, url, tel for different input contexts
- **Variants**: Default with clean styling, floating label for modern UX
- **States**: Default, focused, error, success, warning, disabled, readonly
- **Icons**: Left and right icon support with click handlers
- **Validation**: Real-time feedback with helper text and error messages

## Accessibility Notes

- Uses semantic HTML input elements with proper type attributes
- Provides comprehensive ARIA support with describedby relationships
- Maintains proper focus management and keyboard navigation
- Supports screen reader compatibility with role and live region attributes
- Includes proper labeling for required/optional field indicators
- Uses aria-invalid for error state communication
        `,
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-design-system-inputs'
    }
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above or as floating label'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when input is empty'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'url', 'tel'],
      description: 'HTML input type for validation and mobile keyboard optimization'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Input size affecting height and padding'
    },
    variant: {
      control: 'select',
      options: ['default', 'floating'],
      description: 'Visual variant with floating label animation'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input interaction and reduce opacity'
    },
    readonly: {
      control: 'boolean',
      description: 'Make input non-editable while maintaining focus'
    },
    required: {
      control: 'boolean',
      description: 'Mark field as required with visual indicator'
    },
    optional: {
      control: 'boolean',
      description: 'Mark field as optional with visual indicator'
    },
    leftIcon: {
      control: 'text',
      description: 'CSS class for left icon (e.g., "fas fa-search")'
    },
    rightIcon: {
      control: 'text',
      description: 'CSS class for right icon (e.g., "fas fa-eye")'
    },
    rightIconClickable: {
      control: 'boolean',
      description: 'Make right icon clickable with event handler'
    },
    helpText: {
      control: 'text',
      description: 'Helper text displayed below input'
    },
    errorMessage: {
      control: 'text',
      description: 'Error message for validation feedback'
    },
    successMessage: {
      control: 'text',
      description: 'Success message for positive validation'
    },
    warningMessage: {
      control: 'text',
      description: 'Warning message for cautionary feedback'
    }
  },
  args: {
    onFocus: () => {},
    onBlur: () => {},
    onInput: () => {},
    onChange: () => {},
    onRightIconClick: () => {}
  }
} satisfies Meta<typeof BaseInputText>

export default meta
type Story = StoryObj<typeof meta>

// 1. Default Story
export const Default: Story = {
  args: {
    placeholder: 'Enter text here...'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default text input with placeholder text and medium size. This is the basic usage with minimal configuration.'
      }
    }
  }
}

// 2. WithLabel
export const WithLabel: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Input with label positioned above the field for clear identification and accessibility.'
      }
    }
  }
}

// 3. WithPlaceholder
export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Search for anything...',
    type: 'search'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Input with descriptive placeholder text providing usage hints and examples.'
      }
    }
  }
}

// 4. WithHelperText
export const WithHelperText: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'your@email.com',
    helpText: 'We\'ll use this email for account verification and notifications'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Input with helper text providing additional context and usage guidance.'
      }
    }
  }
}

// 5. Size Variants
export const Small: Story = {
  args: {
    size: 'small',
    label: 'Compact Input',
    placeholder: 'Small size input'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Small input variant (32px height) for compact interfaces and secondary forms.'
      }
    }
  }
}

export const Medium: Story = {
  args: {
    size: 'medium',
    label: 'Standard Input',
    placeholder: 'Medium size input'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Medium input variant (40px height) - the default size for most use cases.'
      }
    }
  }
}

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Prominent Input',
    placeholder: 'Large size input'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Large input variant (48px height) for prominent forms and primary actions.'
      }
    }
  }
}

// 6. Input Types
export const TextType: Story = {
  args: {
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your name'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Text input type for general text entry and free-form content.'
      }
    }
  }
}

export const EmailType: Story = {
  args: {
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@example.com'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Email input type with built-in validation and mobile keyboard optimization.'
      }
    }
  }
}

export const PasswordType: Story = {
  args: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Password input type with hidden text display for secure entry.'
      }
    }
  }
}

export const SearchType: Story = {
  args: {
    type: 'search',
    label: 'Search',
    placeholder: 'Search documents...'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Search input type with enhanced browser features and search-specific styling.'
      }
    }
  }
}

// 7. Validation States
export const Valid: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    successMessage: 'Username is available!',
    leftIcon: 'fas fa-check-circle'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('validuser123')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Valid state with success message and positive visual feedback.'
      }
    }
  }
}

export const Invalid: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    errorMessage: 'Please enter a valid email address',
    leftIcon: 'fas fa-exclamation-triangle'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('invalid-email')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Invalid state with error message and visual error indicators.'
      }
    }
  }
}

export const Loading: Story = {
  args: {
    label: 'Checking availability...',
    placeholder: 'Enter username',
    helpText: 'Validating username availability',
    rightIcon: 'fas fa-spinner fa-spin'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('checking')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Loading state with spinner icon for async validation feedback.'
      }
    }
  }
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state with reduced opacity and no interaction capabilities.'
      }
    }
  }
}

// 8. Icon Variants
export const WithLeftIcon: Story = {
  args: {
    label: 'Search Tasks',
    placeholder: 'Type to search...',
    leftIcon: 'fas fa-search',
    type: 'search'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Input with left icon for visual context and improved user experience.'
      }
    }
  }
}

export const WithRightIcon: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    rightIcon: 'fas fa-eye',
    rightIconClickable: true
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      const showPassword = ref(false)
      
      const togglePassword = () => {
        showPassword.value = !showPassword.value
        // Update reactive args
      }
      
      return { args, model, togglePassword }
    },
    template: '<BaseInputText v-model="model" v-bind="args" @right-icon-click="togglePassword" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Input with clickable right icon for interactive functionality like password visibility toggle.'
      }
    }
  }
}

// 9. Focus States
export const Focused: Story = {
  args: {
    label: 'Focused Input',
    placeholder: 'This input has focus'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('Focused content')
      const inputRef = ref(null)
      
      // Auto-focus for demonstration
      setTimeout(() => {
        // Focus demonstration removed for TypeScript compatibility
      }, 100)
      
      return { args, model, inputRef }
    },
    template: '<BaseInputText ref="inputRef" v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Focused state showing active styling with focus ring and enhanced border.'
      }
    }
  }
}

export const Blurred: Story = {
  args: {
    label: 'Standard Input',
    placeholder: 'Click to focus'
  },
  render: (args) => ({
    components: { BaseInputText },
    setup() {
      const model = ref('')
      return { args, model }
    },
    template: '<BaseInputText v-model="model" v-bind="args" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default blurred state showing standard styling without focus indicators.'
      }
    }
  }
}

// 10. WithValidation - Real-time validation
export const WithValidation: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const email = ref('')
      const emailError = ref('')
      const emailSuccess = ref('')
      
      const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.value) {
          emailError.value = ''
          emailSuccess.value = ''
        } else if (emailPattern.test(email.value)) {
          emailError.value = ''
          emailSuccess.value = 'Valid email address'
        } else {
          emailSuccess.value = ''
          emailError.value = 'Please enter a valid email address'
        }
      }
      
      return { email, emailError, emailSuccess, validateEmail }
    },
    template: `
      <BaseInputText 
        v-model="email"
        label="Email Validation"
        type="email"
        placeholder="Enter your email"
        :error-message="emailError"
        :success-message="emailSuccess"
        help-text="Type an email to see real-time validation"
        @input="validateEmail"
      />
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-time validation example showing error and success states based on user input.'
      }
    }
  }
}

// 11. TypeVariants - All types showcase
export const TypeVariants: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const textValue = ref('')
      const emailValue = ref('')
      const passwordValue = ref('')
      const searchValue = ref('')
      const urlValue = ref('')
      const telValue = ref('')
      
      return { 
        textValue, emailValue, passwordValue, 
        searchValue, urlValue, telValue 
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <BaseInputText 
          v-model="textValue"
          type="text"
          label="Text Input"
          placeholder="General text entry"
          left-icon="fas fa-font"
        />
        <BaseInputText 
          v-model="emailValue"
          type="email"
          label="Email Input"
          placeholder="user@example.com"
          left-icon="fas fa-envelope"
        />
        <BaseInputText 
          v-model="passwordValue"
          type="password"
          label="Password Input"
          placeholder="Enter password"
          left-icon="fas fa-lock"
        />
        <BaseInputText 
          v-model="searchValue"
          type="search"
          label="Search Input"
          placeholder="Search anything..."
          left-icon="fas fa-search"
        />
        <BaseInputText 
          v-model="urlValue"
          type="url"
          label="URL Input"
          placeholder="https://example.com"
          left-icon="fas fa-link"
        />
        <BaseInputText 
          v-model="telValue"
          type="tel"
          label="Phone Input"
          placeholder="+1 (555) 123-4567"
          left-icon="fas fa-phone"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all available input types with appropriate icons and placeholders.'
      }
    }
  }
}

// 12. SizeComparison
export const SizeComparison: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const smallValue = ref('Small input')
      const mediumValue = ref('Medium input')
      const largeValue = ref('Large input')
      
      return { smallValue, mediumValue, largeValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
          <BaseInputText 
            v-model="smallValue"
            size="small" 
            label="Small Size"
            placeholder="32px height"
          />
          <span style="font-size: 12px; color: #6b7280;">32px height - Compact interfaces</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
          <BaseInputText 
            v-model="mediumValue"
            size="medium" 
            label="Medium Size"
            placeholder="40px height"
          />
          <span style="font-size: 12px; color: #6b7280;">40px height - Default size</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
          <BaseInputText 
            v-model="largeValue"
            size="large" 
            label="Large Size"
            placeholder="48px height"
          />
          <span style="font-size: 12px; color: #6b7280;">48px height - Prominent displays</span>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Size comparison showing all three available sizes with their respective heights and use cases.'
      }
    }
  }
}

// 13. StateShowcase - All states together
export const StateShowcase: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const defaultValue = ref('')
      const focusedValue = ref('Focused input')
      const successValue = ref('valid@email.com')
      const errorValue = ref('invalid-email')
      const warningValue = ref('warning@example.com')
      const disabledValue = ref('Disabled content')
      const readonlyValue = ref('Readonly content')
      
      return { 
        defaultValue, focusedValue, successValue, 
        errorValue, warningValue, disabledValue, readonlyValue 
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <BaseInputText 
          v-model="defaultValue"
          label="Default State"
          placeholder="Normal input state"
        />
        <BaseInputText 
          v-model="successValue"
          label="Success State"
          success-message="Email is valid"
          left-icon="fas fa-check-circle"
        />
        <BaseInputText 
          v-model="errorValue"
          label="Error State"
          error-message="Invalid email format"
          left-icon="fas fa-exclamation-triangle"
        />
        <BaseInputText 
          v-model="warningValue"
          label="Warning State"
          warning-message="Email domain not recommended"
          left-icon="fas fa-exclamation-circle"
        />
        <BaseInputText 
          v-model="disabledValue"
          label="Disabled State"
          :disabled="true"
        />
        <BaseInputText 
          v-model="readonlyValue"
          label="Readonly State"
          :readonly="true"
          help-text="This field cannot be edited"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive showcase of all input states including validation feedback and interaction states.'
      }
    }
  }
}

// 14. ValidationExamples - Success, error, warning
export const ValidationExamples: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const successEmail = ref('user@company.com')
      const errorEmail = ref('invalid-email')
      const warningEmail = ref('user@tempmail.com')
      
      return { successEmail, errorEmail, warningEmail }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <h4 style="margin: 0 0 12px 0; color: #166534; font-size: 14px; font-weight: 600;">✅ Success Validation</h4>
          <BaseInputText 
            v-model="successEmail"
            label="Business Email"
            type="email"
            success-message="Valid business email address"
            left-icon="fas fa-check-circle"
            help-text="Email validated successfully"
          />
        </div>
        
        <div style="padding: 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
          <h4 style="margin: 0 0 12px 0; color: #dc2626; font-size: 14px; font-weight: 600;">❌ Error Validation</h4>
          <BaseInputText 
            v-model="errorEmail"
            label="Email Address"
            type="email"
            error-message="Please enter a valid email address"
            left-icon="fas fa-exclamation-triangle"
            help-text="Email format is incorrect"
          />
        </div>
        
        <div style="padding: 16px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px;">
          <h4 style="margin: 0 0 12px 0; color: #d97706; font-size: 14px; font-weight: 600;">⚠️ Warning Validation</h4>
          <BaseInputText 
            v-model="warningEmail"
            label="Email Address"
            type="email"
            warning-message="Temporary email services may not receive all notifications"
            left-icon="fas fa-exclamation-circle"
            help-text="Consider using a permanent email address"
          />
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Validation feedback examples showing success, error, and warning states with contextual messaging.'
      }
    }
  }
}

// 15. InteractiveDemo - Typing simulation
export const InteractiveDemo: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const searchValue = ref('')
      const emailValue = ref('')
      const passwordValue = ref('')
      const passwordVisible = ref(false)
      
      const clearSearch = () => {
        searchValue.value = ''
      }
      
      const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value
      }
      
      // Demo typing simulation
      const simulateTyping = (targetRef: Ref<string>, text: string, delay = 100) => {
        let i = 0
        const timer = setInterval(() => {
          if (i < text.length) {
            targetRef.value += text.charAt(i)
            i++
          } else {
            clearInterval(timer)
          }
        }, delay)
      }
      
      const startDemo = () => {
        searchValue.value = ''
        emailValue.value = ''
        passwordValue.value = ''
        
        setTimeout(() => simulateTyping(searchValue, 'Design systems', 150), 500)
        setTimeout(() => simulateTyping(emailValue, 'user@vana.com', 120), 2000)
        setTimeout(() => simulateTyping(passwordValue, 'SecurePass123', 100), 4000)
      }
      
      return { 
        searchValue, emailValue, passwordValue, passwordVisible,
        clearSearch, togglePasswordVisibility, startDemo
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; justify-content: center; margin-bottom: 16px;">
          <button 
            @click="startDemo"
            style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;"
          >
            ▶️ Start Demo
          </button>
        </div>
        
        <BaseInputText 
          v-model="searchValue"
          label="Search Projects"
          type="search"
          placeholder="Type to search..."
          left-icon="fas fa-search"
          right-icon="fas fa-times"
          :right-icon-clickable="searchValue.length > 0"
          @right-icon-click="clearSearch"
          help-text="Search across all your projects and files"
        />
        
        <BaseInputText 
          v-model="emailValue"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          left-icon="fas fa-envelope"
          help-text="We'll send you a verification link"
        />
        
        <BaseInputText 
          v-model="passwordValue"
          label="Password"
          :type="passwordVisible ? 'text' : 'password'"
          placeholder="Enter secure password"
          left-icon="fas fa-lock"
          :right-icon="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"
          :right-icon-clickable="true"
          @right-icon-click="togglePasswordVisibility"
          help-text="Use at least 8 characters with mixed case and numbers"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration with typing simulation and functional icon interactions.'
      }
    }
  }
}

// 16. AccessibilityDemo - Screen reader support
export const AccessibilityDemo: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const requiredField = ref('')
      const optionalField = ref('')
      const describedField = ref('')
      
      return { requiredField, optionalField, describedField }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 14px; font-weight: 600;">♿ Accessibility Features</h4>
          <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b; line-height: 1.4;">
            These inputs include proper ARIA attributes, semantic HTML, and screen reader support.
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <BaseInputText 
              v-model="requiredField"
              label="Required Field"
              placeholder="This field is required"
              :required="true"
              aria-label="Required email address field"
              help-text="Required fields are marked with an asterisk (*)"
            />
            
            <BaseInputText 
              v-model="optionalField"
              label="Optional Field"
              placeholder="This field is optional"
              :optional="true"
              aria-label="Optional phone number field"
              help-text="Optional fields are clearly labeled"
            />
            
            <BaseInputText 
              v-model="describedField"
              label="Well-described Field"
              placeholder="Complex input with description"
              help-text="This field has comprehensive ARIA descriptions for screen readers"
              aria-described-by="additional-description"
              success-message="All accessibility attributes are properly configured"
            />
          </div>
          
          <div id="additional-description" style="font-size: 12px; color: #64748b; margin-top: 8px;">
            Additional context: This field demonstrates proper ARIA relationships and semantic HTML structure.
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility demonstration showing proper ARIA attributes, semantic HTML, and screen reader compatibility.'
      }
    }
  }
}

// 17. InContext - Real usage examples
export const InContext: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      // Login Form
      const loginEmail = ref('')
      const loginPassword = ref('')
      
      // Registration Form
      const regFirstName = ref('')
      const regLastName = ref('')
      const regEmail = ref('')
      const regPassword = ref('')
      const regConfirmPassword = ref('')
      
      // Search Interface
      const searchQuery = ref('')
      const filterCategory = ref('')
      
      // Profile Settings
      const profileName = ref('John Doe')
      const profileBio = ref('Product designer passionate about user experience')
      const profileWebsite = ref('https://johndoe.design')
      
      // Content Editing
      const postTitle = ref('')
      const postSlug = ref('')
      const postTags = ref('')
      
      const clearSearch = () => {
        searchQuery.value = ''
      }
      
      return { 
        loginEmail, loginPassword, regFirstName, regLastName, regEmail, 
        regPassword, regConfirmPassword, searchQuery, filterCategory,
        profileName, profileBio, profileWebsite, postTitle, postSlug, postTags,
        clearSearch
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 800px;">
        
        <!-- Login Form Context -->
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">🔐 Login Form</h3>
          <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
            <BaseInputText 
              v-model="loginEmail"
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              left-icon="fas fa-envelope"
              :required="true"
              help-text="Enter your registered email address"
            />
            <BaseInputText 
              v-model="loginPassword"
              label="Password"
              type="password"
              placeholder="Enter your password"
              left-icon="fas fa-lock"
              right-icon="fas fa-eye"
              :right-icon-clickable="true"
              :required="true"
            />
          </div>
        </div>

        <!-- Registration Form Context -->
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">📝 Registration Form</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 600px;">
            <BaseInputText 
              v-model="regFirstName"
              label="First Name"
              placeholder="John"
              :required="true"
            />
            <BaseInputText 
              v-model="regLastName"
              label="Last Name"
              placeholder="Doe"
              :required="true"
            />
            <div style="grid-column: 1 / -1;">
              <BaseInputText 
                v-model="regEmail"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                left-icon="fas fa-envelope"
                :required="true"
                help-text="We'll send verification to this email"
              />
            </div>
            <BaseInputText 
              v-model="regPassword"
              label="Password"
              type="password"
              placeholder="Create password"
              left-icon="fas fa-lock"
              :required="true"
              help-text="At least 8 characters"
            />
            <BaseInputText 
              v-model="regConfirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              left-icon="fas fa-lock"
              :required="true"
            />
          </div>
        </div>

        <!-- Search Interface Context -->
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">🔍 Search Interface</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <BaseInputText 
              v-model="searchQuery"
              label="Search Everything"
              type="search"
              size="large"
              placeholder="Search projects, files, people..."
              left-icon="fas fa-search"
              right-icon="fas fa-times"
              :right-icon-clickable="searchQuery.length > 0"
              @right-icon-click="clearSearch"
            />
            <div style="display: flex; gap: 16px;">
              <BaseInputText 
                v-model="filterCategory"
                label="Filter by Category"
                placeholder="All categories"
                left-icon="fas fa-filter"
                size="small"
              />
            </div>
          </div>
        </div>

        <!-- Profile Settings Context -->
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">👤 Profile Settings</h3>
          <div style="display: flex; flex-direction: column; gap: 16px; max-width: 500px;">
            <BaseInputText 
              v-model="profileName"
              label="Display Name"
              placeholder="Your display name"
              left-icon="fas fa-user"
              help-text="This name will be visible to other users"
            />
            <BaseInputText 
              v-model="profileWebsite"
              label="Website"
              type="url"
              placeholder="https://yourwebsite.com"
              left-icon="fas fa-link"
              :optional="true"
              help-text="Share your portfolio or personal website"
            />
          </div>
        </div>

        <!-- Content Editing Context -->
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">✍️ Content Creation</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <BaseInputText 
              v-model="postTitle"
              label="Post Title"
              placeholder="Enter an engaging title..."
              :required="true"
              :maxlength="100"
              help-text="Keep it concise and descriptive"
            />
            <BaseInputText 
              v-model="postSlug"
              label="URL Slug"
              type="url"
              placeholder="post-url-slug"
              left-icon="fas fa-link"
              help-text="This will be part of your post URL"
            />
            <BaseInputText 
              v-model="postTags"
              label="Tags"
              placeholder="design, ui, ux (comma-separated)"
              left-icon="fas fa-tags"
              :optional="true"
              help-text="Add tags to help others discover your content"
            />
          </div>
        </div>

        <!-- Filter Panel Context -->
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafafa;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1f2937;">🎛️ Advanced Filters</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <BaseInputText 
              label="Min Price"
              placeholder="$0"
              size="small"
              left-icon="fas fa-dollar-sign"
            />
            <BaseInputText 
              label="Max Price"
              placeholder="$1000"
              size="small"
              left-icon="fas fa-dollar-sign"
            />
            <BaseInputText 
              label="Location"
              placeholder="Any location"
              size="small"
              left-icon="fas fa-map-marker-alt"
            />
            <BaseInputText 
              label="Date Range"
              placeholder="Any time"
              size="small"
              left-icon="fas fa-calendar"
            />
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples showing BaseInputText in common contexts: login forms, registration, search interfaces, profile settings, content editing, and filter panels.'
      }
    }
  }
}