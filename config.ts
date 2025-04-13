// Crie um arquivo config.ts
import { env } from '@/env' // ou './.env' (escolha um padrão)
import dotenv from 'dotenv'

try {
  dotenv.config()
} catch (e) {
  // Ignore se o arquivo .env não existir (em produção)
}

export const config = {
  // Suas configurações aqui
}
