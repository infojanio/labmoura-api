import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateProductUseCase } from './create-product'
import { InMemorySubCategoriesRepository } from '@/repositories/in-memory/in-memory-subcategories-repository'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { Decimal } from '@prisma/client/runtime/library'
let productsRepository: InMemoryProductsRepository
let storesRepository: InMemoryStoresRepository
let subcategoriesRepository: InMemorySubCategoriesRepository
let sut: CreateProductUseCase
describe('Create Product Use Case', () => {
  beforeEach(async () => {
    productsRepository = new InMemoryProductsRepository()
    storesRepository = new InMemoryStoresRepository()
    subcategoriesRepository = new InMemorySubCategoriesRepository()
    sut = new CreateProductUseCase(
      productsRepository,
      storesRepository,
      subcategoriesRepository,
    )

    //cria uma loja
    await storesRepository.create({
      id: 'loja-01',
      name: 'Loja do Braz',
      latitude: new Decimal(-12.9332477),
      longitude: new Decimal(-46.9355272),
      slug: null,
      created_at: new Date(),
    })

    await subcategoriesRepository.create({
      id: 'subcategory-01',
      name: 'loja-01',
      image: null,
      category_id: 'f6d6a0a6-2f1c-486f-88ff-740469735340',
      created_at: new Date(),
    })
  })

  it('Deve ser possível cadastrar um produto.', async () => {
    const { product } = await sut.execute({
      id: '6c9e20cc-010b-48c9-a71d-219d12427913',
      name: 'Tênis',
      description: 'Nike, n.40',
      price: 220,
      quantity: 10,
      image: 'nike.png',
      status: false,
      cashbackPercentage: 30,
      store_id: 'loja-01', //f6d6a0a6-2f1c-486f-88ff-740469735337
      subcategory_id: 'subcategory-01', //f6d6a0a6-2f1c-486f-88ff-740469735338
    })
    expect(product.id).toEqual(expect.any(String))
  })
})
