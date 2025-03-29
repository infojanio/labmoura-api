import { CategoriesRepository } from '@/repositories/prisma/Iprisma/categories-repository'

export class ListCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute() {
    const categories = await this.categoriesRepository.listMany()
    return categories
  }
}
