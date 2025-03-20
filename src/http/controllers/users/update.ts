// src/http/controllers/users/update.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateUserUseCase } from '@/factories/make-update-user-use-case'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateUserParamsSchema = z.object({
    userId: z.string(),
  })

  const updateUserBodySchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
    avatar: z.string().optional(),
  })

  try {
    const { userId } = updateUserParamsSchema.parse(request.params)
    const updateData = updateUserBodySchema.parse(request.body)

    const updateUserUseCase = makeUpdateUserUseCase()
    await updateUserUseCase.execute({
      userId,
      ...updateData,
    })
    return reply.status(204).send()
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação:', error.flatten().fieldErrors)
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.flatten().fieldErrors,
      })
    }

    console.error('❌ Erro interno:', error)
    return reply.status(404).send({ message: 'User not found' })
  }
}
