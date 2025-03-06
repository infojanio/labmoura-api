import { prisma } from '@/lib/prisma'
import { Prisma, OrderItem } from '@prisma/client'

export interface OrderItemsRepository {
  create(
    order_id: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void>

  findByOrderId(orderId: string): Promise<OrderItem[]>
  /*
  createMany(
    orderItems: Prisma.OrderItemCreateManyInput[],
  ): Promise<OrderItem[]>
  */
}

export class PrismaOrderItemsRepository implements OrderItemsRepository {
  async createMany(orderItems: Prisma.OrderItemCreateManyInput[]) {
    // Certifique-se de que todos os order_ids existem antes de inserir
    const orderIds = orderItems.map((item) => item.order_id)
    const existingOrders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      select: { id: true },
    })

    const existingOrderIds = new Set(existingOrders.map((o) => o.id))
    const invalidOrderIds = orderIds.filter((id) => !existingOrderIds.has(id))

    if (invalidOrderIds.length > 0) {
      throw new Error(
        `Os seguintes order_id não existem: ${invalidOrderIds.join(', ')}`,
      )
    }

    return prisma.orderItem.createMany({ data: orderItems })
  }

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
    return await prisma.orderItem.findMany({
      where: { order_id: order_id },
    })
  }
}
