import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeValidateOrderUseCase } from '@/use-cases/factories/make-validate-order-use-case'
export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateOrderParamsSchema = z.object({
    orderId: z.string().uuid(),
  })
  const { orderId } = validateOrderParamsSchema.parse(request.params)
  const validateOrderUseCase = makeValidateOrderUseCase()
  await validateOrderUseCase.execute({
    orderId,
  })
  return reply.status(204).send()
}
