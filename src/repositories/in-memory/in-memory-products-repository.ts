import { ProductsRepository } from '@/repositories/prisma/Iprisma/products-repository'
import { Prisma, Product } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'crypto'

export class InMemoryProductsRepository implements ProductsRepository {
  findByQuantity(quantity: number): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
  findByCashback(cashbackPercentage: number): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
  listMany(): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
  findBySubCategory(subcategory_id: string): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
  public items: Product[] = []

  async findByIds(ids: string[]): Promise<Product[]> {
    return this.items.filter((item) => ids.includes(item.id))
  }

  async updateStock(productId: string, quantity: number): Promise<Product> {
    const productIndex = this.items.findIndex((item) => item.id === productId)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    const existingQuantity = new Decimal(this.items[productIndex].quantity) // Converte para Decimal
    this.items[productIndex].quantity = existingQuantity.plus(quantity) // Usa `.plus()` do Decimal

    return this.items[productIndex]
  }
  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    const product: Product = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description || null,
      price: data.price || 0,
      quantity: data.quantity || 0,
      status: data.status ?? false, // Garante que o status padrão seja false
      image: data.image || null,
      cashbackPercentage: data.cashbackPercentage || 0,
      store_id: data.store_id,
      subcategory_id: data.subcategory_id,
      created_at: data.created_at ?? new Date(),
    }

    this.items.push(product)
    return product
  }

  async findById(id: string): Promise<Product | null> {
    return this.items.find((item) => item.id === id) || null
  }

  async findByStoreId(store_id: string): Promise<Product[]> {
    return this.items.filter((item) => item.store_id === store_id)
  }

  async findBySubcategoryId(subcategory_id: string): Promise<Product[]> {
    return this.items.filter((item) => item.subcategory_id === subcategory_id)
  }

  async searchMany(query: string, page: number): Promise<Product[]> {
    return this.items
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async update(
    productId: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product> {
    const productIndex = this.items.findIndex((item) => item.id === productId)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    const existingProduct = this.items[productIndex]

    // Atualiza os campos, garantindo que valores não sejam sobrescritos por `undefined`
    const updatedProduct: Product = {
      ...existingProduct,
      name:
        data.name !== undefined ? (data.name as string) : existingProduct.name,
      description:
        data.description !== undefined
          ? (data.description as string)
          : existingProduct.description,
      price:
        data.price !== undefined
          ? (data.price as number)
          : existingProduct.price,
      quantity:
        data.quantity !== undefined
          ? (data.quantity as number)
          : existingProduct.quantity,
      image:
        data.image !== undefined
          ? (data.image as string)
          : existingProduct.image,
      status:
        data.status !== undefined
          ? (data.status as boolean)
          : existingProduct.status,
      cashbackPercentage:
        data.cashbackPercentage !== undefined
          ? (data.cashbackPercentage as number)
          : existingProduct.cashbackPercentage,
      store_id:
        data.store_id !== undefined
          ? (data.store_id as string)
          : existingProduct.store_id,
      subcategory_id:
        data.subcategory_id !== undefined
          ? (data.subcategory_id as string)
          : existingProduct.subcategory_id,
      created_at: existingProduct.created_at,
    }

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

    this.items[productIndex].status = false // Marca como inativo
    return this.items[productIndex]
  }
}
