import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateCategoryUseCase } from './create-category'
let categoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase
describe('Create Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateCategoryUseCase(categoriesRepository)
  })
  it('Deve ser possível cadastrar uma categoria.', async () => {
    const { category } = await sut.execute({
      name: 'category-01',
      image: null,
      subcategory: 'iiss211212',
      created_at: new Date(),
    })
    expect(category.id).toEqual(expect.any(String))
  })
})
