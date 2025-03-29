import { PrismaSubCategoriesRepository } from '@/repositories/prisma/prisma-subcategories-repository'
import { FetchSubcategoriesByCategoryUseCase } from '../use-cases/subcategories/fetch-subcategories-by-category'
export function makeFetchSubCategoriesByCategoryUseCase() {
  const subcategoriesRepository = new PrismaSubCategoriesRepository()
  const useCase = new FetchSubcategoriesByCategoryUseCase(
    subcategoriesRepository,
  )
  return useCase
}
