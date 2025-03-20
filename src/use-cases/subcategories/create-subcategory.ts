import { SubCategoriesRepository } from '@/repositories/prisma/Iprisma/subcategories-repository'
import { SubCategory, Prisma } from '@prisma/client'
interface CreateSubCategoryUseCaseRequest {
  id?: string
  name: string
  image: string | null
  category_id: string
  created_at: Date
  //products: string
}
interface CreateSubCategoryUseCaseResponse {
  subcategory: SubCategory
}
export class CreateSubCategoryUseCase {
  constructor(private subcategoriesRepository: SubCategoriesRepository) {}
  async execute({
    id,
    name,
    image,
    category_id,
    created_at,
  }: //products,
  CreateSubCategoryUseCaseRequest): Promise<CreateSubCategoryUseCaseResponse> {
    const subcategory = await this.subcategoriesRepository.create({
      id,
      name,
      image,
      category_id,
      created_at,
      //products,
    })
    return {
      subcategory,
    }
  }
}
