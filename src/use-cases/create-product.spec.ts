import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateProductUseCase } from './create-product'
let productsRepository: InMemoryProductsRepository
let sut: CreateProductUseCase
describe('Create Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    sut = new CreateProductUseCase(productsRepository)
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
      store_id: '1453sdf1555',
      subcategory_id: '122355113fd',
      created_at: new Date(),
    })
    expect(product.id).toEqual(expect.any(String))
  })
})
