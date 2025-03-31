import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { FetchProductsByCashbackUseCase } from '../use-cases/products/fetch-products-by-cashback.ts'
export function makeFetchProductsByCashbackUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const useCase = new FetchProductsByCashbackUseCase(productsRepository)
  return useCase
}
