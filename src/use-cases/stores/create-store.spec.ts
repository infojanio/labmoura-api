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
      name: '6c9e20cc-010b-48c9-a71d-219d12427910',
      slug: null,
      latitude: -46.9355272,
      longitude: -12.9332477,
      address: {
        city: 'Campos Belos',
        state: 'Goiás',
        postalCode: '73840-000',
        street: 'Rua 5, qd. 6, lt. 1',
      },
    })
    expect(store.id).toEqual(expect.any(String))
  })
})
