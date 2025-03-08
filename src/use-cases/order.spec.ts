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
import { InMemoryCashbacksBalanceRepository } from '@/repositories/in-memory/in-memory-cashbacks-balance-repository'

let ordersRepository: InMemoryOrdersRepository
let productsRepository: InMemoryProductsRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let usersRepository: InMemoryUsersRepository
let storesRepository: InMemoryStoresRepository
let cashbacksBalanceRepository: InMemoryCashbacksBalanceRepository // Novo repositório
let sut: OrderUseCase

describe('Order Use Case', () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    productsRepository = new InMemoryProductsRepository()
    orderItemsRepository = new InMemoryOrderItemsRepository()
    usersRepository = new InMemoryUsersRepository()
    storesRepository = new InMemoryStoresRepository()
    cashbacksBalanceRepository = new InMemoryCashbacksBalanceRepository() // Novo repositório
    sut = new OrderUseCase(
      ordersRepository,
      productsRepository,
      orderItemsRepository,
      storesRepository,
      usersRepository,
      cashbacksBalanceRepository, // Passamos o repositório de cashback
    )

    await storesRepository.create({
      id: 'loja-01',
      name: 'Loja do Braz',
      latitude: new Decimal(-12.9332477),
      longitude: new Decimal(-46.9355272),
      slug: null,
      created_at: new Date(),
    })

    await productsRepository.create({
      id: 'prod-01',
      name: 'Tênis',
      description: 'Nike, n.40',
      price: 220,
      quantity: 10,
      image: 'nike.png',
      status: true,
      cashbackPercentage: 30, // 30% de cashback
      store_id: 'loja-01',
      subcategory_id: 'sub-01',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Deve ser possível fazer o pedido e calcular o cashback corretamente', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { order } = await sut.execute({
      store_id: 'loja-01',
      user_id: 'user-01',
      userLatitude: -12.9332477,
      userLongitude: -46.9355272,
      status: 'VALIDATED',
      validated_at: null,
      created_at: new Date(),
      items: [
        { product_id: 'prod-01', quantity: 2, subtotal: 220 * 2 }, // Total = 440
      ],
    })

    expect(order.id).toEqual(expect.any(String))
    expect(order.totalAmount).toBe(440)

    // Verificar se o cashback foi registrado corretamente
    const totalCashback = await cashbacksBalanceRepository.totalCashbackByUserId(
      'user-01',
    )
    console.log('Você ganhou:', totalCashback)
    expect(totalCashback).toBe(132) // 30% de 440 = 132
  })

  it('Não deve ser possível fazer 2 pedidos na mesma hora', async () => {
    vi.setSystemTime(new Date(2022, 0, 21, 9, 0, 0))

    await sut.execute({
      store_id: 'loja-01',
      user_id: 'user-01',
      userLatitude: -12.9332477,
      userLongitude: -46.9355272,
      status: 'VALIDATED',
      validated_at: null,
      created_at: new Date(),
      items: [{ product_id: 'prod-01', quantity: 1, subtotal: 220 }],
    })

    await expect(() =>
      sut.execute({
        store_id: 'loja-01',
        user_id: 'user-01',
        userLatitude: -12.9332477,
        userLongitude: -46.9355272,
        status: 'VALIDATED',
        validated_at: null,
        created_at: new Date(),
        items: [{ product_id: 'prod-01', quantity: 1, subtotal: 220 }],
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
        validated_at: null,
        created_at: new Date(),
        items: [{ product_id: 'prod-01', quantity: 1, subtotal: 200 }],
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
