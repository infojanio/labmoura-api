import { PrismaStoresRepository } from '@/repositories/prisma/prisma-stores-repository'
import { SearchStoresUseCase } from '../use-cases/stores/search-stores'
export function makeSearchStoresUseCase() {
  const storesRepository = new PrismaStoresRepository()
  const useCase = new SearchStoresUseCase(storesRepository)
  return useCase
}
