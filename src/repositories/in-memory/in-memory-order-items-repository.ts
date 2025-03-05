import { prisma } from '@/lib/prisma'
import { Prisma, OrderItem } from '@prisma/client'

export interface OrderItemsRepository {
  create(
    order_id: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void>
  findByOrderId(order_id: string): Promise<OrderItem[]>
}

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
  async create(
    order_id: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.orderItem.createMany({
      data: items.map((item) => ({
        order_id: order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    })
  }

  async findByOrderId(order_id: string): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({
      where: { order_id: order_id },
    })
  }
}
