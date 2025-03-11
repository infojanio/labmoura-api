import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from '../categories/create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function categoriesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post(
    //    '/stores/${storeId}/subcategories/${subcategoryId}/products',
    '/categories',
    { onRequest: [verifyUserRole('ADMIN')] },
    create,
  )

  //app.post('/stores/:storeId/orders', { onRequest: [verifyJWT] }, create)
}
