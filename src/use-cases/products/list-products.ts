import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'

export class ListProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute() {
    const products = await this.productsRepository.listMany()
    return products
  }
}
