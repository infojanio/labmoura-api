import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchSubCategoriesByCategoryUseCase } from '@/factories/make-fetch-subcategories-by-category-use-case'

export async function fetchSubCategoriesByCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchSubCategoriesParamsSchema = z.object({
    category_id: z.string(),
  })

  const { category_id } = fetchSubCategoriesParamsSchema.parse(request.params)

  const fetchSubCategoriesByCategoryUseCase = makeFetchSubCategoriesByCategoryUseCase()

  const subcategories = await fetchSubCategoriesByCategoryUseCase.execute({
    category_id,
  })

  return reply.status(200).send(subcategories)
}
