import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from '../subcategories/create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { fetchSubCategoriesByCategory } from './fetch-subcategories-by-category'

export async function subcategoriesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/subcategories/:category_id', fetchSubCategoriesByCategory)
  app.post(
    //    '/stores/${storeId}/subcategories/${subcategoryId}/products',
    '/subcategories',
    { onRequest: [verifyUserRole('ADMIN')] },
    create,
  )
}
