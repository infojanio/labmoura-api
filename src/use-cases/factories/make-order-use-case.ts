import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { PrismaStoresRepository } from '@/repositories/prisma/prisma-stores-repository'
import { OrderUseCase } from '../order'
export function makeOrderUseCase() {
  const orderRepository = new PrismaOrdersRepository()
  const storeRepository = new PrismaStoresRepository()
  const useCase = new OrderUseCase(orderRepository, storeRepository)
  return useCase
}
