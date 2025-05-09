import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(57508), //adicione a porta aqui 3333 para rodar local
  PUBLIC_REPORT_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  CERT_PATH: z.string(),
  CERT_PASSWORD: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environmet variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
