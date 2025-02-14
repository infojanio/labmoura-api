import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeOrderUseCase } from '@/use-cases/factories/make-order-use-case'
import { validate } from './validate'
export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createOrderParamsSchema = z.object({
    storeId: z.string().uuid(),
    userId: z.string().uuid(),
    status: z.string(),
    totalAmount: z.number(),
    validate: z.date(),
    created_at: z.date(),
  })
  const createOrderBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })
  const { storeId } = createOrderParamsSchema.parse(request.params)
  const { latitude, longitude } = createOrderBodySchema.parse(request.body)
  const orderUseCase = makeOrderUseCase()
  await orderUseCase.execute({
    storeId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
    status: 'VALIDATED',
    totalAmount: 0,
    validated_at: new Date(),
    created_at: new Date(),
  })
  return reply.status(201).send()
}
