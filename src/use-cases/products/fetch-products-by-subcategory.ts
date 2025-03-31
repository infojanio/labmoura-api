import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { Product, Prisma } from '@prisma/client'
interface FetchProductSubCategoryUseCaseRequest {
  subcategory_id: string
}
interface FetchProductSubCategoryUseCaseResponse {
  product: Product[]
}
export class FetchProductsBySubCategoryUseCase {
  constructor(private productsRepository: ProductsRepository) {}
  async execute({
    subcategory_id,
  }: FetchProductSubCategoryUseCaseRequest): Promise<
    FetchProductSubCategoryUseCaseResponse
  > {
    const product = await this.productsRepository.findBySubCategory(
      subcategory_id,
    )
    return {
      product,
    }
  }
}
