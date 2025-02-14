import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserCashbackBalanceUseCase } from '@/use-cases/factories/make-get-user-cashback-balance-use-case'
export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserCashbackBalanceUseCase = makeGetUserCashbackBalanceUseCase()
  const { ordersCount } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  })
  return reply.status(200).send({
    checkInsCount,
  })
}
