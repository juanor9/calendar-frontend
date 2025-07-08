/// <reference types="vite/client" />

// Tipado global para importar recursos estáticos ----------------------------
declare module '*.svg'  { const src: string; export default src; }
declare module '*.png'  { const src: string; export default src; }
declare module '*.jpg'  { const src: string; export default src; }
declare module '*.jpeg' { const src: string; export default src; }
declare module '*.gif'  { const src: string; export default src; }

// Si más adelante instalas vite-svg-loader para usar SVG como componentes Vue,
// bastará con añadir:
//
// declare module '*.svg?component' {
//   import type { DefineComponent } from 'vue';
//   const Comp: DefineComponent<{}, {}, any>;
//   export default Comp;
// }
