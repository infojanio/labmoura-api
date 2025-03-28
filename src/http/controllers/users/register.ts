import { z } from 'zod' //responsável pela validação dos dados
import { FastifyReply, FastifyRequest } from 'fastify'
import { UserAlreadyExistsError } from '@/utils/messages/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/factories/make-register-use-case'
import { makeAddressUseCase } from '@/factories/make-address-use-case'

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
    phone: z.string(),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    role: z.nativeEnum(Role), // 🔹 Agora valida apenas os valores do enum
    avatar: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      user_id: z.string().optional(),
      //  store_id: z.string().optional(),
    }),
  })

  const {
    //id,
    name,
    email,
    password,
    phone,
    role,
    avatar,
    address,
  } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    const { user } = await registerUseCase.execute({
      //id,
      name,
      email,
      password,
      phone,
      role,
      avatar,
      address,
    })

    // Cria o endereço associado ao usuário
    const createAddressUseCase = makeAddressUseCase()

    const userAddress = await createAddressUseCase.execute({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      // store_id: address.store_id,
      user_id: user.id,
    })

    // Retorna status 201, mensagem de sucesso e os dados do usuário criado
    return reply.status(201).send({
      message: 'Cadastro realizado com sucesso!',
      user: {
        ...user,
        passwordHash: undefined,
      },

      address: userAddress,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
