import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
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
app.register(fastifyJwt, { secret: process.env.JWT_SECRET! })
app.register(fastifyCors, {
  origin: 'http://localhost:5173', // URL exata do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Só se estiver usando autenticação com cookies/tokens
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
  //console.log('REQUEST BODY:', request.body)
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
