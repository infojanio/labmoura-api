import { prisma } from '@/lib/prisma'
import { Product, Prisma } from '@prisma/client'
import { ProductsRepository } from '../products-repository'

export class PrismaProductsRepository implements ProductsRepository {
  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    const product = await prisma.product.create({
      data,
    })
    return product
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    })
    return product
  }

  async searchMany(search: string, page: number): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search, //verifica se contem a palavra
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return products
  }

  /**
   * Atualiza um produto no banco de dados.
   *
   * @param data - Objeto contendo `where` para localizar o produto e `data` com os campos a serem atualizados.
   * @returns O produto atualizado.
   */

  async update(data: {
    where: Prisma.ProductWhereUniqueInput
    data: Prisma.ProductUpdateInput
  }): Promise<Product> {
    return prisma.product.update({
      where: data.where, // Exemplo: { id: 'product_id' }
      data: data.data, // Exemplo: { name: 'Novo Nome', price: 99.99 }
    })
  }

  /**
   * Remove um produto do banco de dados.
   *
   * @param where - Filtro único para localizar o produto (ex.: `id`).
   * @returns O produto excluído.
   */
  async delete(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    return prisma.product.delete({
      where, // Exemplo: { id: 'product_id' }
    })
  }
}
