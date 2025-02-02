import { z } from 'zod' //responsável pela validação dos dados
import { FastifyReply, FastifyRequest } from 'fastify'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeAddressUseCase } from '@/use-cases/factories/make-address-use-case'

export async function address(request: FastifyRequest, reply: FastifyReply) {
  const registerAddressBodySchema = z
    .object({
      // id: z.string(),
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      store_id: z.string().optional().nullable(),
      user_id: z.string().optional().nullable(),
    })
    .refine((data) => data.store_id || data.user_id, {
      message: 'store_id ou user_id deve ser informado.',
    })

  const {
    // id,
    street,
    city,
    state,
    postalCode,
    store_id,
    user_id,
    // addressId,
    // address_id,
    // created_at,
  } = registerAddressBodySchema.parse(request.body)

  try {
    const addressUseCase = makeAddressUseCase()
    await addressUseCase.execute({
      // id,
      street,
      city,
      state,
      postalCode,
      store_id,
      user_id,

      //  addressId,
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
