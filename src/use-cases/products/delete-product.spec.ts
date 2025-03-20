import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { DeleteProductUseCase } from './delete-product'
import { expect, describe, it, beforeEach } from 'vitest'

let productsRepository: InMemoryProductsRepository
let deleteProductUseCase: DeleteProductUseCase

describe('Delete Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    deleteProductUseCase = new DeleteProductUseCase(productsRepository)
  })

  it('Deve ser possível deletar um produto marcando status como false.', async () => {
    // Arrange: Cria um produto inicial
    const product = await productsRepository.create({
      id: 'product-id-1',
      name: 'Tênis',
      description: 'Nike, n.40',
      price: 220,
      quantity: 10,
      image: 'nike.png',
      status: true,
      cashbackPercentage: 30,
      store_id: '1453sdf1555',
      subcategory_id: '122355113fd',
      created_at: new Date(),
    })

    // Act: Executa o caso de uso de exclusão
    const { deletedProduct } = await deleteProductUseCase.execute({
      productId: product.id,
    })

    // Assert: Verifica que o produto foi marcado como deletado
    expect(deletedProduct.status).toBe(false)
    expect(deletedProduct.id).toBe(product.id)
  })

  it('Deve lançar um erro ao tentar deletar um produto inexistente.', async () => {
    await expect(
      deleteProductUseCase.execute({ productId: 'non-existent-id' }),
    ).rejects.toThrow('Product not found')
  })
})
