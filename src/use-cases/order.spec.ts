import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  vi,
  afterAll,
  beforeAll,
} from 'vitest'
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
import { app } from '@/app'

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
  beforeAll(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    productsRepository = new InMemoryProductsRepository()

    orderItemsRepository = new InMemoryOrderItemsRepository(ordersRepository)

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

    await app.ready()

    const user = await usersRepository.create({
      id: '6c9e20cc-010b-48c9-a71d-219d12427913',
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
      phone: '62999115514',
      avatar: 'perfil',
      role: 'USER',
      created_at: new Date(),
    })
    console.log('user : ', user.id)

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

  afterAll(async () => {
    await app.close()

    vi.useRealTimers()
  })

  it('Deve adicionar o cashback corretamente ao fazer o pedido', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { order } = await sut.execute({
      id: '1375411c-0f71-4664-87b6-3172e321e313',
      store_id: 'loja-01',
      user_id: '6c9e20cc-010b-48c9-a71d-219d12427913',
      userLatitude: -12.9332477,
      userLongitude: -46.9355272,
      status: 'VALIDATED',
      totalAmount: 500,
      validated_at: null,
      created_at: new Date(),
      items: [{ product_id: 'prod-01', quantity: 2, subtotal: 250 * 2 }],
    })

    await cashbacksBalanceRepository.create({
      user_id: order.user_id,
      order_id: order.id, // Use o mesmo ID do pedido
      amount: 75,
    })

    const totalCashback = await cashbacksBalanceRepository.totalCashbackByUserId(
      '6c9e20cc-010b-48c9-a71d-219d12427913',
    )
    console.log('Dinheiro de volta:', totalCashback)

    expect(order.id).toEqual('1375411c-0f71-4664-87b6-3172e321e313')
    expect(order.totalAmount).toBe(500)
    expect(totalCashback).toBe(75) // 15% de 500
  })

  it('Não deve ser possível fazer 2 pedidos na mesma hora', async () => {
    vi.setSystemTime(new Date(2022, 0, 21, 9, 0, 0))

    const order1 = await sut.execute({
      id: '1375411c-0f71-4664-87b6-3172e321e313',
      store_id: 'loja-01',
      user_id: '6c9e20cc-010b-48c9-a71d-219d12427913',
      userLatitude: -12.9332477,
      userLongitude: -46.9355272,
      status: 'VALIDATED',
      totalAmount: 500,
      validated_at: null,
      created_at: new Date(),
      items: [{ product_id: 'prod-01', quantity: 2, subtotal: 250 * 2 }],
    })
    console.log('pedido1', order1)

    const order2 = await expect(() =>
      sut.execute({
        id: '1375411c-0f71-4664-87b6-3172e321e313',
        store_id: 'loja-01',
        user_id: '6c9e20cc-010b-48c9-a71d-219d12427913',
        userLatitude: -12.9332477,
        userLongitude: -46.9355272,
        status: 'VALIDATED',
        totalAmount: 500,
        validated_at: null,
        created_at: new Date(),
        items: [{ product_id: 'prod-01', quantity: 2, subtotal: 250 * 2 }],
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfOrdersError)
  })
})
