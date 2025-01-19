import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { GetUserCashbackBalanceUseCase } from '../get-user-cashback-balance'
export function makeGetUserCashbackBalanceUseCase() {
  const cashbacksRepository = new PrismaOrdersRepository()
  const useCase = new GetUserCashbackBalanceUseCase(cashbacksRepository)
  return useCase
}
