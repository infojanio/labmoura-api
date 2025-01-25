import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { DeleteProductUseCase } from '../delete-product'
export function makeDeleteProductUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const useCase = new DeleteProductUseCase(productsRepository)
  return useCase
}
