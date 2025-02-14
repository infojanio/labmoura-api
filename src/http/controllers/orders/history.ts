import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'
import { makeFetchUserOrdersHistoryUseCase } from '@/use-cases/factories/make-fetch-user-orders-history-use-case'
export async function history(request: FastifyRequest, reply: FastifyReply) {
  const orderHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })
  const { page } = orderHistoryQuerySchema.parse(request.query)
  const fetchUserOrdersHistoryUseCase = makeFetchUserOrdersHistoryUseCase()
  const { orders } = await fetchUserOrdersHistoryUseCase.execute({
    userId: request.user.sub,
    storeId: '', //tenho que ver como recuperar o storeId
    status: 'VALIDATED',
    totalAmount: 0,
    validated_at: new Date(),
    created_at: new Date(),
    page,
  })

  return reply.status(200).send({
    orders,
  })
}
