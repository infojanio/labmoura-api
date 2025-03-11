import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateCategoryUseCase } from '@/use-cases/factories/make-create-category-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCategoryBodySchema = z.object({
    name: z.string(),
    image: z.string().nullable(),
    created_at: z.date().optional(),
  })
  const { name, image } = createCategoryBodySchema.parse(request.body)
  const createCategoryUseCase = makeCreateCategoryUseCase()
  await createCategoryUseCase.execute({
    name,
    image,
    created_at: new Date(),
  })

  return reply.status(201).send()
}
