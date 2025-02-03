import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { address } from './controllers/address'
import { store } from './controllers/store'
import { profile } from './controllers/profile'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/address', address)
  app.post('/store', store)
  app.post('/sessions', authenticate)

  /* Rotas acessíveis para usuário autenticado */

  app.get('/me', profile)
}
