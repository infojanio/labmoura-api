import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchUserOrdersHistoryUseCase } from './fetch-user-orders-history'
let ordersRepository: InMemoryOrdersRepository
let sut: FetchUserOrdersHistoryUseCase
describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new FetchUserOrdersHistoryUseCase(ordersRepository)
  })
  it('Deve ser possível obter o histórico de pedidos', async () => {
    await ordersRepository.create({
      store_id: 'loja-01',
      user_id: 'user-01',
      status: 'VALIDATED',
      validated_at: new Date(),
      totalAmount: 200,
      created_at: new Date(),
    })
    await ordersRepository.create({
      store_id: 'loja-02',
      user_id: 'user-01',
      status: 'VALIDATED',
      validated_at: new Date(),
      totalAmount: 200,
      created_at: new Date(),
    })
    const { orders } = await sut.execute({
      userId: 'user-01',
      storeId: 'loja-02',
      status: 'VALIDATED',
      validated_at: new Date(),
      totalAmount: 200,
      created_at: new Date(),
      page: 1,
    })
    expect(orders).toHaveLength(2)
    expect(orders).toEqual([
      expect.objectContaining({ store_id: 'loja-01' }),
      expect.objectContaining({ store_id: 'loja-02' }),
    ])
  })

  it('Deve ser possível obter a lista paginada do histórico de pedidos.', async () => {
    for (let i = 1; i <= 22; i++) {
      await ordersRepository.create({
        store_id: `store-${i}`,
        user_id: 'user-01',
        status: 'VALIDATED',
        validated_at: new Date(),
        totalAmount: 200,
        created_at: new Date(),
      })
    }
    const { orders } = await sut.execute({
      storeId: 'loja-01',
      userId: 'user-01',
      page: 2, //page
      status: 'VALIDATED',
      validated_at: new Date(),
      totalAmount: 200,
      created_at: new Date(),
    })
    expect(orders).toHaveLength(2)
    expect(orders).toEqual([
      expect.objectContaining({ store_id: 'store-21' }),
      expect.objectContaining({ store_id: 'store-22' }),
    ])
  })
})
