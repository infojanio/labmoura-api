import { SubCategoriesRepository } from '@/repositories/prisma/Iprisma/subcategories-repository'
import { SubCategory } from '@prisma/client'

interface FetchSubCategoryUseCaseRequest {
  categoryId: string
}

export class FetchSubcategoriesByCategoryUseCase {
  constructor(private subcategoriesRepository: SubCategoriesRepository) {}

  async execute({
    categoryId,
  }: FetchSubCategoryUseCaseRequest): Promise<SubCategory[] | null> {
    const subcategory = await this.subcategoriesRepository.listByCategory(
      categoryId,
    )
    return subcategory
  }
}
