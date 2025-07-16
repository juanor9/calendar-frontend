import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig, type Plugin, type UserConfig } from 'vite'
import viteConfig from '../vite.config'

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

  core: { builder: '@storybook/builder-vite' },

  async viteFinal(stb: UserConfig) {
    const merged = mergeConfig(stb, viteConfig as UserConfig)

    /* 1. Filtra plugins conflictivos */
    let plugins = (merged.plugins ?? []).filter((p: Plugin | [Plugin]) => {
      const name = Array.isArray(p) ? p[0].name : (p as Plugin).name
      return !BLOCKLIST.some(bad => name?.includes(bad))
    })

    /* 2. Elimina duplicados de `vite:vue` (deja solo la primera instancia) */
    let seenVue = false
    plugins = plugins.filter((p: Plugin | [Plugin]) => {
      const name = Array.isArray(p) ? p[0].name : (p as Plugin).name
      if (name === 'vite:vue') {
        if (seenVue) return false // descarta duplicado
        seenVue = true
      }
      return true
    })

    merged.plugins = plugins
    return merged
  },
}

export default config
