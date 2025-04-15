import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyFormBody from '@fastify/formbody'
import fastifyStatic from '@fastify/static'
import path from 'path'

import { ZodError } from 'zod'
import { env } from '@/env'

import { reportsRoutes } from '@/http/controllers/reports/routes'
import fastifyMultipart from '@fastify/multipart'

export const app = fastify()

// Registre apenas os plugins necessários
app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})

app.register(fastifyFormBody)
app.register(fastifyCors, {
  origin: ['https://labmoura-web-production.up.railway.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
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

// Error handler (mantenha conforme estava)
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
