import { describe, expect, it, beforeEach } from 'vitest'

import { OrderUseCase } from '@/use-cases/order'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { OrderStatus } from '@prisma/client'
import { PrismaOrderItemsRepository } from '@/repositories/prisma/prisma-order-items-repository'
import { PrismaOrdersRepository } from '@/repositories/prisma/prisma-orders-repository'

let ordersRepository: PrismaOrdersRepository
let orderItemsRepository: PrismaOrderItemsRepository
let storesRepository: InMemoryStoresRepository
let sut: OrderUseCase

describe('Balance Calculation Use Case', () => {
  beforeEach(() => {
    ordersRepository = new PrismaOrdersRepository()
    orderItemsRepository = new PrismaOrderItemsRepository()
    storesRepository = new InMemoryStoresRepository()
    sut = new OrderUseCase(
      ordersRepository,
      storesRepository,
      //  orderItemsRepository,
    )
  })

  it('deve calcular corretamente o saldo do usuário', async () => {
    const store = await storesRepository.create({
      id: 'store-01',
      name: 'Loja Teste',
      latitude: -23.55052,
      longitude: -46.633308,
    })

    const { order: order1 } = await sut.execute({
      userId: 'user-01',
      storeId: store.id,
      userLatitude: -23.55052,
      userLongitude: -46.633308,
      totalAmount: 80,
      validated_at: new Date(),
      created_at: new Date(),
      status: OrderStatus.VALIDATED,
      items: [
        { productId: 'product-01', quantity: 1, subtotal: 50 },
        { productId: 'product-02', quantity: 1, subtotal: 30 },
      ],
    })

    const { order: order2 } = await sut.execute({
      userId: 'user-01',
      storeId: store.id,
      userLatitude: -23.55052,
      userLongitude: -46.633308,
      totalAmount: 120,
      validated_at: new Date(),
      created_at: new Date(),
      status: OrderStatus.VALIDATED,
      items: [{ productId: 'product-03', quantity: 2, subtotal: 60 }],
    })

    const balance = await ordersRepository.balanceByUserId('user-01')

    expect(balance).toBe(200) // 80 + 120
  })
})
