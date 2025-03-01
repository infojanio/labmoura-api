import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateProductUseCase } from './create-product'
import { InMemorySubCategoriesRepository } from '@/repositories/in-memory/in-memory-subcategories-repository'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
let productsRepository: InMemoryProductsRepository
let storesRepository: InMemoryStoresRepository
let subcategoriesRepository: InMemorySubCategoriesRepository
let sut: CreateProductUseCase
describe('Create Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    storesRepository = new InMemoryStoresRepository()
    subcategoriesRepository = new InMemorySubCategoriesRepository()
    sut = new CreateProductUseCase(
      productsRepository,
      storesRepository,
      subcategoriesRepository,
    )
  })
  it('Deve ser possível cadastrar um produto.', async () => {
    const { product } = await sut.execute({
      name: 'Tênis',
      description: 'Nike, n.40',
      price: 220,
      quantity: 10,
      image: 'nike.png',
      status: false,
      cashbackPercentage: 30,
      store_id: 'f6d6a0a6-2f1c-486f-88ff-740469735337',
      subcategory_id: 'f6d6a0a6-2f1c-486f-88ff-740469735338',
    })
    expect(product.id).toEqual(expect.any(String))
  })
})
