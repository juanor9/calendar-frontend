// env.d.ts
// NO /// <reference types="vite/client" />
// Ya que tsconfig.app.json ya incluye "vite/client" en "types"

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly BASE_URL: string
  // Agrega aquí otras variables de entorno que uses con el prefijo VITE_, por ejemplo:
  // readonly VITE_API_KEY: string;
}

// Declara la interfaz global ImportMeta para que TypeScript sepa que .env existe
// y tiene el tipo que definimos en ImportMetaEnv.
interface ImportMeta {
  readonly env: ImportMetaEnv
}
