import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { OrderUseCase } from '@/use-cases/order'
import { MaxNumberOfOrdersError } from '@/use-cases/errors/max-number-of-orders-error'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { InMemoryCashbacksBalanceRepository } from '@/repositories/in-memory/in-memory-cashbacks-balance-repository'
import { hash } from 'bcryptjs'

import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { InMemorySubCategoriesRepository } from '@/repositories/in-memory/in-memory-subcategories-repository'
import { InMemoryOrderItemsRepository } from '@/repositories/in-memory/in-memory-order-items-repository'

let ordersRepository: InMemoryOrdersRepository
let productsRepository: InMemoryProductsRepository
let orderItemsRepository: InMemoryOrderItemsRepository
let usersRepository: InMemoryUsersRepository
let storesRepository: InMemoryStoresRepository
let cashbacksBalanceRepository: InMemoryCashbacksBalanceRepository
let categoryRepository: InMemoryCategoriesRepository
let subcategoryRepository: InMemorySubCategoriesRepository

let sut: OrderUseCase

describe('Order Use Case', () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    productsRepository = new InMemoryProductsRepository()
    orderItemsRepository = new InMemoryOrderItemsRepository()
    usersRepository = new InMemoryUsersRepository()
    storesRepository = new InMemoryStoresRepository()
    cashbacksBalanceRepository = new InMemoryCashbacksBalanceRepository()

    categoryRepository = new InMemoryCategoriesRepository()
    subcategoryRepository = new InMemorySubCategoriesRepository()

    sut = new OrderUseCase(
      ordersRepository,
      productsRepository,
      orderItemsRepository,
      storesRepository,
      usersRepository,
      cashbacksBalanceRepository,
    )

    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
      phone: '62999115514',
      avatar: 'perfil',
      role: 'USER',
      created_at: new Date(),
    })

    await storesRepository.create({
      id: 'loja-01',
      name: 'Loja do Braz',
      latitude: new Decimal(-12.9332477),
      longitude: new Decimal(-46.9355272),
      slug: null,
      created_at: new Date(),
    })

    await categoryRepository.create({
      id: 'category-01',
      name: 'categoria-01',
      image: null,
      created_at: new Date(),
    })

    await subcategoryRepository.create({
      id: 'subcategory-01',
      name: 'Roupas',
      image: null,
      category_id: 'category-01',
      created_at: new Date(),
    })

    await productsRepository.create({
      id: 'prod-01',
      name: 'Tênis Nike',
      description: 'Masculino, n.40',
      price: 250,
      quantity: 10,
      image: 'foto.jpg',
      store_id: 'loja-01',
      subcategory_id: 'subcategory-01',
      cashbackPercentage: 15,
      status: true,
      created_at: new Date(),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Deve ser possível fazer o pedido e calcular o cashback corretamente', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { order } = await sut.execute({
      id: 'order-01',
      store_id: 'loja-01',
      user_id: 'user-01',
      userLatitude: -12.9332477,
      userLongitude: -46.9355272,
      status: 'VALIDATED',
      totalAmount: 500,
      validated_at: null,
      created_at: new Date(),
      items: [{ product_id: 'prod-01', quantity: 2, subtotal: 250 * 2 }],
    })

    expect(order.id).toEqual('order-01')
    expect(order.totalAmount).toBe(500)

    // Cashback esperado: 15% de 500 = 75
    const totalCashback = await cashbacksBalanceRepository.totalCashbackByUserId(
      'user-01',
    )
    expect(totalCashback).toBe(75)
  })

  it('Não deve ser possível fazer 2 pedidos na mesma hora', async () => {
    vi.setSystemTime(new Date(2022, 0, 21, 9, 0, 0))

    await sut.execute({
      id: 'order-01',
      store_id: 'loja-01',
      user_id: 'user-01',
      userLatitude: -12.9332477,
      userLongitude: -46.9355272,
      status: 'VALIDATED',
      totalAmount: 250,
      validated_at: null,
      created_at: new Date(),
      items: [{ product_id: 'prod-01', quantity: 1, subtotal: 250 }],
    })

    await expect(() =>
      sut.execute({
        id: 'order-02',
        store_id: 'loja-01',
        user_id: 'user-01',
        userLatitude: -12.9332477,
        userLongitude: -46.9355272,
        status: 'VALIDATED',
        totalAmount: 250,
        validated_at: null,
        created_at: new Date(),
        items: [{ product_id: 'prod-01', quantity: 1, subtotal: 250 }],
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfOrdersError)
  })
})
