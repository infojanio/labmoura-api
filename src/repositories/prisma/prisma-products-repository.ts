import { prisma } from '@/lib/prisma'
import { Product, Prisma } from '@prisma/client'
import { ProductsRepository } from '../products-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class PrismaProductsRepository implements ProductsRepository {
  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    const product = await prisma.product.create({
      data,
    })
    console.log('📦 Dados recebidos para criar produto:', data) // 🛠️ Log antes de criar
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

  async findByIds(ids: string[]): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        id: { in: ids }, // Busca produtos cujos IDs estão na lista
      },
    })
  }

  async findByStoreId(store_id: string): Promise<Product[] | null> {
    const product = await prisma.product.findMany({
      where: {
        store_id,
      },
    })
    return product
  }

  async findBySubcategoryId(subcategory_id: string): Promise<Product[] | null> {
    const product = await prisma.product.findMany({
      where: {
        subcategory_id,
      },
    })
    return product
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const productUpdate = await prisma.product.update({
      where: { id },
      data: {
        quantity: {
          decrement: quantity, // Reduz o estoque
        },
      },
    })
    return productUpdate
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
    product_id: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product> {
    try {
      return await prisma.product.update({
        where: { id: product_id },
        data,
      })
    } catch (error) {
      throw new ResourceNotFoundError()
    }
  }

  async delete(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    const product = await prisma.product.findUnique({ where })

    if (!product) {
      throw new Error('Product not found')
    }

    return prisma.product.update({
      where,
      data: { status: false }, // Marca como "deletado"
    })
  }
}
