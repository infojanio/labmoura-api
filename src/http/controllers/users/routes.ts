import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'
import { refresh } from './refresh'
import { balance } from '../orders/balance'

export async function usersRoutes(app: FastifyInstance) {
  /* Rotas acessíveis para usuário não autenticado */
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh) //pega o token e atualiza
  app.get('/users/cashback/balance', balance)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
  /* Rotas exclusivas para usuário autenticado */
}
