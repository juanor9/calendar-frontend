import type { Meta, StoryObj } from '@storybook/vue3'
import AuthCallback from './AuthCallback.vue'

const meta = {
  title: 'Auth/AuthCallback',
  component: AuthCallback,
  parameters: {
    docs: {
      description: {
        component: `
# Auth Callback

Componente responsable de manejar la redirección y procesamiento tras una autenticación externa.  
Se utiliza principalmente como **pantalla intermedia** en el flujo de inicio de sesión con OAuth o SSO.

## Funcionalidad

- Muestra un indicador de carga mientras procesa el token o código recibido.
- Llama a la lógica de autenticación del frontend (por ejemplo, intercambio de código por token).
- Redirige automáticamente a la pantalla principal o a una ruta de destino.
- Maneja errores de autenticación mostrando un mensaje apropiado.

## Uso típico

Este componente se monta en una ruta como \`/auth/callback\` para recibir la respuesta del proveedor de identidad.

## Accesibilidad

- Usa texto alternativo y estados claros (cargando, error).
- Compatible con lectores de pantalla.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Este componente no recibe props externas — su comportamiento depende del contexto de la ruta y el store de auth
  },
} satisfies Meta<typeof AuthCallback>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Estado por defecto: componente renderizado en un flujo de autenticación, mostrando el indicador de carga.',
      },
    },
  },
}

export const WithError: Story = {
  render: () => ({
    components: { AuthCallback },
    template: `<AuthCallback style="--storybook-simulate-error: true" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Simulación de un error de autenticación, mostrando mensaje de error al usuario.',
      },
    },
  },
}
