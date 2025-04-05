import { SubCategoriesRepository } from '@/repositories/prisma/Iprisma/subcategories-repository'
import { Prisma, SubCategory } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PrismaSubCategoriesRepository } from '../prisma/prisma-subcategories-repository'
export class InMemorySubCategoriesRepository
  implements SubCategoriesRepository {
  public items: SubCategory[] = []

  listMany(): Promise<SubCategory[]> {
    throw new Error('Method not implemented.')
  }

  findByCategory(category_id: string): Promise<SubCategory[]> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string) {
    const subcategory = this.items.find((item) => item.id === id)
    if (!subcategory) {
      return null
    }
    return subcategory
  }
  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }
  async create(data: Prisma.SubCategoryUncheckedCreateInput) {
    const subcategory = {
      id: data.id ?? randomUUID(),
      name: data.name,
      image: data.image || null,
      category_id: data.category_id,
      products: data.products,
      created_at: new Date(),
    }
    this.items.push(subcategory)
    return subcategory
  }
}
