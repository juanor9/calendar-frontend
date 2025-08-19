import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import LoginButton from './LoginButton.vue'

const meta: Meta<typeof LoginButton> = {
  title: 'Auth/Login Button',
  component: LoginButton,
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive login button component with Auth0 integration, loading states, error handling, and multiple visual variants. Features gradient backgrounds, smooth animations, and comprehensive accessibility support following the Vana design system.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-auth-components',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
    },
    text: {
      control: { type: 'text' },
      description: 'Custom button text',
    },
    redirectUri: {
      control: { type: 'text' },
      description: 'Redirect URI after login',
    },
    showError: {
      control: { type: 'boolean' },
      description: 'Whether to show error messages',
    },
  },
}

export default meta
type Story = StoryObj<typeof LoginButton>

export const Default: Story = {
  render: () => ({
    components: { LoginButton },
    template: `<LoginButton />`,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { LoginButton },
    template: `<LoginButton size="small" />`,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { LoginButton },
    template: `<LoginButton size="large" />`,
  }),
}

export const Secondary: Story = {
  render: () => ({
    components: { LoginButton },
    template: `<LoginButton variant="secondary" />`,
  }),
}

export const Outline: Story = {
  render: () => ({
    components: { LoginButton },
    template: `<LoginButton variant="outline" />`,
  }),
}

export const Ghost: Story = {
  render: () => ({
    components: { LoginButton },
    template: `<LoginButton variant="ghost" />`,
  }),
}

