import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCashbacksBalanceRepository } from '@/repositories/in-memory/in-memory-cashbacks-balance-repository'

let cashbacksRepository: InMemoryCashbacksBalanceRepository

describe('Cashback Balance Repository', () => {
  beforeEach(() => {
    cashbacksRepository = new InMemoryCashbacksBalanceRepository()
  })

  it('Deve ser possível criar um cashback', async () => {
    const cashback = await cashbacksRepository.create({
      user_id: 'user-01',
      order_id: 'order-01',
      amount: 50,
    })

    expect(cashback).toHaveProperty('id')
    expect(cashback.user_id).toBe('user-01')
    expect(cashback.order_id).toBe('order-01')
    expect(cashback.amount.toNumber()).toBe(50)
  })

  it('Deve calcular corretamente o total de cashback recebido pelo usuário', async () => {
    await cashbacksRepository.create({
      user_id: 'user-01',
      order_id: 'order-01',
      amount: 50,
    })
    await cashbacksRepository.create({
      user_id: 'user-01',
      order_id: 'order-02',
      amount: 30,
    })
    await cashbacksRepository.create({
      user_id: 'user-02',
      order_id: 'order-03',
      amount: 100,
    }) // Outro usuário

    const totalCashback = await cashbacksRepository.totalCashbackByUserId(
      'user-01',
    )

    expect(totalCashback).toBe(80) // 50 + 30 = 80
  })

  it('Deve calcular corretamente o total de cashback usado pelo usuário', async () => {
    await cashbacksRepository.create({
      user_id: 'user-01',
      order_id: 'order-01',
      amount: -20,
    })
    await cashbacksRepository.create({
      user_id: 'user-01',
      order_id: 'order-02',
      amount: -10,
    })
    await cashbacksRepository.create({
      user_id: 'user-02',
      order_id: 'order-03',
      amount: -50,
    }) // Outro usuário

    const totalUsedCashback = await cashbacksRepository.totalUsedCashbackByUserId(
      'user-01',
    )

    expect(totalUsedCashback).toBe(30) // 20 + 10 = 30
  })

  it('Deve calcular corretamente o saldo final de cashback do usuário', async () => {
    await cashbacksRepository.create({
      user_id: 'user-01',
      order_id: 'order-01',
      amount: 100,
    }) // Recebido
    await cashbacksRepository.create({
      user_id: 'user-01',
      order_id: 'order-02',
      amount: -40,
    }) // Usado
    await cashbacksRepository.create({
      user_id: 'user-01',
      order_id: 'order-03',
      amount: 20,
    }) // Recebido
    await cashbacksRepository.create({
      user_id: 'user-01',
      order_id: 'order-04',
      amount: -10,
    }) // Usado

    const totalReceived = await cashbacksRepository.totalCashbackByUserId(
      'user-01',
    )
    const totalUsed = await cashbacksRepository.totalUsedCashbackByUserId(
      'user-01',
    )
    const saldoFinal = totalReceived - totalUsed
    console.log('Saldo final:', saldoFinal)

    expect(totalReceived).toBe(120) // 100 + 20 = 120
    expect(totalUsed).toBe(50) // 40 + 10 = 50
    expect(saldoFinal).toBe(70) // 120 - 50 = 70
  })
})
