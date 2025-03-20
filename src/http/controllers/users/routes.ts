import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'
import { refresh } from './refresh'
import { balance } from '../orders/balance'
import { update } from './update'

export async function usersRoutes(app: FastifyInstance) {
  /* Rotas acessíveis para usuário não autenticado */
  app.post('/users', register)
  app.post('/sessions', authenticate)

  //app.put('/users/update', update)
  app.put('/users/:userId', { onRequest: [verifyJWT] }, update)

  app.patch('/token/refresh', refresh) //pega o token e atualiza
  app.get('/me', { onRequest: [verifyJWT] }, profile)

  // app.put('/users/:id', { onRequest: [verifyJWT] }, update) //atualiza o usuário

  app.get('/users/cashback/balance', balance)

  /* Rotas exclusivas para usuário autenticado */
}
