import { prisma } from '@/lib/prisma'
import { ProductsRepository } from '@/repositories/products-repository'

import { Prisma, Product } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryProductsRepository implements ProductsRepository {
  async update(data: {
    where: Prisma.ProductWhereUniqueInput
    data: Prisma.ProductUpdateInput
  }): Promise<Product> {
    return prisma.product.update({
      where: data.where, // Ex: { id: "product_id" }
      data: data.data, // Ex: { name: "New Product Name", price: 100 }
    })
  }

  async delete(where: { id: string }): Promise<Product> {
    const productIndex = this.items.findIndex(
      (product) => product.id === where.id,
    )

    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    this.items[productIndex].status = true
    return this.items[productIndex]
  }

  public items: Product[] = []
  async findById(id: string) {
    const product = this.items.find((item) => item.id === id)
    if (!product) {
      return null
    }
    return product
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.ProductUncheckedCreateInput) {
    const product = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description || null,
      price: new Prisma.Decimal(data.price), // Converte o preço para Decimal.,
      quantity: new Prisma.Decimal(data.quantity), // Converte o preço para Decimal.
      status: data.status,
      image: data.image || null,
      cashbackPercentage: data.cashbackPercentage || 0, // Define um valor padrão caso não seja informado.
      store_id: data.store_id,
      subcategory_id: data.subcategory_id,
      created_at: data.created_at || new Date(),
    }
    this.items.push(product)

    return product
  }
}
