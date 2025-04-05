import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchSubCategoriesByCategoryUseCase } from '@/factories/make-fetch-subcategories-by-category-use-case'

export async function fetchSubCategoriesByCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchSubCategoriesQuerySchema = z.object({
      categoryId: z.string(),
    })

    const { categoryId } = fetchSubCategoriesQuerySchema.parse(request.query)

    // Converte para número e define 3 como valor padrão caso não seja passado
    //const categoryValue = categoryId ? String(categoryId) : ''

    const fetchSubCategoriesByCategoryUseCase = makeFetchSubCategoriesByCategoryUseCase()

    const subcategories = await fetchSubCategoriesByCategoryUseCase.execute({
      categoryId: categoryId ?? undefined, // passa undefined se não existir
    })

    console.log('Result', subcategories)
    return reply.status(200).send(subcategories)
  } catch (error) {
    return reply.status(400).send({ error: error })
  }
}
