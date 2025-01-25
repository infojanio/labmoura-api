import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { GetProductUseCase } from '@/use-cases/get-product'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
let productsRepository: InMemoryProductsRepository
let sut: GetProductUseCase
describe('Get Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    sut = new GetProductUseCase(productsRepository)
  })
  it('Deve ser possível buscar um produto', async () => {
    const createdProduct = await productsRepository.create({
      id: '2445233ccc',
      name: 'Tênis',
      description: 'Marca Nike, n. 42',
      image: 'IMAGEM.jpg',
      price: 30,
      quantity: 10,
      cashbackPercentage: 15,
      status: true,
      store_id: '224fdfd33',
      subcategory_id: '11sdsd21',
      created_at: new Date(),
    })
    const { product } = await sut.execute({
      productId: createdProduct.id,
    })
    expect(product.id).toEqual('2445233ccc')
  })
  it('Não deve ser possível buscar um produto de id inexistente', async () => {
    await expect(() =>
      sut.execute({
        productId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
