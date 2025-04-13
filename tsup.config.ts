import { defineConfig } from 'tsup'

export default defineConfig({
  // ... outras configurações
  loader: {
    '.properties': 'copy',
    '.jar': 'copy',
    '.png': 'copy',
    '.jpeg': 'copy',
  },
})
