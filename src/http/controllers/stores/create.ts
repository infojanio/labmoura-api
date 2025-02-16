import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateStoreUseCase } from '@/use-cases/factories/make-create-store-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createStoreBodySchema = z.object({
    name: z.string(),
    slug: z.string().nullable(),
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })
  const { name, slug, latitude, longitude } = createStoreBodySchema.parse(
    request.body,
  )
  const createStoreUseCase = makeCreateStoreUseCase()
  await createStoreUseCase.execute({
    name,
    slug,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
