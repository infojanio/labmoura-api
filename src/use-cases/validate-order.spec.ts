import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { ValidateOrderUseCase } from './validate-order'
let ordersRepository: InMemoryOrdersRepository
let sut: ValidateOrderUseCase
describe('Validate Order Use Case', () => {
  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository()
    sut = new ValidateOrderUseCase(ordersRepository)
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('Deve ser possível validar o pedido.', async () => {
    const createdOrder = await ordersRepository.create({
      store_id: '6c9e20cc-010b-48c9-a71d-219d12427910',
      user_id: '6c9e20cc-010b-48c9-a71d-219d12427912',
      validated_at: new Date(),
      status: 'VALIDATED',
      totalAmount: 200,
      created_at: new Date(),
    })
    const { order } = await sut.execute({
      orderId: createdOrder.id,
    })
    expect(order.validated_at).toEqual(expect.any(Date))
    expect(ordersRepository.orders[0].validated_at).toEqual(expect.any(Date))
  })
  it('Não deve ser possível validar um pedido inexistente.', async () => {
    await expect(() =>
      sut.execute({
        orderId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Não deve ser possível validar o pedido após 48 hs da criação.', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40))
    const createdOrder = await ordersRepository.create({
      store_id: 'gym-01',
      user_id: 'user-01',
      totalAmount: 220,
    })
    //const twentyOneMinutesInMs = 1000 * 21
    const fourtyNineHoursInMs = 1000 * 60 * 60 * 49

    console.log(fourtyNineHoursInMs)

    vi.advanceTimersByTime(fourtyNineHoursInMs) //função avança no tempo
    await expect(() =>
      sut.execute({
        orderId: createdOrder.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
