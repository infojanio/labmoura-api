import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { Product, Prisma } from '@prisma/client'
interface FetchProductSubCategoryUseCaseRequest {
  subcategoryId: string
}

export class FetchProductsBySubCategoryUseCase {
  constructor(private productsRepository: ProductsRepository) {}
  async execute({
    subcategoryId,
  }: FetchProductSubCategoryUseCaseRequest): Promise<Product[] | null> {
    const products = await this.productsRepository.findBySubCategory(
      subcategoryId,
    )
    return products
  }
}
