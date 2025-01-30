import { CategoriesRepository } from '@/repositories/categories-repository'
import { Category, Prisma } from '@prisma/client'
interface CreateCategoryUseCaseRequest {
  name: string
  image: string | null
  subcategory: string
  created_at: Date
}
interface CreateCategoryUseCaseResponse {
  category: Category
}
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}
  async execute({
    name,
    image,
    subcategory,
    created_at,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.create({
      name,
      image,
      SubCategory: subcategory,
      created_at,
    })
    return {
      category,
    }
  }
}
