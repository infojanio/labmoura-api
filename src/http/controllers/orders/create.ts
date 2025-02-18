import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeOrderUseCase } from '@/use-cases/factories/make-order-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createOrderParamsSchema = z.object({
    storeId: z.string().uuid(),
  })

  const createOrderBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90, {
      message: 'Latitude inválida',
    }),
    longitude: z.number().refine((value) => Math.abs(value) <= 180, {
      message: 'Longitude inválida',
    }),
    totalAmount: z.number().positive(),
  })

  // Pegando os dados corretos do request
  const { storeId } = createOrderParamsSchema.parse(request.params)
  const { latitude, longitude, totalAmount } = createOrderBodySchema.parse(
    request.body,
  )

  // Criando o pedido
  const orderUseCase = makeOrderUseCase()

  const newOrder = await orderUseCase.execute({
    storeId,
    userId: request.user.sub, // ID do usuário do JWT
    userLatitude: latitude,
    userLongitude: longitude,
    status: 'PENDING', // O status deve ser definido corretamente
    totalAmount,
    validated_at: new Date(), // Ainda não validado
    created_at: new Date(),
  })

  return reply.status(201).send({ order: newOrder })
}
