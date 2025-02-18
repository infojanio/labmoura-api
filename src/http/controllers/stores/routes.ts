import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'

export async function storesRoutes(app: FastifyInstance) {
  // 🔓 Permite acesso público às rotas de busca e lojas próximas
  // 🔐 As demais rotas exigem autenticação
  app.get('/stores/search', search)
  app.get('/stores/nearby', nearby)

  app.addHook('onRequest', verifyJWT)
  app.post('/stores', create)
}
