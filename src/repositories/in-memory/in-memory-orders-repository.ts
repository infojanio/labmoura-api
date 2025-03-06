import { prisma } from '@/lib/prisma'
import { OrdersRepository } from '@/repositories/orders-repository'
import { Prisma, Order, Cashback } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'

export class InMemoryOrdersRepository implements OrdersRepository {
  public orders: Order[] = []
  public cashbacks: Cashback[] = []

  public orderItems: {
    id: string
    order_id: string
    product_id: string
    quantity: number
    subtotal: number
  }[] = []

  async createOrderItems(
    orderId: string,
    items: { product_id: string; quantity: number; subtotal: number }[],
  ): Promise<void> {
    const orderExists = this.orders.find((order) => order.id === orderId)

    if (!orderExists) {
      throw new Error('Pedido não encontrado.')
    }

    items.forEach((item) => {
      this.orderItems.push({
        id: randomUUID(),
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })
    })
  }

  async create(data: Omit<Order, 'id'>): Promise<Order> {
    const newOrder: Order = {
      id: randomUUID(),
      ...data,
    }

    this.orders.push(newOrder)
    return newOrder
  }

  async balanceByUserId(userId: string): Promise<number> {
    const validatedCashbacks = await prisma.cashback.findMany({
      where: {
        user_id: userId,
        order: { validated_at: { not: null } }, // Verifica pedidos validados
      },
      select: { amount: true, order_id: true },
    })

    console.log('Cashbacks encontrados:', validatedCashbacks)

    if (validatedCashbacks.length === 0) {
      console.log('Nenhum cashback encontrado para o usuário:', userId)
      return 0
    }

    const balance = validatedCashbacks.reduce(
      (acc, cashback) => acc.plus(cashback.amount),
      new Decimal(0),
    )

    console.log('Saldo calculado:', balance.toNumber())
    return balance.toNumber()
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((order) => order.id === id) || null
  }

  async save(order: Order): Promise<Order> {
    const orderIndex = this.orders.findIndex((o) => o.id === order.id)
    if (orderIndex >= 0) {
      this.orders[orderIndex] = order
    }
    return order
  }

  async findManyByUserId(userId: string, page: number): Promise<Order[]> {
    return this.orders
      .filter((order) => order.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<Order | null> {
    const startOfTheDate = dayjs(date).startOf('date')
    const endOfTheDate = dayjs(date).endOf('date')

    return (
      this.orders.find((order) => {
        const orderDate = dayjs(order.created_at)
        return (
          order.user_id === userId &&
          orderDate.isAfter(startOfTheDate) &&
          orderDate.isBefore(endOfTheDate)
        )
      }) || null
    )
  }

  async findByUserIdLastHour(
    userId: string,
    date: Date,
  ): Promise<Order | null> {
    const oneHourAgo = dayjs(date).subtract(1, 'hour')

    return (
      this.orders.find((order) => {
        const orderCreatedAt = dayjs(order.created_at)
        return order.user_id === userId && orderCreatedAt.isAfter(oneHourAgo)
      }) || null
    )
  }

  async findByUserIdOnHour(userId: string, date: Date): Promise<Order | null> {
    const startOfTheHour = dayjs(date).startOf('hour')
    const endOfTheHour = dayjs(date).endOf('hour')

    return (
      this.orders.find((order) => {
        const orderCreatedAt = dayjs(order.created_at)
        return (
          order.user_id === userId &&
          orderCreatedAt.isAfter(startOfTheHour) &&
          orderCreatedAt.isBefore(endOfTheHour)
        )
      }) || null
    )
  }
}
