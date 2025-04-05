import { CategoriesRepository } from '@/repositories/prisma/Iprisma/categories-repository'
import { Prisma, Category } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PrismaCategoriesRepository } from '../prisma/prisma-categories-repository'
export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  listMany(): Promise<Category[]> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string) {
    const category = this.items.find((item) => item.id === id)
    if (!category) {
      return null
    }
    return category
  }
  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }
  async create(data: Prisma.CategoryCreateInput) {
    const category = {
      id: data.id ?? randomUUID(),
      name: data.name,
      image: data.image || null,
      created_at: new Date(),
      //subcategory: data.SubCategory,
    }
    this.items.push(category)
    return category
  }
}
