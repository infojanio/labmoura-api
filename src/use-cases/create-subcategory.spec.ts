import { InMemorySubCategoriesRepository } from '@/repositories/in-memory/in-memory-subcategories-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateSubCategoryUseCase } from './create-subcategory'
let subcategoriesRepository: InMemorySubCategoriesRepository
let sut: CreateSubCategoryUseCase
describe('Create SubCategory Use Case', () => {
  beforeEach(() => {
    subcategoriesRepository = new InMemorySubCategoriesRepository()
    sut = new CreateSubCategoryUseCase(subcategoriesRepository)
  })
  it('Deve ser possível cadastrar uma subcategoria.', async () => {
    const { subcategory } = await sut.execute({
      name: 'loja-01',
      image: null,
      category_id: 'kdiikd2121313',
      products: 'Roupas, Calçados',
      created_at: new Date(),
    })
    expect(subcategory.id).toEqual(expect.any(String))
  })
})
