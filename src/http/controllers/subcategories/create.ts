import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateSubCategoryUseCase } from '@/use-cases/factories/make-create-subcategory-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createSubCategoryBodySchema = z.object({
    name: z.string().min(1, 'O nome da categoria é obrigatório'),
    image: z.string().nullable(),
    category_id: z.string(),
    created_at: z.date().optional(),
  })
  const { name, image, category_id } = createSubCategoryBodySchema.parse(
    request.body,
  )
  const createSubCategoryUseCase = makeCreateSubCategoryUseCase()
  await createSubCategoryUseCase.execute({
    name,
    image,
    category_id,
    created_at: new Date(),
  })

  return reply.status(201).send()
}
