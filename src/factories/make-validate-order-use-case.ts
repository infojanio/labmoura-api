import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { ValidateOrderUseCase } from '../use-cases/orders/validate-order'
export function makeValidateOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository()
  const useCase = new ValidateOrderUseCase(ordersRepository)
  return useCase
}
