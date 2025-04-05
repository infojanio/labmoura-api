import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from '../subcategories/create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { fetchSubCategoriesByCategory } from './fetch-subcategories-by-category'
import { listSubCategories } from './listSubCategories'

export async function subcategoriesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.get('/subcategories', listSubCategories)
  app.get('/subcategories/category', fetchSubCategoriesByCategory)
  app.post('/subcategories', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
