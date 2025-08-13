import type { Meta, StoryObj } from '@storybook/vue3'
import AboutPage from './AboutPage.vue'

const meta: Meta<typeof AboutPage> = {
  title: 'Pages/About Page',
  component: AboutPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A simple about page component that displays information about the Vana Calendar application. Features responsive design and follows the established design system patterns.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/vana-pages',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AboutPage>

export const Default: Story = {
  render: () => ({
    components: { AboutPage },
    template: '<AboutPage />',
  }),
}

export const WithExpandedContent: Story = {
  render: () => ({
    components: { AboutPage },
    template: `
      <div class="about-page">
        <h1 class="about-page__title">Acerca de Vana Calendar</h1>
        
        <div class="about-page__content">
          <div class="about-page__section">
            <h2 class="about-page__section-title">Nuestra Misión</h2>
            <p>Vana Calendar es la solución de planificación inteligente que transforma la manera en que organizas tu tiempo. Utilizando inteligencia artificial avanzada, optimizamos tu calendario para maximizar tu productividad y bienestar.</p>
          </div>
          
          <div class="about-page__section">
            <h2 class="about-page__section-title">Características Principales</h2>
            <p>• Planificación automática inteligente</p>
            <p>• Optimización de tiempo con IA</p>
            <p>• Sincronización multi-dispositivo</p>
            <p>• Recordatorios personalizados</p>
            <p>• Análisis de productividad</p>
          </div>
          
          <div class="about-page__section">
            <h2 class="about-page__section-title">Nuestro Compromiso</h2>
            <p>Nos comprometemos a proteger tu privacidad y a proporcionarte herramientas que realmente mejoren tu calidad de vida. Cada función está diseñada pensando en el usuario final.</p>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Extended version of the about page with multiple sections showcasing how the component handles longer content.',
      },
    },
  },
}

export const MobileView: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Mobile responsive view of the about page showing typography and spacing adjustments.',
      },
    },
  },
}

export const TabletView: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet view of the about page demonstrating responsive behavior.',
      },
    },
  },
}
