import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyFormBody from '@fastify/formbody'

import { usersRoutes } from '@/http/controllers/users/routes'
import { storesRoutes } from '@/http/controllers/stores/routes'
import { ordersRoutes } from './http/controllers/orders/routes'
import { ZodError } from 'zod'
import { env } from './.env'

export const app = fastify({
  // logger: true,
})
// Habilita JSON no body
app.register(fastifyFormBody)
app.register(fastifyJwt, { secret: process.env.JWT_SECRET! })
app.register(fastifyCors)

app.register(usersRoutes)
app.register(storesRoutes)
app.register(ordersRoutes)

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
