import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  /* Rotas acessíveis para usuário não autenticado */
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)
  /* Rotas exclusivas para usuário autenticado */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
