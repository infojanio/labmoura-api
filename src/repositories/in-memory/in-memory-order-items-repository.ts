import { prisma } from '@/lib/prisma'
import { Prisma, OrderItem } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'crypto'
import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'

export interface OrderItemsRepository {
  create(
    order_id: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void>
  findByOrderId(order_id: string): Promise<OrderItem[]>
}

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
  private ordersRepository: InMemoryOrdersRepository

  constructor(ordersRepository: InMemoryOrdersRepository) {
    this.ordersRepository = ordersRepository
  }

  async create(
    order_id: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void> {
    // 🔍 Verificar se o pedido existe na memória antes de consultar no banco
    const orderExists = this.ordersRepository.orders.find(
      (order) => order.id === order_id,
    )

    if (!orderExists) {
      throw new Error(`Pedido com ID ${order_id} não encontrado.`)
    }

    // ✅ Criar os itens diretamente na memória
    const newItems = items.map((item) => ({
      id: randomUUID(),
      order_id: order_id,
      product_id: item.product_id,
      quantity: new Prisma.Decimal(item.quantity),
      subtotal: new Prisma.Decimal(item.subtotal),
      created_at: new Date(),
    }))

    this.items.push(...newItems)
    console.log('items criados', newItems)
  }

  public items: OrderItem[] = []

  async createMany(
    orderItems: {
      order_id: string
      product_id: string
      quantity: Decimal
      subtotal: Decimal
    }[],
  ) {
    for (const item of orderItems) {
      await this.create(item.order_id, [item])
    }

    return this.items
  }

  async findByOrderId(order_id: string): Promise<OrderItem[]> {
    return this.items.filter((item) => item.order_id === order_id)
  }
}
