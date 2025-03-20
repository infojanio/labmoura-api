import { PrismaStoresRepository } from '@/repositories/prisma/prisma-stores-repository'
import { FetchNearbyStoresUseCase } from '../use-cases/stores/fetch-nearby-stores'
export function makeFetchNearbyStoresUseCase() {
  const storesRepository = new PrismaStoresRepository()
  const useCase = new FetchNearbyStoresUseCase(storesRepository)
  return useCase
}
