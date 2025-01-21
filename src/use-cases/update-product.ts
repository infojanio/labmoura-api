import { ProductsRepository } from '@/repositories/products-repository'
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
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    // Atualiza o produto com os novos dados
    const updatedProduct = await this.productsRepository.update(productId, data)

    return { updatedProduct }
  }
}
