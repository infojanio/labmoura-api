import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { address } from './controllers/address'
import { store } from './controllers/store'
import { profile } from './controllers/profile'
import { verify } from 'crypto'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  /* Rotas acessíveis para usuário autenticado */
  app.post('/users', register)
  app.post('/address', address)
  app.post('/store', store)
  app.post('/sessions', authenticate)

  /* Rotas acessíveis para usuário autenticado */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
