import 'dotenv/config'
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyFormBody from '@fastify/formbody'
import fastifyStatic from '@fastify/static'
import fastifyMultipart from '@fastify/multipart'
import path from 'path'
import { ZodError } from 'zod'

import { env } from '@/env'
import { reportsRoutes } from '@/http/controllers/reports/routes'

export const app = fastify({
  // logger: true,
})

// 1. Configuração de CORS (antes de tudo)
const allowedOrigins = [
  'https://labmoura-web-production.up.railway.app',
  //'http://localhost:5173',
]
app.register(fastifyCors, {
  origin: [
    'https://labmoura-web-production.up.railway.app', // ✅ frontend hospedado
    //'http://localhost:5173', // opcional para dev local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})
// 2. Formulários e multipart
app.register(fastifyFormBody)
app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  // attachFieldsToBody: true,
  sharedSchemaId: 'MultipartFileType',
})

// 3. Servir PDFs assinados
app.register(fastifyStatic, {
  root: path.resolve('tmp'),
  prefix: '/pdf/',
  setHeaders(res, filePath) {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf')
    }
  },
})

// 4. Rotas da aplicação
app.register(reportsRoutes)

// 5. Logs úteis (opcional em produção)
app.addHook('onRequest', async (request) => {
  console.log('🛰️ Requisição:', {
    method: request.method,
    url: request.url,
    origin: request.headers.origin,
  })
})

// 6. Tratamento de erros globais
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error('Erro interno:', error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
