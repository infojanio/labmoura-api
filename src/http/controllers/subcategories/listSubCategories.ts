import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListSubCategoriesUseCase } from '@/factories/make-list-subcategories-use-case'

export async function listSubCategories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listSubCategoriesUseCase = makeListSubCategoriesUseCase()

  const subcategories = await listSubCategoriesUseCase.execute()

  return reply.status(200).send(subcategories)
}
