import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateStoreUseCase } from './create-store'
let storesRepository: InMemoryStoresRepository
let sut: CreateStoreUseCase
describe('Create Store Use Case', () => {
  beforeEach(() => {
    storesRepository = new InMemoryStoresRepository()
    sut = new CreateStoreUseCase(storesRepository)
  })
  it('Deve ser possível cadastrar uma loja.', async () => {
    const { store } = await sut.execute({
      name: 'loja-01',
      slug: null,
      latitude: -46.9355272,
      longitude: -12.9332477,
      //created_at: new Date(),
    })
    expect(store.id).toEqual(expect.any(String))
  })
})
