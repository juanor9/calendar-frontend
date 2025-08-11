import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import BaseInputText from './BaseInputText.vue'

const meta: Meta<typeof BaseInputText> = {
  title: 'UI/Forms/Base Input Text',
  component: BaseInputText,
  parameters: {
    docs: {
      description: {
        component:
          'A flexible text input component with validation states, icons, floating labels, and comprehensive accessibility features. Built following the Vana design system with BEM methodology.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-forms',
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the input field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when input is empty',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'url', 'tel'],
      description: 'HTML input type',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the input',
    },
    variant: {
      control: 'select',
      options: ['default', 'floating'],
      description: 'Visual variant - floating label animates on focus',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input field',
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the input read-only',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required with asterisk',
    },
    optional: {
      control: 'boolean',
      description: 'Shows optional indicator in label',
    },
    leftIcon: {
      control: 'text',
      description: 'CSS class for left icon (e.g., "fas fa-user")',
    },
    rightIcon: {
      control: 'text',
      description: 'CSS class for right icon (e.g., "fas fa-eye")',
    },
    rightIconClickable: {
      control: 'boolean',
      description: 'Makes the right icon clickable',
    },
    helpText: {
      control: 'text',
      description: 'Help text shown below the input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message with red styling',
    },
    successMessage: {
      control: 'text',
      description: 'Success message with green styling',
    },
    warningMessage: {
      control: 'text',
      description: 'Warning message with yellow styling',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BaseInputText>

export const Default: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    size: 'medium',
    variant: 'default',
  },
  render: args => ({
    components: { BaseInputText },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <BaseInputText v-bind="args" v-model="value" />
      <p style="margin-top: 16px; color: #6b7280; font-size: 14px;">
        Current value: "{{ value }}"
      </p>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const defaultValue = ref('')
      const floatingValue = ref('')
      return { defaultValue, floatingValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h4>Default Variant</h4>
          <BaseInputText
            v-model="defaultValue"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            variant="default"
          />
        </div>
        <div>
          <h4>Floating Label Variant</h4>
          <BaseInputText
            v-model="floatingValue"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            variant="floating"
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Different visual variants: default with label above, and floating with animated label.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const smallValue = ref('')
      const mediumValue = ref('')
      const largeValue = ref('')
      return { smallValue, mediumValue, largeValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <BaseInputText
          v-model="smallValue"
          label="Small Input"
          placeholder="Small size input"
          size="small"
        />
        <BaseInputText
          v-model="mediumValue"
          label="Medium Input"
          placeholder="Medium size input (default)"
          size="medium"
        />
        <BaseInputText
          v-model="largeValue"
          label="Large Input"
          placeholder="Large size input"
          size="large"
        />
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

export const WithIcons: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const emailValue = ref('')
      const passwordValue = ref('')
      const searchValue = ref('')
      const phoneValue = ref('')

      const togglePasswordVisibility = () => {
        console.log('Toggle password visibility')
      }

      const clearSearch = () => {
        searchValue.value = ''
      }

      return {
        emailValue,
        passwordValue,
        searchValue,
        phoneValue,
        togglePasswordVisibility,
        clearSearch,
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <BaseInputText
          v-model="emailValue"
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          left-icon="fas fa-envelope"
          help-text="We'll use this email to send you notifications"
        />
        
        <BaseInputText
          v-model="passwordValue"
          label="Password"
          type="password"
          placeholder="Enter your password"
          left-icon="fas fa-lock"
          right-icon="fas fa-eye"
          :right-icon-clickable="true"
          @right-icon-click="togglePasswordVisibility"
          help-text="Click the eye icon to toggle visibility"
        />
        
        <BaseInputText
          v-model="searchValue"
          label="Search Tasks"
          type="search"
          placeholder="Type to search..."
          left-icon="fas fa-search"
          right-icon="fas fa-times"
          :right-icon-clickable="true"
          @right-icon-click="clearSearch"
        />
        
        <BaseInputText
          v-model="phoneValue"
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          left-icon="fas fa-phone"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Examples with left icons, right icons, and clickable right icons.',
      },
    },
  },
}

export const ValidationStates: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const successValue = ref('john.doe@company.com')
      const warningValue = ref('short')
      const errorValue = ref('invalid-email')
      const defaultValue = ref('')

      return { successValue, warningValue, errorValue, defaultValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <BaseInputText
          v-model="defaultValue"
          label="Username"
          placeholder="Enter your username"
          help-text="Choose a unique username for your account"
        />
        
        <BaseInputText
          v-model="successValue"
          label="Email Address"
          type="email"
          success-message="Email format is valid and available"
          left-icon="fas fa-envelope"
        />
        
        <BaseInputText
          v-model="warningValue"
          label="Password"
          type="password"
          warning-message="Password is too short. Consider using at least 8 characters."
          left-icon="fas fa-lock"
        />
        
        <BaseInputText
          v-model="errorValue"
          label="Email Address"
          type="email"
          error-message="Please enter a valid email address"
          left-icon="fas fa-envelope"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different validation states with appropriate colors and messaging.',
      },
    },
  },
}

export const RequiredAndOptional: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const requiredValue = ref('')
      const optionalValue = ref('')
      return { requiredValue, optionalValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <BaseInputText
          v-model="requiredValue"
          label="Full Name"
          placeholder="Enter your full name"
          :required="true"
          help-text="This field is required for account creation"
        />
        
        <BaseInputText
          v-model="optionalValue"
          label="Company Name"
          placeholder="Enter your company name"
          :optional="true"
          help-text="You can add this information later"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Required fields show an asterisk, optional fields show an optional indicator.',
      },
    },
  },
}

