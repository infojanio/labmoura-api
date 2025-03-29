import { SubCategoriesRepository } from '@/repositories/prisma/Iprisma/subcategories-repository'
import { SubCategory, Prisma } from '@prisma/client'
interface FetchSubCategoryUseCaseRequest {
  category_id: string
}
interface FetchSubCategoryUseCaseResponse {
  subcategory: SubCategory[]
}
export class FetchSubcategoriesByCategoryUseCase {
  constructor(private subcategoriesRepository: SubCategoriesRepository) {}
  async execute({
    category_id,
  }: FetchSubCategoryUseCaseRequest): Promise<FetchSubCategoryUseCaseResponse> {
    const subcategory = await this.subcategoriesRepository.findByCategory(
      category_id,
    )
    return {
      subcategory,
    }
  }
}
