import { prisma } from '@/lib/prisma'
import { Product, Prisma } from '@prisma/client'
import { ProductsRepository } from './Iprisma/products-repository'
import { ResourceNotFoundError } from '@/utils/messages/errors/resource-not-found-error'

export class PrismaProductsRepository implements ProductsRepository {
  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    //fazer verificação para não cadastrar o mesmo produto

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

  async listMany(): Promise<Product[]> {
    const products = await prisma.product.findMany()
    return products
  }

  async findByCashback(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        cashbackPercentage: {
          gte: 5, // Retorna produtos com cashback maior ou igual a 5
          //   gte: cashbackPercentage, // Busca produtos com cashback maior que o valor informado
        },
      },
    })

    return products
  }

  async findByQuantity(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        quantity: {
          lte: 5, // Retorna produtos com quantidade menor ou igual a 5
          //   gte: cashbackPercentage, // Busca produtos com cashback maior que o valor informado
        },
      },
    })

    return products
  }

  async findBySubCategory(subcategoryId: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        subcategory_id: subcategoryId,
      },
    })
    return products
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
