import { SubCategory, Prisma } from '@prisma/client'
export interface SubCategoriesRepository {
  findById(id: string): Promise<SubCategory | null>
  create(data: Prisma.SubCategoryUncheckedCreateInput): Promise<SubCategory>
  listMany(): Promise<SubCategory[]> //listar todas
  searchMany(search: string, page: number): Promise<SubCategory[]> //buscar por nome
  listByCategory(category_id?: string): Promise<SubCategory[] | null> //buscar por categoria
  findByCategory(category_id?: string): Promise<SubCategory[] | null> //buscar por categoria
}
