import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { Product } from '@prisma/client'

interface DeleteProductUseCaseRequest {
  productId: string
}

export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ productId }: DeleteProductUseCaseRequest) {
    // Verifica se o produto existe
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    // Marca o produto como deletado (status: true)
    const deletedProduct = await this.productsRepository.delete({
      id: productId,
    })
    console.log('RESULT', deletedProduct)

    return { deletedProduct }
  }
}
