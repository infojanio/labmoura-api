// src/http/controllers/users/update.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateUserUseCase } from '@/factories/make-update-user-use-case'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { EmailNotUpdatedError } from '@/use-cases/errors/email-not-updated-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  // Validação dos parâmetros da rota (userId)
  const updateUserParamsSchema = z.object({
    userId: z.string(),
  })

  // Validação do corpo da requisição
  const updateUserBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
    avatar: z.string().optional(),
  })

  try {
    // Parse dos parâmetros e do corpo
    const { userId } = updateUserParamsSchema.parse(request.params)
    const updateData = updateUserBodySchema.parse(request.body)

    // Executa o caso de uso para atualizar o usuário
    const updateUserUseCase = makeUpdateUserUseCase()
    await updateUserUseCase.execute({
      userId,
      ...updateData,
    })

    return reply.status(204).send({ message: 'user updated successfullys!' }) // Atualização bem-sucedida, sem corpo
  } catch (error) {
    //erro de validação
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação:', error.flatten().fieldErrors)
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.flatten().fieldErrors,
      })
    }

    //erro de email não pode ser atualizado
    if (error instanceof EmailNotUpdatedError) {
      return reply.status(403).send({ message: error.message })
    }

    //erro de usuário não encontrado
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    return reply.status(500).send({ message: 'Erro interno do servidor' })
  }
}
