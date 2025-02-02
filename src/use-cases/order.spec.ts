import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { OrderUseCase } from '@/use-cases/order'
import { MaxNumberOfOrdersError } from './errors/max-number-of-orders-error'
import { MaxDistanceError } from './errors/max-distance-error'
import dayjs from 'dayjs'

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

  it('Deve impedir que o usuário faça mais de um pedido em menos de 1 hora', async () => {
    const date = new Date()

    // Cria o primeiro pedido
    await sut.execute({
      storeId: 'loja-01',
      userId: 'user-123',
      totalAmount: 200,
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      validated_at: new Date(),
      status: 'VALIDATED',
      created_at: date,
    })

    // Tenta criar um segundo pedido dentro da mesma hora
    await expect(() =>
      sut.execute({
        storeId: 'loja-01',
        userId: 'user-123',
        totalAmount: 220,
        userLatitude: -46.9355272,
        userLongitude: -12.9332477,
        validated_at: new Date(),
        status: 'VALIDATED',
        created_at: dayjs(date).add(30, 'minutes').toDate(), // 30 minutos depois
      }),
    ).rejects.toThrowError(MaxNumberOfOrdersError)
  })

  it('Deve permitir que o usuário faça um novo pedido após 1 hora', async () => {
    // Cria o primeiro pedido
    await sut.execute({
      storeId: 'loja-01',
      userId: 'user-01',
      totalAmount: 200,
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      validated_at: new Date(),
      status: 'VALIDATED',
      created_at: dayjs().subtract(2, 'hour').toDate(), // 2 horas atrás
    })

    // Cria um segundo pedido após 1 hora e 1 minuto
    const newOrder = await sut.execute({
      storeId: 'loja-01',
      userId: 'user-01',
      totalAmount: 200,
      userLatitude: -46.9355272,
      userLongitude: -12.9332477,
      validated_at: new Date(),
      status: 'VALIDATED',
      created_at: new Date(),
    })

    expect(newOrder).toBeDefined()
  })
})
