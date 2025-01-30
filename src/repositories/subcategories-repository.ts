import { SubCategory, Prisma } from '@prisma/client'
export interface SubCategoriesRepository {
  findById(id: string): Promise<SubCategory | null>
  create(data: Prisma.SubCategoryUncheckedCreateInput): Promise<SubCategory>
  searchMany(search: string, page: number): Promise<SubCategory[]> //buscar por nome
}
