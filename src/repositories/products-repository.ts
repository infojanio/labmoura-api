import { Prisma, Product } from '@prisma/client'

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>
  searchMany(search: string, page: number): Promise<Product[]> //buscar por nome
  update(data: {
    where: Prisma.ProductWhereUniqueInput
    data: Prisma.ProductUpdateInput
  }): Promise<Product>
  delete(id: Prisma.ProductWhereUniqueInput): Promise<Product>
}
