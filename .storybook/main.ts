import type { StorybookConfig } from '@storybook/vue3-vite'

/* Plugins que no queremos en Storybook */
const BLOCKLIST = [
  'vite-plugin-vue-devtools',
  'vite-plugin-vue-inspector',
  'storybook:vue-docgen-plugin',
  'storybook:vue-template-compilation',
]


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


  async viteFinal(stb) {
    const { mergeConfig } = await import('vite')
    return mergeConfig(stb, {
      resolve: {
        alias: {
          '@': new URL('../src', import.meta.url).pathname,
        },
      },
      css: {

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
    })
  },
}

export default config