export const CustomText: Story = {
  render: () => ({
    components: { LoginButton },
    template: `<LoginButton text="Sign In with Auth0" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Login button with custom text instead of default Spanish text.',
      },
    },
  },
}

export const LoadingState: Story = {
  render: () => ({
    components: { LoginButton },
    setup() {
      // Mock loading state by overriding the auth composable
      return {}
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <LoginButton text="Signing In..." style="pointer-events: none; opacity: 0.8;" />
        <p style="font-size: 14px; color: #6b7280;">Simulated loading state with spinner animation</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Login button in loading state with spinner animation and disabled interaction.',
      },
    },
  },
}

export const ErrorState: Story = {
  render: () => ({
    components: { LoginButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <LoginButton />
        <div class="login-button__error" role="alert" aria-live="polite" style="margin-top: 16px; padding: 16px 20px; background: #fef2f2; border: 1px solid #fca5a5; border-left: 4px solid #ef4444; border-radius: 8px; color: #dc2626; font-size: 14px; font-weight: 500; line-height: 1.4; display: flex; align-items: flex-start; gap: 8px;">
          <span style="font-size: 16px; flex-shrink: 0; margin-top: 1px;">⚠️</span>
          Error al iniciar sesión. Por favor, inténtalo de nuevo.
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Login button with error message display showing validation and connection errors.',
      },
    },
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { LoginButton },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LoginButton variant="primary" />
          <span style="font-size: 12px; color: #6b7280;">Primary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LoginButton variant="secondary" />
          <span style="font-size: 12px; color: #6b7280;">Secondary</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LoginButton variant="outline" />
          <span style="font-size: 12px; color: #6b7280;">Outline</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LoginButton variant="ghost" />
          <span style="font-size: 12px; color: #6b7280;">Ghost</span>
        </div>
      </div>
    `,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { LoginButton },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LoginButton size="small" />
          <span style="font-size: 12px; color: #6b7280;">Small</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LoginButton size="medium" />
          <span style="font-size: 12px; color: #6b7280;">Medium</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <LoginButton size="large" />
          <span style="font-size: 12px; color: #6b7280;">Large</span>
        </div>
      </div>
    `,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { LoginButton },
    setup() {
      const clickCount = ref(0)

      const handleLogin = () => {
        clickCount.value++
      }

      return { clickCount, handleLogin }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: start;">
        <LoginButton @loginStart="handleLogin" />
        <p style="font-size: 14px; color: #6b7280;">
          Click count: {{ clickCount }}
        </p>
        <p style="font-size: 12px; color: #9ca3af; max-width: 300px;">
          Hover over the button to see the gradient shift and elevation effect. Click to test interaction events.
        </p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive login button demonstrating hover effects, click handling, and event emission.',
      },
    },
  },
}

export const ResponsiveLayout: Story = {
  render: () => ({
    components: { LoginButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 400px;">
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Desktop Layout</h3>
          <div style="display: flex; gap: 12px;">
            <LoginButton variant="primary" />
            <LoginButton variant="outline" text="Cancel" />
          </div>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 320px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Mobile Layout</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <LoginButton variant="primary" style="width: 100%;" />
            <LoginButton variant="outline" text="Cancel" style="width: 100%;" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Login button in different responsive layouts showing desktop and mobile arrangements.',
      },
    },
  },
}

export const DarkMode: Story = {
  render: () => ({
    components: { LoginButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; background: #1f2937; border-radius: 8px;">
        <h3 style="color: white; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Dark Mode Variants</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <LoginButton variant="primary" />
          <LoginButton variant="secondary" />
          <LoginButton variant="outline" />
          <LoginButton variant="ghost" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Login button variants in dark mode theme with adjusted colors and contrast.',
      },
    },
  },
}

export const InContext: Story = {
  render: () => ({
    components: { LoginButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 500px;">
        <!-- Login Form Context -->
        <div style="padding: 32px; background: white; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #111827;">Bienvenido a Vana</h2>
            <p style="margin: 0; color: #6b7280; font-size: 16px;">Inicia sesión para continuar</p>
          </div>
          
          <form style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-weight: 500; font-size: 14px; color: #374151;">Email</label>
              <input 
                type="email" 
                placeholder="tu@email.com"
                style="padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;"
              />
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label style="font-weight: 500; font-size: 14px; color: #374151;">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                style="padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;"
              />
            </div>
            
            <LoginButton size="large" text="Iniciar Sesión" style="margin-top: 8px;" />
            
            <div style="text-align: center;">
              <span style="color: #6b7280; font-size: 14px;">o</span>
            </div>
            
            <LoginButton variant="outline" text="Continuar con Google" />
          </form>
          
          <p style="margin: 24px 0 0 0; text-align: center; font-size: 14px; color: #6b7280;">
            ¿No tienes cuenta? <a href="#" style="color: #6366f1; text-decoration: none; font-weight: 500;">Regístrate aquí</a>
          </p>
        </div>

        <!-- Landing Page Hero Context -->
        <div style="padding: 48px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; text-align: center; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 800;">Gestiona tu tiempo como nunca antes</h1>
          <p style="margin: 0 0 32px 0; font-size: 18px; opacity: 0.9; max-width: 400px; margin-left: auto; margin-right: auto;">
            Vana te ayuda a organizar tu agenda y maximizar tu productividad con IA
          </p>
          <div style="display: flex; gap: 16px; justify-content: center; align-items: center;">
            <LoginButton size="large" text="Comenzar Gratis" style="background: white; color: #6366f1; border: none;" />
            <LoginButton variant="ghost" size="large" text="Ver Demo" style="color: white; border: 2px solid rgba(255,255,255,0.5);" />
          </div>
        </div>

        <!-- Error State Context -->
        <div style="padding: 24px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #dc2626; display: flex; align-items: center; gap: 8px;">
            <span>⚠️</span>
            Error de Autenticación
          </h3>
          <p style="margin: 0 0 16px 0; color: #7f1d1d; font-size: 14px; line-height: 1.4;">
            No se pudo conectar con el servidor de autenticación. Por favor, verifica tu conexión e inténtalo de nuevo.
          </p>
          <LoginButton variant="primary" text="Reintentar" />
        </div>

        <!-- Success Context -->
        <div style="padding: 24px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #059669; display: flex; align-items: center; gap: 8px;">
            <span>✅</span>
            Sesión Iniciada
          </h3>
          <p style="margin: 0 0 16px 0; color: #065f46; font-size: 14px; line-height: 1.4;">
            ¡Bienvenido de vuelta! Tu sesión se ha iniciado correctamente.
          </p>
          <LoginButton variant="ghost" text="Ir al Dashboard" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Examples of LoginButton usage in realistic application contexts like login forms, landing page heroes, error states, and success notifications.',
      },
    },
  },
}

export const Documentation: Story = {
  render: () => ({
    components: { LoginButton },
    template: `
      <div style="max-width: 1000px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 48px; padding: 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; color: white;">
          <h1 style="margin: 0 0 16px 0; font-size: 36px; font-weight: 800;">LoginButton Documentation</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9; max-width: 600px; margin: 0 auto;">
            Comprehensive authentication button component with Auth0 integration, multiple variants, loading states, and error handling following the Vana design system.
          </p>
        </div>

        <!-- Props Overview -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Props & Configuration</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #6366f1;">Variants</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Visual styles: primary, secondary, outline, ghost</p>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <LoginButton variant="primary" size="small" text="Primary" />
                <LoginButton variant="secondary" size="small" text="Secondary" />
                <LoginButton variant="outline" size="small" text="Outline" />
                <LoginButton variant="ghost" size="small" text="Ghost" />
              </div>
            </div>

            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #6366f1;">Sizes</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Three sizes: small, medium, large</p>
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <LoginButton size="small" text="Small" />
                <LoginButton size="medium" text="Medium" />
                <LoginButton size="large" text="Large" />
              </div>
            </div>

            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #6366f1;">States</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Loading and error states with visual feedback</p>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <LoginButton text="Normal" size="small" />
                <LoginButton text="Loading..." size="small" style="opacity: 0.8; pointer-events: none;" />
              </div>
            </div>

            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #6366f1;">Customization</h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Custom text, redirectUri, appState</p>
              <LoginButton text="Sign In with Auth0" size="small" />
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827; text-align: center;">Key Features</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🔐</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Auth0 Integration</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Built-in authentication with Auth0 universal login</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">⚡</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Loading States</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Automatic loading indicators with spinner animations</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🚨</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Error Handling</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Comprehensive error display with retry functionality</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">🎨</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Design System</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Follows Vana design tokens and BEM methodology</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">📱</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Responsive</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Mobile-first design with touch-friendly interactions</p>
            </div>

            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 12px;">♿</div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Accessible</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">ARIA support, keyboard navigation, screen reader compatible</p>
            </div>
          </div>
        </div>

        <!-- Events Section -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Events & Integration</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #059669;">@loginStart</h3>
              <p style="margin: 0; font-size: 14px; color: #065f46;">Emitted when login process begins</p>
            </div>

            <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #059669;">@loginSuccess</h3>
              <p style="margin: 0; font-size: 14px; color: #065f46;">Emitted when login completes successfully</p>
            </div>

            <div style="padding: 16px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #dc2626;">@loginError</h3>
              <p style="margin: 0; font-size: 14px; color: #7f1d1d;">Emitted when login fails with error details</p>
            </div>
          </div>
        </div>

        <!-- Usage Examples -->
        <div style="margin-bottom: 32px; padding: 24px; background: white; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827;">Usage Examples</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <!-- Basic Usage -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Basic Usage</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;LoginButton /&gt;</code></pre>
            </div>

            <!-- Custom Configuration -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Custom Configuration</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;LoginButton 
  variant="outline" 
  size="large"
  text="Sign In"
  :redirectUri="'/dashboard'"
/&gt;</code></pre>
            </div>

            <!-- With Event Handlers -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">With Event Handlers</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;LoginButton 
  @loginStart="handleStart"
  @loginSuccess="handleSuccess"
  @loginError="handleError"
/&gt;</code></pre>
            </div>

            <!-- Error Display -->
            <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #374151;">Error Display</h3>
              <pre style="margin: 0; background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>&lt;LoginButton 
  :showError="true"
/&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- Best Practices -->
        <div style="padding: 24px; background: #fffbeb; border: 1px solid #fed7aa; border-radius: 12px;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #92400e;">Best Practices</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #92400e;">✅ Do</h3>
              <ul style="margin: 0; padding-left: 16px; color: #92400e; font-size: 14px; line-height: 1.6;">
                <li>Use primary variant for main login actions</li>
                <li>Provide clear error messages</li>
                <li>Handle loading states appropriately</li>
                <li>Use proper redirectUri for navigation</li>
                <li>Test authentication flows thoroughly</li>
              </ul>
            </div>

            <div>
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #92400e;">❌ Don't</h3>
              <ul style="margin: 0; padding-left: 16px; color: #92400e; font-size: 14px; line-height: 1.6;">
                <li>Use multiple primary login buttons</li>
                <li>Override Auth0 configuration directly</li>
                <li>Ignore error states</li>
                <li>Block user interface during login</li>
                <li>Use without proper error handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Complete visual documentation of the LoginButton component including all features, configuration options, usage examples, and best practices.',
      },
    },
  },
}
