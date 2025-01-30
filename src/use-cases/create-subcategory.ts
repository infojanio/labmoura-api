import { SubCategoriesRepository } from '@/repositories/subcategories-repository'
import { SubCategory, Prisma } from '@prisma/client'
interface CreateSubCategoryUseCaseRequest {
  name: string
  image: string | null
  category_id: string
  products: string
  created_at: Date
}
interface CreateSubCategoryUseCaseResponse {
  subcategory: SubCategory
}
export class CreateSubCategoryUseCase {
  constructor(private subcategoriesRepository: SubCategoriesRepository) {}
  async execute({
    name,
    image,
    category_id,
    products,
    created_at,
  }: CreateSubCategoryUseCaseRequest): Promise<
    CreateSubCategoryUseCaseResponse
  > {
    const subcategory = await this.subcategoriesRepository.create({
      name,
      image,
      category_id,
      products,
      created_at,
    })
    return {
      subcategory,
    }
  }
}
