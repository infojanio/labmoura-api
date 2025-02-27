import { describe, expect, it, beforeEach } from 'vitest'

import { OrderUseCase } from '@/use-cases/order'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { OrderStatus } from '@prisma/client'
import { PrismaOrderItemsRepository } from '@/repositories/prisma/prisma-order-items-repository'
import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

let ordersRepository: PrismaOrdersRepository
let orderItemsRepository: PrismaOrderItemsRepository
let usersRepository: PrismaUsersRepository
let storesRepository: InMemoryStoresRepository
let sut: OrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    ordersRepository = new PrismaOrdersRepository()
    orderItemsRepository = new PrismaOrderItemsRepository()
    usersRepository = new InMemoryUsersRepository()
    storesRepository = new InMemoryStoresRepository()

    // Adicionado corretamente o orderItemsRepository no caso de uso
    sut = new OrderUseCase(
      ordersRepository,
      orderItemsRepository,
      storesRepository,
    )
  })

  it('deve criar um pedido com itens', async () => {
    const user = await usersRepository.create({
      data: {
        id: 'user-id-teste', // Ou use UUID aleatório
        name: 'Usuário Teste',
        email: 'teste@email.com',
        password_hash: 'senha-hash',
      },
    })

    const store = await storesRepository.create({
      id: 'store-01',
      name: 'Loja Teste',
      latitude: -23.55052,
      longitude: -46.633308,
    })

    const items = [
      { productId: 'product-01', quantity: 2, subtotal: 50 },
      { productId: 'product-02', quantity: 1, subtotal: 30 },
    ]

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)

    const { order } = await sut.execute({
      userId: 'user-01',
      storeId: store.id,
      userLatitude: -23.55052,
      userLongitude: -46.633308,
      totalAmount,
      validated_at: null,
      created_at: new Date(),
      status: OrderStatus.PENDING,
      items,
    })

    expect(order.id).toBeDefined()
    expect(order.totalAmount).toBe(totalAmount)

    // Verifica se os itens do pedido foram criados corretamente
    const orderItems = await orderItemsRepository.findByOrderId(order.id)
    expect(orderItems).toHaveLength(2)

    expect(orderItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product_id: 'product-01',
          quantity: 2,
          subtotal: 50,
        }),
        expect.objectContaining({
          product_id: 'product-02',
          quantity: 1,
          subtotal: 30,
        }),
      ]),
    )
  })
})
