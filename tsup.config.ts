import { defineConfig } from 'tsup'

export default defineConfig({
  // ... outras configurações
  external: ['.env', '@/.env'],

  loader: {
    '.properties': 'copy',

    '.jar': 'copy',
    '.png': 'copy',
    '.jpeg': 'copy',
  },
})
