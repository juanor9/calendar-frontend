import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath, URL } from 'node:url'
import type { UserConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-a11y', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/vue3-vite',
    options: {
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

  async viteFinal(config: UserConfig) {
    // Return minimal Vite configuration optimized for Storybook
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@': fileURLToPath(new URL('../src', import.meta.url)),
        },
        extensions: ['.mjs', '.ts', '.js', '.jsx', '.tsx', '.json', '.vue'],
      },
      css: {
        ...config.css,
        preprocessorOptions: {
          scss: {
            additionalData: `@use "@/styles/_tokens.scss" as *;\n`,
          },
        },
      },
      define: {
        ...config.define,
        // Ensure process.env.STORYBOOK is available
        'process.env.STORYBOOK': JSON.stringify('true'),
      },
    }
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
}

export default config
