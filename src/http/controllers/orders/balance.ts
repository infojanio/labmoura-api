import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserCashbackBalanceUseCase } from '@/use-cases/factories/make-get-user-cashback-balance-use-case'
export async function balance(request: FastifyRequest, reply: FastifyReply) {
  const getUserCashbackBalanceUseCase = makeGetUserCashbackBalanceUseCase()
  const { balance } = await getUserCashbackBalanceUseCase.execute({
    user_id: request.user.sub,
  })
  return reply.status(200).send({
    balance,
  })
}
