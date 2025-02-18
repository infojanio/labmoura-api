import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchStoresUseCase } from '@/use-cases/factories/make-search-stores-use-case'
export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchStoresQuerySchema = z.object({
    name: z.string(), // Requer um parâmetro de busca não vazio,
    page: z.coerce.number().min(1).default(1),
  })
  const { name, page } = searchStoresQuerySchema.parse(request.query)

  const searchStoresUseCase = makeSearchStoresUseCase()
  const { stores } = await searchStoresUseCase.execute({
    search: name,
    page,
  })
  return reply.status(200).send({
    stores,
  })
}
