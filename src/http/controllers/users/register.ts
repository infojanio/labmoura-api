import { z } from 'zod' //responsável pela validação dos dados
import { FastifyReply, FastifyRequest } from 'fastify'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    // id: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    phone: z.string(),
    role: z.any(),
    avatar: z.string(),
    //  address_id: z.string(),
    // created_at: z.date(),
  })

  const {
    // id,
    name,
    email,
    password,
    phone,
    role,
    avatar,
    // address_id,
    // created_at,
  } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
    await registerUseCase.execute({
      // id,
      name,
      email,
      password,
      phone,
      role,
      avatar,
      //address_id,
      // created_at,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }

  return reply.status(201).send()
}
