## 🔍 Validación de código (Linters)

Este proyecto usa linters para mantener el código limpio, legible y consistente.

### ESLint (TypeScript + Vue)

Analiza errores de código y reglas de estilo en archivos `.ts` y `.vue`.

```bash
npm run lint          # Muestra errores y advertencias
npx eslint src --fix  # Corrige errores automáticamente
```

### Prettier (formato general)

Aplica formato automático al código según reglas predefinidas.

```bash
npm run format                # Formatea todo el proyecto
npm run format -- --check     # Solo verifica sin modificar archivos
```

### Stylelint (SCSS y estilos Vue)

Valida reglas de estilo en archivos `.scss` y bloques `<style lang="scss">` en `.vue`.

```bash
npm run stylelint
npx stylelint "src/**/*.{scss,vue}" --fix
```

> 📝 Recuerda usar la notación BEM en las clases CSS: `bloque__elemento--modificador`.
