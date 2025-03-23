import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateStoreUseCase } from './create-store'
import { InMemoryAddressesRepository } from '@/repositories/in-memory/in-memory-addresses-repository'

let storesRepository: InMemoryStoresRepository
let addressesRepository: InMemoryAddressesRepository
let sut: CreateStoreUseCase

describe('Create Store Use Case', () => {
  beforeEach(() => {
    storesRepository = new InMemoryStoresRepository()
    addressesRepository = new InMemoryAddressesRepository()
    sut = new CreateStoreUseCase(storesRepository, addressesRepository)
  })

  it('Deve ser possível cadastrar uma loja.', async () => {
    const { store } = await sut.execute({
      id: '45c1fac7-aacc-45cd-829e-9009282d8623',
      name: 'Loja Ramar',
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
