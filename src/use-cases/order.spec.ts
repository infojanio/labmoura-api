import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { OrderUseCase } from '@/use-cases/order'
import { MaxNumberOfOrdersError } from './errors/max-number-of-orders-error'
import { MaxDistanceError } from './errors/max-distance-error'

let ordersRepository: InMemoryOrdersRepository
let storesRepository: InMemoryStoresRepository
let sut: OrderUseCase

describe('Order Use Case', () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    storesRepository = new InMemoryStoresRepository()
    sut = new OrderUseCase(ordersRepository, storesRepository)

    //todos os testes já terão loja criada
    await storesRepository.create({
      id: 'loja-01',
      name: 'Loja do Braz',
      latitude: -46.9355272,
      longitude: -12.9332477,
      slug: null,
      created_at: new Date(),
    })

    vi.useFakeTimers()
  })

  //depois de executar os testes criar datas reais
  afterEach(() => {
    vi.useRealTimers()
  })

  it('Deve ser possível fazer o pedido', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { order } = await sut.execute({
      storeId: 'loja-01',
      userId: 'user-01',
      totalAmount: 200,
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      validated_at: new Date(),
      status: 'VALIDATED',
      created_at: new Date(),
    })
    expect(order.id).toEqual(expect.any(String))
  })

  it('Não deve ser possível fazer 2 pedidos no mesmo dia.', async () => {
    vi.setSystemTime(new Date(2022, 0, 21, 9, 0, 0))
    //1. pedido
    await sut.execute({
      storeId: 'loja-01',
      userId: 'user-01',
      totalAmount: 200,
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      validated_at: new Date(),
      status: 'VALIDATED',
      created_at: new Date(),
    })

    //2. pedido
    await expect(() =>
      sut.execute({
        storeId: 'loja-01',
        userId: 'user-01',
        totalAmount: 200,
        userLatitude: -46.9355272,
        userLongitude: -12.9332477,
        validated_at: new Date(),
        status: 'VALIDATED',
        created_at: new Date(),
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfOrdersError)
  })

  it('Deve ser possível fazer 2 pedidos, mas em dias diferentes.', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    //1. pedido
    await sut.execute({
      storeId: 'loja-01',
      userId: 'user-01',
      totalAmount: 200,
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      validated_at: new Date(),
      status: 'VALIDATED',
      created_at: new Date(),
    })
    vi.setSystemTime(new Date(2022, 0, 21, 7, 0, 0))
    //2. pedido
    const { order } = await sut.execute({
      storeId: 'loja-01',
      userId: 'user-01',
      totalAmount: 200,
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      validated_at: new Date(),
      status: 'VALIDATED',
      created_at: new Date(),
    })
    expect(order.id).toEqual(expect.any(String))
  })

  it('Não deve ser possível fazer o pedido distante da loja.', async () => {
    storesRepository.items.push({
      id: 'loja-02',
      name: 'Loja do Braz',
      latitude: new Decimal(-46.7780831),
      longitude: new Decimal(-13.0301369),
      slug: 'logo.png',
      created_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        storeId: 'loja-02',
        userId: 'user-01',
        totalAmount: 200,
        userLatitude: -46.9355272,
        userLongitude: -12.9332477,
        validated_at: new Date(),
        status: 'VALIDATED',
        created_at: new Date(),
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('Não deve ser possível fazer 2 pedidos na mesma hora.', async () => {
    // vi.useFakeTimers()
    const fixedTime = new Date(2022, 0, 21, 9, 0, 0)
    const fixedTime2 = new Date(2022, 0, 21, 9, 0, 0)

    vi.setSystemTime(fixedTime)
    console.log(fixedTime)
    //1. pedido
    await sut.execute({
      storeId: 'loja-01',
      userId: 'user-01',
      totalAmount: 200,
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      status: 'VALIDATED',
      validated_at: new Date(),
      created_at: fixedTime,
    })

    //2. pedido
    await expect(() =>
      sut.execute({
        storeId: 'loja-01',
        userId: 'user-01',
        totalAmount: 200,
        userLatitude: -46.9355272,
        userLongitude: -12.9332477,
        validated_at: new Date(),
        status: 'VALIDATED',
        created_at: fixedTime2,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfOrdersError)
    // Restaura o comportamento normal dos timers
    vi.useRealTimers()
  })

  it('Deve ser possível fazer 2 pedidos, mas em horas diferentes.', async () => {
    const fixedTime = new Date(2022, 0, 20, 10, 20, 15)
    const fixedTime2 = new Date(2022, 0, 20, 12, 20, 15)
    console.log('1. pedido: hs:', fixedTime)
    console.log('2. pedido: hs:', fixedTime2)

    vi.setSystemTime(fixedTime)
    //1. pedido
    await sut.execute({
      storeId: 'loja-01',
      userId: 'user-01',
      totalAmount: 200,
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      validated_at: new Date(),
      status: 'VALIDATED',
      created_at: fixedTime,
    })
    vi.setSystemTime(fixedTime2)
    //2. pedido
    const { order } = await sut.execute({
      storeId: 'loja-01',
      userId: 'user-01',
      totalAmount: 200,
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      validated_at: new Date(),
      status: 'VALIDATED',
      created_at: fixedTime2,
    })
    expect(order.id).toEqual(expect.any(String))
  })
})
