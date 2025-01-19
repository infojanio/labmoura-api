import { PrismaStoresRepository } from '@/repositories/prisma/prisma-stores-repository'
import { CreateStoreUseCase } from '../create-store'
export function makeCreateStoreUseCase() {
  const storesRepository = new PrismaStoresRepository()
  const useCase = new CreateStoreUseCase(storesRepository)
  return useCase
}
