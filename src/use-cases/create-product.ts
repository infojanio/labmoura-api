import { Product } from '@prisma/client'
import { ProductsRepository } from '@/repositories/products-repository'
import { StoresRepository } from '@/repositories/stores-repository'
import { SubCategoriesRepository } from '@/repositories/subcategories-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { error } from 'console'

interface CreateProductUseCaseRequest {
  name: string
  description?: string | null
  price: number
  quantity: number
  image?: string | null
  cashbackPercentage: number
  status: boolean
  storeId: string
  subcategoryId: string
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
    name,
    description,
    price,
    quantity,
    image,
    cashbackPercentage,
    status,
    storeId,
    subcategoryId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    // Verifica se a loja existe

    const storeExists = await this.storesRepository.findById(storeId)
    if (!storeExists) {
      throw new Error('não possui loja cadastrada')
    }

    // Verifica se a subcategoria existe
    const subcategoryExists = await this.subcategoriesRepository.findById(
      subcategoryId,
    )
    if (!subcategoryExists) {
      throw new Error('não possui subcategoria cadastrada')
    }

    // Cria o produto
    const product = await this.productsRepository.create({
      name,
      description,
      price,
      quantity,
      image,
      cashbackPercentage,
      status,
      store_id: storeId,
      subcategory_id: subcategoryId,
      created_at: new Date(),
    })

    console.log('productos', product)
    return { product }
  }
}
