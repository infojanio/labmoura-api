import { ProductsRepository } from '@/repositories/products-repository'
import { Product } from '@prisma/client'
interface CreateProductUseCaseRequest {
  //id: string
  name: string
  description: string | null
  price: number
  quantity: number
  image: string | null
  status: boolean
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
    // id,
    name,
    description,
    price,
    quantity,
    image,
    status,
    cashbackPercentage,
    store_id,
    subcategory_id,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = await this.productsRepository.create({
      // id,
      name,
      description,
      price,
      quantity,
      image,
      status,
      cashbackPercentage,
      store_id,
      subcategory_id,
    })
    return {
      product,
    }
  }
}
