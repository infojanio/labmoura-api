import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchStoresUseCase } from '@/use-cases/factories/make-search-stores-use-case'
export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchStoresQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })
  const { q, page } = searchStoresQuerySchema.parse(request.query)

  const searchStoresUseCase = makeSearchStoresUseCase()
  const { stores } = await searchStoresUseCase.execute({
    search: q,
    page,
  })
  return reply.status(200).send({
    stores,
  })
}
