import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { CreateProductUseCase } from '../create-product'
import { PrismaStoresRepository } from '@/repositories/prisma/prisma-stores-repository'
import { PrismaSubCategoriesRepository } from '@/repositories/prisma/prisma-subcategories-repository'
export function makeCreateProductUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const storesRepository = new PrismaStoresRepository()
  const subcategoriesRepository = new PrismaSubCategoriesRepository()

  const useCase = new CreateProductUseCase(
    productsRepository,
    storesRepository,
    subcategoriesRepository,
  )
  return useCase
}
