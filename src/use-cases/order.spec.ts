import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { InMemoryOrderItemsRepository } from '@/repositories/in-memory/in-memory-order-items-repository'
import { OrderUseCase } from '@/use-cases/order'
import { MaxNumberOfOrdersError } from '@/use-cases/errors/max-number-of-orders-error'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'

let ordersRepository: InMemoryOrdersRepository
let productsRepository: InMemoryProductsRepository

let orderItemsRepository: InMemoryOrderItemsRepository
let usersRepository: InMemoryUsersRepository
let storesRepository: InMemoryStoresRepository
let sut: OrderUseCase

describe('Order Use Case', () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    productsRepository = new InMemoryProductsRepository()
    orderItemsRepository = new InMemoryOrderItemsRepository()
    usersRepository = new InMemoryUsersRepository()
    storesRepository = new InMemoryStoresRepository()
    sut = new OrderUseCase(
      ordersRepository,
      productsRepository,
      orderItemsRepository,
      storesRepository,
      usersRepository,
    )

    await storesRepository.create({
      id: 'loja-01',
      name: 'Loja do Braz',
      latitude: new Decimal(-46.9355272),
      longitude: new Decimal(-12.9332477),
      slug: null,
      created_at: new Date(),
    })

    await PrismaProductsRepository.create({
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

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Deve ser possível fazer o pedido', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { order } = await sut.execute({
      store_id: 'loja-01',
      user_id: 'user-01',
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      status: 'VALIDATED',
      totalAmount: 0,
      validated_at: null,
      created_at: new Date(),
      items: [
        { product_id: 'prod-01', quantity: 2, subtotal: 100 },
        { product_id: 'prod-02', quantity: 1, subtotal: 100 },
      ],
    })

    expect(order.id).toEqual(expect.any(String))
  })

  it('Não deve ser possível fazer 2 pedidos no mesmo dia.', async () => {
    vi.setSystemTime(new Date(2022, 0, 21, 9, 0, 0))

    await sut.execute({
      store_id: 'loja-01',
      user_id: 'user-01',
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      status: 'VALIDATED',
      totalAmount: 0,
      validated_at: null,
      created_at: new Date(),
      items: [{ product_id: 'prod-01', quantity: 1, subtotal: 200 }],
    })

    await expect(() =>
      sut.execute({
        store_id: 'loja-01',
        user_id: 'user-01',
        userLatitude: -46.9355272,
        userLongitude: -12.9332477,
        status: 'VALIDATED',
        totalAmount: 0,
        validated_at: null,
        created_at: new Date(),
        items: [{ productId: 'prod-02', quantity: 1, subtotal: 200 }],
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfOrdersError)
  })

  it('Não deve ser possível fazer o pedido distante da loja.', async () => {
    await storesRepository.create({
      id: 'loja-02',
      name: 'Loja do Braz',
      latitude: new Decimal(-13.0301369),
      longitude: new Decimal(-46.7780831),
      slug: 'logo.png',
      created_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        store_id: 'loja-02',
        user_id: 'user-01',
        userLatitude: -23.0301369,
        userLongitude: -46.6333831,
        status: 'VALIDATED',
        totalAmount: 0,
        validated_at: null,
        created_at: new Date(),
        items: [{ product_id: 'prod-01', quantity: 1, subtotal: 200 }],
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
