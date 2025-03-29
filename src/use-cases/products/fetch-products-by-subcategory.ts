import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { Product, Prisma } from '@prisma/client'
interface FetchProductUseCaseRequest {
  subcategory_id: string
}
interface FetchProductUseCaseResponse {
  product: Product[]
}
export class FetchProductsBySubCategoryUseCase {
  constructor(private productsRepository: ProductsRepository) {}
  async execute({
    subcategory_id,
  }: FetchProductUseCaseRequest): Promise<FetchProductUseCaseResponse> {
    const product = await this.productsRepository.findBySubCategory(
      subcategory_id,
    )
    return {
      product,
    }
  }
}
