import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from '../products/create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { listProducts } from './listProducts'
import { fetchProductsBySubCategory } from './fetch-products-by-subcategory'
import { fetchProductsByCashback } from './fetch-products-by-cashback'
import { fetchProductsByQuantity } from './fetch-products-by-quantity'

export async function productsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/products/quantity', fetchProductsByQuantity)
  app.get('/products/cashback', fetchProductsByCashback)
  app.get('/products', listProducts)
  app.get('/products/subcategory', fetchProductsBySubCategory)
  app.post(
    //    '/stores/${storeId}/subcategories/${subcategoryId}/products',
    '/products',
    { onRequest: [verifyUserRole('ADMIN')] },
    create,
  )

  //app.post('/stores/:storeId/orders', { onRequest: [verifyJWT] }, create)
}
