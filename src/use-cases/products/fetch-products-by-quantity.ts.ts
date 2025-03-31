import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { Product, Prisma } from '@prisma/client'
interface FetchProductQuantityUseCaseRequest {
  quantity: number
}
interface FetchProductQuantityUseCaseResponse {
  products: Product[]
}
export class FetchProductsByQuantityUseCase {
  constructor(private productsRepository: ProductsRepository) {}
  async execute({
    quantity,
  }: FetchProductQuantityUseCaseRequest): Promise<
    FetchProductQuantityUseCaseResponse
  > {
    const products = await this.productsRepository.findByQuantity(quantity)
    return {
      products,
    }
  }
}
