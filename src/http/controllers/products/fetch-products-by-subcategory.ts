import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchProductsBySubCategoryUseCase } from '@/factories/make-fetch-products-by-subcategory-use-case'

export async function fetchProductsBySubCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchProductsQuerySchema = z.object({
      subcategoryId: z.string(),
    })

    const { subcategoryId } = fetchProductsQuerySchema.parse(request.query)

    // Converte para número e define 3 como valor padrão caso não seja passado
    //const categoryValue = categoryId ? String(categoryId) : ''

    const fetchProductsBySubCategoryUseCase = makeFetchProductsBySubCategoryUseCase()

    const products = await fetchProductsBySubCategoryUseCase.execute({
      subcategoryId: subcategoryId ?? undefined, // passa undefined se não existir
    })

    console.log('Result', products)
    return reply.status(200).send(products)
  } catch (error) {
    return reply.status(400).send({ error: error })
  }
}