export const DisabledAndReadonly: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const disabledValue = ref('This input is disabled')
      const readonlyValue = ref('This input is read-only')
      return { disabledValue, readonlyValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <BaseInputText
          v-model="disabledValue"
          label="Disabled Input"
          :disabled="true"
          help-text="This field is currently disabled"
        />
        
        <BaseInputText
          v-model="readonlyValue"
          label="Read-only Input"
          :readonly="true"
          help-text="This field is read-only but can be focused"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Disabled inputs cannot be interacted with, read-only inputs can be focused but not edited.',
      },
    },
  },
}

export const InputTypes: Story = {
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
        textValue,
        emailValue,
        passwordValue,
        searchValue,
        urlValue,
        telValue,
      }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <BaseInputText
          v-model="textValue"
          label="Text Input"
          type="text"
          placeholder="Regular text input"
        />
        
        <BaseInputText
          v-model="emailValue"
          label="Email Input"
          type="email"
          placeholder="user@example.com"
          left-icon="fas fa-envelope"
        />
        
        <BaseInputText
          v-model="passwordValue"
          label="Password Input"
          type="password"
          placeholder="Enter password"
          left-icon="fas fa-lock"
        />
        
        <BaseInputText
          v-model="searchValue"
          label="Search Input"
          type="search"
          placeholder="Search..."
          left-icon="fas fa-search"
        />
        
        <BaseInputText
          v-model="urlValue"
          label="URL Input"
          type="url"
          placeholder="https://example.com"
          left-icon="fas fa-link"
        />
        
        <BaseInputText
          v-model="telValue"
          label="Phone Input"
          type="tel"
          placeholder="+1 (555) 123-4567"
          left-icon="fas fa-phone"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Different HTML5 input types with appropriate icons and placeholders.',
      },
    },
  },
}

export const LoginForm: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const email = ref('')
      const password = ref('')
      const showPassword = ref(false)
      const emailError = ref('')
      const passwordError = ref('')

      const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value
      }

      const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.value) {
          emailError.value = 'Email is required'
        } else if (!emailRegex.test(email.value)) {
          emailError.value = 'Please enter a valid email address'
        } else {
          emailError.value = ''
        }
      }

      const validatePassword = () => {
        if (!password.value) {
          passwordError.value = 'Password is required'
        } else if (password.value.length < 6) {
          passwordError.value = 'Password must be at least 6 characters'
        } else {
          passwordError.value = ''
        }
      }

      return {
        email,
        password,
        showPassword,
        emailError,
        passwordError,
        togglePasswordVisibility,
        validateEmail,
        validatePassword,
      }
    },
    template: `
      <div style="max-width: 400px; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px; background: white;">
        <h3 style="margin: 0 0 24px 0; text-align: center;">Sign In</h3>
        
        <form style="display: flex; flex-direction: column; gap: 24px;">
          <BaseInputText
            v-model="email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            :required="true"
            left-icon="fas fa-envelope"
            :error-message="emailError"
            @blur="validateEmail"
            @input="emailError = ''"
          />
          
          <BaseInputText
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            :required="true"
            left-icon="fas fa-lock"
            :right-icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            :right-icon-clickable="true"
            :error-message="passwordError"
            @right-icon-click="togglePasswordVisibility"
            @blur="validatePassword"
            @input="passwordError = ''"
          />
          
          <button 
            type="submit" 
            style="padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;"
            :disabled="!email || !password"
          >
            Sign In
          </button>
        </form>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Complete login form example with validation, password visibility toggle, and proper UX patterns.',
      },
    },
  },
}

export const SearchWithAutocomplete: Story = {
  render: () => ({
    components: { BaseInputText },
    setup() {
      const searchQuery = ref('')
      const suggestions = ref([
        'Design System Review',
        'Team Planning Meeting',
        'User Research Session',
        'Product Demo',
        'Code Review',
      ])

      const filteredSuggestions = ref<string[]>([])

      const handleSearch = () => {
        if (searchQuery.value.length > 0) {
          filteredSuggestions.value = suggestions.value.filter(item =>
            item.toLowerCase().includes(searchQuery.value.toLowerCase())
          )
        } else {
          filteredSuggestions.value = []
        }
      }

      const clearSearch = () => {
        searchQuery.value = ''
        filteredSuggestions.value = []
      }

      return {
        searchQuery,
        filteredSuggestions,
        handleSearch,
        clearSearch,
      }
    },
    template: `
      <div style="max-width: 500px; position: relative;">
        <BaseInputText
          v-model="searchQuery"
          label="Search Tasks"
          type="search"
          placeholder="Type to search tasks..."
          size="large"
          left-icon="fas fa-search"
          :right-icon="searchQuery ? 'fas fa-times' : undefined"
          :right-icon-clickable="!!searchQuery"
          help-text="Search through your tasks and meetings"
          @input="handleSearch"
          @right-icon-click="clearSearch"
        />
        
        <div 
          v-if="filteredSuggestions.length > 0"
          style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #d1d5db; border-radius: 8px; margin-top: 4px; max-height: 200px; overflow-y: auto; z-index: 10; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
        >
          <div
            v-for="suggestion in filteredSuggestions"
            :key="suggestion"
            style="padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6;"
            @click="searchQuery = suggestion; filteredSuggestions = []"
          >
            {{ suggestion }}
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Search input with autocomplete functionality and clear button.',
      },
    },
  },
}
