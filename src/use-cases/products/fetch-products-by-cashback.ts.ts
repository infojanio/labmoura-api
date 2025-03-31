import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { Product, Prisma } from '@prisma/client'
interface FetchProductCashbackUseCaseRequest {
  cashbackPercentage: number
}
interface FetchProductCashbackUseCaseResponse {
  products: Product[]
}
export class FetchProductsByCashbackUseCase {
  constructor(private productsRepository: ProductsRepository) {}
  async execute({
    cashbackPercentage,
  }: FetchProductCashbackUseCaseRequest): Promise<
    FetchProductCashbackUseCaseResponse
  > {
    const products = await this.productsRepository.findByCashback(
      cashbackPercentage,
    )
    return {
      products,
    }
  }
}
