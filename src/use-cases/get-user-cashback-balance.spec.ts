import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import { GetUserCashbackBalanceUseCase } from '@/use-cases/get-user-cashback-balance'
import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'

let ordersRepository: InMemoryOrdersRepository
let sut: GetUserCashbackBalanceUseCase

describe('Get User Cashback Balance', () => {
  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new GetUserCashbackBalanceUseCase(ordersRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Deve calcular o saldo correto de reembolso para um usuário', async () => {
    // Mock data
    ordersRepository.cashbacks.push(
      {
        id: '1',
        user_id: 'user-1',
        order_id: 'order-1',
        amount: 10,
        credited_at: new Date(),
      },
      {
        id: '2',
        user_id: 'user-1',
        order_id: 'order-2',
        amount: 20,
        credited_at: new Date(),
      },
      {
        id: '3',
        user_id: 'user-2',
        order_id: 'order-3',
        amount: 15,
        credited_at: new Date(),
      },
    )

    const response = await sut.execute({ userId: 'user-1' })

    expect(response.balance).toBe(30)
  })

  it('Deve mostrar 0 para usuário sem saldo', async () => {
    const response = await sut.execute({ userId: 'user-3' })

    expect(response.balance).toBe(0)
  })
})
