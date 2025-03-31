import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { FetchProductsByQuantityUseCase } from '../use-cases/products/fetch-products-by-quantity.ts.js'
export function makeFetchProductsByQuantityUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const useCase = new FetchProductsByQuantityUseCase(productsRepository)
  return useCase
}
