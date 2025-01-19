import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyStoresUseCase } from './fetch-nearby-stores'
let storesRepository: InMemoryStoresRepository
let sut: FetchNearbyStoresUseCase
describe('Fetch Nearby Stores Use Case', () => {
  beforeEach(async () => {
    storesRepository = new InMemoryStoresRepository()
    sut = new FetchNearbyStoresUseCase(storesRepository)
  })
  it('Deve ser possível buscar lojas próximas.', async () => {
    await storesRepository.create({
      name: 'Loja Campos Belos-GO',
      slug: null,
      latitude: -13.0305442,
      longitude: -46.7782443,
    })
    await storesRepository.create({
      name: 'Loja Arraias-TO',
      slug: null,
      latitude: -12.9298632,
      longitude: -46.9331187,
    })
    const { stores } = await sut.execute({
      userLatitude: -13.0300905,
      userLongitude: -46.7768974,
    })
    expect(stores).toHaveLength(1)
    expect(stores).toEqual([
      expect.objectContaining({ name: 'Loja Campos Belos-GO' }),
    ])
  })
})
