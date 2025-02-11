import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'

export async function storesRoutes(app: FastifyInstance) {
  app.get('/stores/search', search)
  app.get('/stores/nearby', nearby)
  app.post('/stores', create)
  app.addHook('onRequest', verifyJWT) // verifyJWT -> verifica se o usuáio está autenticado
}
