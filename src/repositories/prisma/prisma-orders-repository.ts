import { prisma } from '@/lib/prisma'
import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { Order, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

export class PrismaOrdersRepository implements OrdersRepository {
  // Retorna 1 pedido por ID
  async findById(id: string): Promise<Order | null> {
    return await prisma.order.findUnique({ where: { id } })
  }

  // Encontra pedido feito na última hora
  async findByUserIdLastHour(
    userId: string,
    date: Date,
  ): Promise<Order | boolean | null> {
    const oneHourAgo = dayjs(date).subtract(1, 'hour').toDate()

    return await prisma.order.findFirst({
      where: {
        user_id: userId,
        created_at: { gte: oneHourAgo },
      },
    })
  }

  // Retorna vários pedidos por ID de cliente
  async findManyByUserId(userId: string, page: number): Promise<Order[]> {
    return await prisma.order.findMany({
      where: { user_id: userId },
      skip: (page - 1) * 20,
      take: 20,
    })
  }

  async create(data: Prisma.OrderUncheckedCreateInput) {
    const order = await prisma.order.create({
      data,
    })
    return order
  }

  async createOrderItems(
    order_id: string,
    items: { product_id: string; quantity: number; subtotal: number }[],
  ): Promise<void> {
    if (items.length === 0) return

    await prisma.orderItem.createMany({
      data: items.map((item) => ({
        order_id: order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    })
  }

  // Atualiza ou insere um pedido no banco
  async save(order: Order): Promise<Order> {
    const existingOrder = await prisma.order.findUnique({
      where: { id: order.id },
    })

    if (existingOrder) {
      return await prisma.order.update({
        where: { id: order.id },
        data: order,
      })
    } else {
      return await prisma.order.create({ data: order })
    }
  }

  // Retorna o saldo do usuário considerando apenas pedidos validados
  async balanceByUserId(userId: string): Promise<number> {
    const validatedCashbacks = await prisma.cashback.findMany({
      where: {
        user_id: userId,
        order: { validated_at: { not: null } }, // Apenas pedidos validados
      },
      select: { amount: true },
    })

    return validatedCashbacks.reduce(
      (acc, cashback) => acc + new Prisma.Decimal(cashback.amount).toNumber(),
      0,
    )
  }
}
