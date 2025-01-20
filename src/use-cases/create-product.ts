import { ProductsRepository } from '@/repositories/products-repository'
import { Product } from '@prisma/client'
interface CreateProductUseCaseRequest {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  image: string
  cashbackPercentage: number // Define um valor padrão caso não seja informado.
  store_id: string
  subcategory_id: string
  created_at: Date
}
interface CreateProductUseCaseResponse {
  product: Product
}
export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}
  async execute({
    id,
    name,
    description,
    price,
    quantity,
    image,
    cashbackPercentage,
    store_id,
    subcategory_id,
    created_at,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = await this.productsRepository.create({
      id,
      name,
      description,
      price,
      quantity,
      image,
      cashbackPercentage,
      store_id,
      subcategory_id,
      created_at,
    })
    return {
      product,
    }
  }
}
