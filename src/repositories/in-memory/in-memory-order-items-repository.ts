import { prisma } from '@/lib/prisma'
import { Prisma, OrderItem } from '@prisma/client'

export interface OrderItemsRepository {
  create(
    orderId: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void>
  findByOrderId(orderId: string): Promise<OrderItem[]>
}

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
  async create(
    orderId: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.orderItem.createMany({
      data: items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    })
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({
      where: { order_id: orderId },
    })
  }
}
