import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'

export async function usersRoutes(app: FastifyInstance) {
  /* Rotas acessíveis para usuário autenticado */
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /* Rotas acessíveis para usuário autenticado */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
