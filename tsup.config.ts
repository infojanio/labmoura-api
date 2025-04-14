import { defineConfig } from 'tsup'

export default defineConfig({
  // ... outras configurações
  external: ['.env', '@/env'],

  loader: {
    '.properties': 'copy',
    '.env': 'copy', // Copia o arquivo sem tentar bundle
    '.jar': 'copy',
    '.pem': 'copy',
    '.pfx': 'copy',
    '.png': 'copy',
    '.jpeg': 'copy',
  },
})
