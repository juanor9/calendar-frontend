import type { Meta, StoryObj } from '@storybook/vue3'
import AuthDemo from './AuthDemo.vue'

const meta = {
  title: 'Auth/AuthDemo',
  component: AuthDemo,
  parameters: {
    docs: {
      description: {
        component: `
# Auth Demo

Componente de demostración para probar e ilustrar el flujo de autenticación dentro de la aplicación.

## Funcionalidad

- Simula la interacción de login y logout para entornos de desarrollo o demostración.
- Permite verificar estilos, mensajes y transiciones sin depender de un backend real.
- Ideal para validar el diseño del flujo de autenticación antes de integrarlo con la API.

## Uso típico

Se puede montar en entornos *storybook* o rutas internas de desarrollo para mostrar:
- Pantalla de login
- Estado autenticado
- Botón de logout

## Accesibilidad

- Elementos interactivos accesibles vía teclado.
- Etiquetas claras en botones e inputs para lectores de pantalla.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Este componente no recibe props externas — su comportamiento depende de estados internos simulados
  },
} satisfies Meta<typeof AuthDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Estado inicial de la demo de autenticación mostrando el formulario de login simulado.',
      },
    },
  },
}

export const LoggedIn: Story = {
  render: () => ({
    components: { AuthDemo },
    template: `<AuthDemo style="--storybook-simulate-loggedin: true" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Simulación del estado autenticado, mostrando la interfaz posterior al login.',
      },
    },
  },
}

export const ErrorState: Story = {
  render: () => ({
    components: { AuthDemo },
    template: `<AuthDemo style="--storybook-simulate-error: true" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Simulación de un error en el inicio de sesión, mostrando un mensaje de error al usuario.',
      },
    },
  },
}
