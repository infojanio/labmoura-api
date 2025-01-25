import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { UpdateProductUseCase } from './update-product'
import { expect, describe, it, beforeEach } from 'vitest'
import { Prisma } from '@prisma/client'

let productsRepository: InMemoryProductsRepository
let updateProductUseCase: UpdateProductUseCase

describe('Update Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    updateProductUseCase = new UpdateProductUseCase(productsRepository)
  })

  it('Deve ser possível atualizar um produto existente.', async () => {
    // Arrange: Cria um produto inicial
    const product = await productsRepository.create({
      id: 'product-id-1',
      name: 'Tênis',
      description: 'Nike, n.40',
      price: 210,
      quantity: 10,
      image: 'nike.png',
      status: false,
      cashbackPercentage: 30,
      store_id: '1453sdf1555',
      subcategory_id: '122355113fd',
      created_at: new Date(),
    })

    // Act: Atualiza o produto
    const { updatedProduct } = await updateProductUseCase.execute({
      productId: product.id,
      name: 'Tênis Atualizado',
      description: 'Nike, n.40',
      price: 220,
      quantity: 100,
      image: 'nike.png',
      status: true,
      cashbackPercentage: 32,
      store_id: '1453sdf1555',
      subcategory_id: '122355113fd',
    })
    console.log('display:', updatedProduct)
    // Assert: Verifica que os dados foram atualizados
    expect(updatedProduct.id).toBe(product.id)
    expect(updatedProduct.name).toBe('Tênis Atualizado')
    expect(updatedProduct.description).toBe('Nike, n.40')
    expect(updatedProduct.store_id).toBe('1453sdf1555')
    expect(updatedProduct.cashbackPercentage).toBe(32)
    expect(updatedProduct.price).toBe(220)
    expect(updatedProduct.quantity).toBe(100)
  })

  it('Deve lançar um erro ao tentar atualizar um produto inexistente.', async () => {
    await expect(
      updateProductUseCase.execute({
        productId: 'non-existent-id',
        name: 'Produto Inexistente',
      }),
    ).rejects.toThrow('Product not found')
  })
})
