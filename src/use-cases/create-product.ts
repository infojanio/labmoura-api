import { Product } from '@prisma/client'
import { ProductsRepository } from '@/repositories/products-repository'
import { StoresRepository } from '@/repositories/stores-repository'
import { SubCategoriesRepository } from '@/repositories/subcategories-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { error } from 'console'

interface CreateProductUseCaseRequest {
  id?: string
  name: string
  description?: string | null
  price: number
  quantity: number
  image?: string | null
  cashbackPercentage: number
  status: boolean
  store_id: string
  subcategory_id: string
}

interface CreateProductUseCaseResponse {
  product: Product
}

export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storesRepository: StoresRepository,
    private subcategoriesRepository: SubCategoriesRepository,
  ) {}

  async execute({
    id,
    name,
    description,
    price,
    quantity,
    image,
    cashbackPercentage,
    status,
    store_id,
    subcategory_id,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    // Verifica se a loja existe

    console.log('store_id recebido:', store_id)
    const storeExists = await this.storesRepository.findById(store_id)
    if (!storeExists) {
      console.log('storeExists:', storeExists)
      throw new Error('A loja com esse ID não existe!')
    }

    // Verifica se a subcategoria existe
    const subcategoryExists = await this.subcategoriesRepository.findById(
      subcategory_id,
    )
    if (!subcategoryExists) {
      throw new Error('A subcategoria com esse ID não existe!')
    }

    // Cria o produto

    const product = await this.productsRepository.create({
      id,
      name,
      description,
      price,
      quantity,
      image,
      cashbackPercentage,
      status,
      store_id,
      subcategory_id,
      created_at: new Date(),
    })

    console.log('products', product)
    return { product }
  }
}
