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

  async update(
    productId: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product> {
    // Valida se o produto existe antes de tentar atualizar
    const existingProduct = await this.findById(productId)
    if (!existingProduct) {
      throw new Error('Product not found')
    }
    // Atualiza o produto no banco de dados
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data,
    })
    return updatedProduct
  }

  async delete(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    const product = await prisma.product.findUnique({ where })

    if (!product) {
      throw new Error('Product not found')
    }

    return prisma.product.update({
      where,
      data: { status: true }, // Marca como "deletado"
    })
  }
}
