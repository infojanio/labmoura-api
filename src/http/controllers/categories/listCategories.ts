import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListCategoriesUseCase } from '@/factories/make-list-categories-use-case'

export async function listCategories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listCategoriesUseCase = makeListCategoriesUseCase()

  const categories = await listCategoriesUseCase.execute()

  return reply.status(200).send(categories)
}
