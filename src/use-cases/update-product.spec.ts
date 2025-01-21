import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { UpdateProductUseCase } from './update-product'
import { expect, describe, it, beforeEach } from 'vitest'

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
      price: 220,
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
      price: 250,
    })

    // Assert: Verifica que os dados foram atualizados
    expect(updatedProduct.name).toBe('Tênis Atualizado')
    expect(updatedProduct.price).toBe(250)
    expect(updatedProduct.id).toBe(product.id)
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
