import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { validate } from './validate'
import { history } from './history'
import { balance } from './balance'

export async function ordersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.get('/orders/history', history)
  app.get('/orders/balance', balance)
  app.post('/stores/:storeId/orders', create)
  app.patch('/orders/:orderId/validate', validate)
}
