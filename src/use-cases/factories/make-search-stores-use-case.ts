import { PrismaStoresRepository } from '@/repositories/prisma/prisma-stores-repository'
import { SearchStoresUseCase } from '../search-stores'
export function makeSearchStoresUseCase() {
  const storesRepository = new PrismaStoresRepository()
  const useCase = new SearchStoresUseCase(storesRepository)
  return useCase
}
