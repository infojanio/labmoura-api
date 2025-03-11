import { CategoriesRepository } from '@/repositories/categories-repository'
import { Category, Prisma } from '@prisma/client'
interface CreateCategoryUseCaseRequest {
  id?: string
  name: string
  image: string | null
  created_at: Date
  //subcategory: string
}
interface CreateCategoryUseCaseResponse {
  category: Category
}
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}
  async execute({
    id,
    name,
    image,
    created_at,
  }: // subcategory,
  CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.create({
      id,
      name,
      image,
      created_at,
      // SubCategory: subcategory,
    })
    return {
      category,
    }
  }
}
