import { PrismaStoresRepository } from '@/repositories/prisma/prisma-stores-repository'
import { FetchNearbyStoresUseCase } from '../fetch-nearby-stores'
export function makeFetchNearbyStoresUseCase() {
  const storesRepository = new PrismaStoresRepository()
  const useCase = new FetchNearbyStoresUseCase(storesRepository)
  return useCase
}
