import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchStoresUseCase } from './search-stores'
let storesRepository: InMemoryStoresRepository
let sut: SearchStoresUseCase
describe('Search Stores Use Case', () => {
  beforeEach(async () => {
    storesRepository = new InMemoryStoresRepository()
    sut = new SearchStoresUseCase(storesRepository)
  })
  it('Deve buscar pelo nome da loja', async () => {
    await storesRepository.create({
      name: 'JavaScript Gym',
      slug: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    await storesRepository.create({
      name: 'TypeScript Gym',
      slug: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    const { stores } = await sut.execute({
      search: 'JavaScript',
      page: 1,
    })
    expect(stores).toHaveLength(1)
    expect(stores).toEqual([
      expect.objectContaining({ name: 'JavaScript Gym' }),
    ])
  })
  it('Deve buscar pelo nome da loja por nome com paginação', async () => {
    for (let i = 1; i <= 22; i++) {
      await storesRepository.create({
        name: `Loja Gym ${i}`,
        slug: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    }
    const { stores } = await sut.execute({
      search: 'Loja',
      page: 2,
    })
    expect(stores).toHaveLength(2)
    expect(stores).toEqual([
      expect.objectContaining({ name: 'Loja Gym 21' }),
      expect.objectContaining({ name: 'Loja Gym 22' }),
    ])
  })
})
