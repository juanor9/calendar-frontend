import type { StorybookConfig } from '@storybook/vue3-vite'

/* Plugins que no queremos en Storybook */
const BLOCKLIST = [
  'vite-plugin-vue-devtools',
  'vite-plugin-vue-inspector',
  'storybook:vue-docgen-plugin',
  'storybook:vue-template-compilation',
]

const config: StorybookConfig = {
  stories: ['../src/**/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-a11y'],

  framework: {
    name: '@storybook/vue3-vite',
    options: {
      /* Motor docgen moderno y estable */
      docgen: {
        plugin: 'vue-component-meta',
        tsconfig: 'tsconfig.app.json',
      },
    },
  },

  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true,
  },

  async viteFinal(stb) {
    const { mergeConfig } = await import('vite')
    return mergeConfig(stb, {
      resolve: {
        alias: {
          '@': new URL('../src', import.meta.url).pathname,
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use "@/styles/_tokens.scss" as *;\n`,
          },
        },
      },
    })
  },
}

export default config
