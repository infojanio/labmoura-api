import fastify from 'fastify'

import fastifyCors from '@fastify/cors'
import fastifyFormBody from '@fastify/formbody'
import fastifyStatic from '@fastify/static'
import path from 'path'

import { ZodError } from 'zod'
import { env } from '@/env'

import { reportsRoutes } from '@/http/controllers/reports/routes'
import fastifyMultipart from '@fastify/multipart'

export const app = fastify({
  //logger: true,
})
// Habilita JSON no body
app.register(fastifyMultipart)
app.register(fastifyFormBody)
//app.register(fastifyJwt, { secret: process.env.JWT_SECRET! })

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
  ],
  exposedHeaders: ['Content-Disposition'], // Importante para downloads
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
})

app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
  },
  attachFieldsToBody: true,
  sharedSchemaId: 'MultipartFileType',
})

app.register(fastifyStatic, {
  root: path.resolve('tmp'),
  prefix: '/pdf/',
  setHeaders(res, filePath) {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf')
    }
  },
})

app.register(reportsRoutes)

app.addHook('preHandler', async (request, reply) => {
  console.log('Origin recebida:', request.headers.origin)
})

app.addHook('onRequest', (request, reply, done) => {
  console.log('Headers recebidos:', request.headers)
  done()
})

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // AQUI deveremos fazer um log para uma ferramenta externa, como DataDog, NewRelic, Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
