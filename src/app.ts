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

// Multipart (apenas uma vez!)
app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
  },
  attachFieldsToBody: true,
  sharedSchemaId: 'MultipartFileType',
})

// Form body
app.register(fastifyFormBody)

// CORS
const allowedOrigins = [
  'https://labmoura-web-production.up.railway.app',
  'http://localhost:3000', // dev local
]

app.register(fastifyCors, {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'), false)
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
  ],
  exposedHeaders: ['Content-Disposition'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
})

// PDF público
app.register(fastifyStatic, {
  root: path.resolve('tmp'),
  prefix: '/pdf/',
  setHeaders(res, filePath) {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf')
    }
  },
})

// Rotas
app.register(reportsRoutes)

// Logs de requisições para debug
app.addHook('preHandler', async (request, reply) => {
  console.log('Origin recebida:', request.headers.origin)
})
app.addHook('onRequest', (request, reply, done) => {
  console.log('Headers recebidos:', request.headers)
  done()
})

// CORS dinâmico por segurança
app.addHook('onSend', async (request, reply, payload) => {
  const origin = request.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    reply.header('Access-Control-Allow-Origin', origin)
  }
  reply.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return payload
})

// Tratamento de erros
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
