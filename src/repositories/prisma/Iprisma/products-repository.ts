import { Prisma, Product } from '@prisma/client'

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>
  findByIds(ids: string[]): Promise<Product[]>
  updateStock(id: string, quantity: number): Promise<Product>
  findByStoreId(store_id: string): Promise<Product[] | null>
  findBySubcategoryId(subcategory_id: string): Promise<Product[] | null>
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>
  searchMany(search: string, page: number): Promise<Product[]> //buscar por nome
  update(
    product_id: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product>
  delete(where: Prisma.ProductWhereUniqueInput): Promise<Product>
}
