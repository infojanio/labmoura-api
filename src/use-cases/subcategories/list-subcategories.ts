import { SubCategoriesRepository } from '@/repositories/prisma/Iprisma/subcategories-repository'

export class ListSubCategoriesUseCase {
  constructor(private subcategoriesRepository: SubCategoriesRepository) {}

  async execute() {
    const subcategories = await this.subcategoriesRepository.listMany()
    return subcategories
  }
}
