// AuthForm.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3'
import AuthForm from './AuthForm.vue'

const meta: Meta<typeof AuthForm> = {
  title: 'Auth/AuthForm',
  component: AuthForm,
  args: {
    title: 'Iniciar sesión',
    subtitle: 'Bienvenido de nuevo',
    submitButtonText: 'Entrar',
    showEmailField: true,
    showPasswordField: true,
    // ❌ Nada de `errorMessage` aquí: no existe en los props tipados del componente.
  },
  argTypes: {
    // Puedes exponer eventos si te interesa verlos en Actions
    onSubmit: { action: 'submit' },
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ConErrorEnFooter: Story = {
  render: args => ({
    components: { AuthForm },
    setup() {
      const error = 'Credenciales incorrectas. Intenta de nuevo.'
      return { args, error }
    },
    template: `
      <AuthForm v-bind="args">
        <template #footer>
          <div role="alert" style="margin-top:12px;font-size:14px;line-height:1.4;color:#B00020;">
            {{ error }}
          </div>
        </template>
      </AuthForm>
    `,
  }),
}

export const Registro: Story = {
  args: {
    title: 'Crear cuenta',
    subtitle: 'Es gratis y toma 1 minuto',
    submitButtonText: 'Registrarme',
    showEmailField: true,
    showPasswordField: true,
  },
}

export const SoloEmailMagicLink: Story = {
  args: {
    title: 'Enlace mágico',
    subtitle: 'Te enviaremos un enlace a tu correo',
    submitButtonText: 'Enviar enlace',
    showEmailField: true,
    showPasswordField: false,
  },
}
