import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { Product } from '@prisma/client'

interface UpdateProductUseCaseRequest {
  productId: string
  name?: string
  description?: string
  price?: number
  quantity?: number
  image?: string
  status?: boolean
  cashbackPercentage?: number
  store_id?: string
  subcategory_id?: string
}

interface UpdateProductUseCaseResponse {
  updatedProduct: Product
}

export class UpdateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    ...data
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    // Verifica se o produto existe
    const existingProduct = await this.productsRepository.findById(productId)

    if (!existingProduct) {
      throw new Error('Product not found')
    }

    // Atualiza o produto
    const updatedProduct = await this.productsRepository.update(productId, data)
    console.log('PRODUCT AQUI:', updatedProduct)
    return { updatedProduct }
  }
}
