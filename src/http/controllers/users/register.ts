import { z } from 'zod' //responsável pela validação dos dados
import { FastifyReply, FastifyRequest } from 'fastify'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

// Definição do enum Role
enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    // id: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    phone: z.string(),
    role: z.nativeEnum(Role), // 🔹 Agora valida apenas os valores do enum
    avatar: z.string(),
  })

  const {
    //id,
    name,
    email,
    password,
    phone,
    role,
    avatar,
  } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    const user = await registerUseCase.execute({
      //id,
      name,
      email,
      password,
      phone,
      role,
      avatar,
    })

    console.log('✅ Usuário criado:', user) // 🔹 Verifica se o usuário foi realmente criado
    return reply.status(201).send(user) // 🔹 Agora retorna os dados do usuário criado
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    return reply.status(201).send()
  }
}
