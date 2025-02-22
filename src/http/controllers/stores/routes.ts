import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function storesRoutes(app: FastifyInstance) {
  app.get('/stores/search', search)
  app.get('/stores/nearby', nearby)
  // 🔐 As demais rotas exigem autenticação
  app.addHook('onRequest', verifyJWT)
  // 🔓 Permite acesso público às rotas de busca e lojas próximas

  app.post('/stores', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
