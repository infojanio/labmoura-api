import { prisma } from '@/lib/prisma'
import { OrdersRepository } from '@/repositories/orders-repository'
import { Order, Prisma, PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
export class PrismaOrdersRepository implements OrdersRepository {
  private prisma = new PrismaClient()
  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    })
    return order
  }

  //encontra pedido feito em 1 dia
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')
    const order = await prisma.order.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })
    return order
  }

  //encontra pedido feito em 1 hora
  async findByUserIdOnHour(userId: string, date: Date) {
    const startOfTheHour = dayjs(date).startOf('hour')
    const endOfTheHour = dayjs(date).endOf('hour')
    const order = await prisma.order.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheHour.toDate(),
          lte: endOfTheHour.toDate(),
        },
      },
    })

    return order
  }

  async findManyByUserId(userId: string, page: number) {
    const orders = await prisma.order.findMany({
      where: {
        user_id: userId,
      },
      skip: (page - 1) * 20,
      take: 20,
    })
    return orders
  }
  async countByUserId(userId: string) {
    const count = await prisma.order.count({
      where: {
        user_id: userId,
      },
    })
    return count
  }
  async create(data: Prisma.OrderUncheckedCreateInput) {
    const order = await prisma.order.create({
      data,
    })
    return order
  }
  async save(data: Order) {
    const order = await prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })
    return order
  }

  async balanceByUserId(userId: string): Promise<number> {
    const validatedCashbacks = await this.prisma.cashback.findMany({
      where: {
        user_id: userId,
        order: {
          validated_at: {
            not: null, // Considera apenas pedidos validados
          },
        },
      },
      select: {
        amount: true,
      },
    })

    const balance = validatedCashbacks.reduce(
      (acc, cashback) => acc + cashback.amount.toNumber(),
      0,
    )

    return balance
  }
}
