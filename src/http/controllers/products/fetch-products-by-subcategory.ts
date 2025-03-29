import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchProductsBySubCategoryUseCase } from '@/factories/make-fetch-products-by-subcategory-use-case'

export async function fetchProductsBySubCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchProductsParamsSchema = z.object({
    subcategory_id: z.string(),
  })

  const { subcategory_id } = fetchProductsParamsSchema.parse(request.params)

  const fetchProductsBySubCategoryUseCase = makeFetchProductsBySubCategoryUseCase()

  const products = await fetchProductsBySubCategoryUseCase.execute({
    subcategory_id,
  })

  return reply.status(200).send(products)
}
