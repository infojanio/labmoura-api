import { prisma } from '@/lib/prisma'
import { ProductsRepository } from '@/repositories/products-repository'

import { Prisma, Product } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryProductsRepository implements ProductsRepository {
  async update(
    productId: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product> {
    const productIndex = this.items.findIndex((item) => item.id === productId)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }
    // Recupera o produto existente
    const existingProduct = this.items[productIndex]
    // Atualiza os campos fornecidos no data
    const updatedProduct: Product = {
      ...existingProduct,
      name: data.name ? (data.name as string) : existingProduct.name,
      description: data.description
        ? (data.description as string)
        : existingProduct.description,
      price: data.quantity ? (data.price as number) : existingProduct.quantity,
      quantity: data.quantity
        ? (data.quantity as number)
        : existingProduct.quantity,

      image: data.image ? (data.image as string) : existingProduct.image,

      status: data.status ? (data.status as boolean) : existingProduct.status,

      cashbackPercentage: data.cashbackPercentage
        ? (data.cashbackPercentage as number)
        : existingProduct.cashbackPercentage,
      store_id: data.store_id
        ? (data.store_id as string)
        : existingProduct.store_id,
      subcategory_id: data.subcategory_id
        ? (data.subcategory_id as string)
        : existingProduct.subcategory_id,
      created_at: existingProduct.created_at,
    }
    // Substitui o produto existente pelo atualizado
    this.items[productIndex] = updatedProduct
    return updatedProduct
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

  async findByStoreId(store_id: string) {
    const product = this.items.find((item) => item.id === store_id)
    if (!product) {
      return null
    }
    return product
  }

  async findBySubcategoryId(subcategory_id: string) {
    const product = this.items.find((item) => item.id === subcategory_id)
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
      price: data.price || 0,
      quantity: data.quantity || 0,
      status: data.status || false,
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
