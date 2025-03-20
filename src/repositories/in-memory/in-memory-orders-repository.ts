import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
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

  async create(data: Prisma.OrderUncheckedCreateInput): Promise<Order> {
    const order: Order = {
      id: data.id ?? randomUUID(),
      user_id: data.user_id,
      store_id: data.store_id,
      totalAmount: data.totalAmount || new Prisma.Decimal(1),
      status: data.status ?? 'VALIDATED',
      validated_at: data.validated_at || new Date(),
      created_at: data.created_at ?? new Date(),
    }

    this.orders.push(order)

    return order
  }

  async createOrderItems(
    orderId: string,
    items: { product_id: string; quantity: number; subtotal: number }[],
  ): Promise<void> {
    console.log('Pedidos armazenados:', this.orders)

    const orderExists = this.orders.find((order) => order.id === orderId)

    if (!orderExists) {
      console.error(`Erro: Pedido com ID ${orderId} não encontrado.`)
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

  async balanceByUserId(userId: string): Promise<number> {
    const validatedCashbacks = this.cashbacks.filter((cashback) => {
      const order = this.orders.find((order) => order.id === cashback.order_id)
      return order?.user_id === userId && order?.validated_at !== null
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
