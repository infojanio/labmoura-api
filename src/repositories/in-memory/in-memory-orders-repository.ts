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
    items: { productId: string; quantity: number; subtotal: number }[],
  ): Promise<void> {
    const orderExists = this.orders.find((order) => order.id === orderId)

    if (!orderExists) {
      throw new Error('Pedido não encontrado.')
    }

    items.forEach((item) => {
      this.orderItems.push({
        id: randomUUID(),
        order_id: orderId,
        product_id: item.productId,
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

    this.items.push(newOrder)
    return newOrder
  }

  async balanceByUserId(userId: string): Promise<number> {
    const userCashbacks = this.cashbacks.filter((cashback) => {
      const relatedOrder = this.orders.find(
        (order) => order.id === cashback.order_id,
      )

      // Considera apenas pedidos validados
      return cashback.user_id === userId && relatedOrder?.validated_at !== null
    })

    const balance = userCashbacks.reduce(
      (acc, cashback) => acc + cashback.amount.toNumber(),
      0,
    )

    return balance
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id === id)
    if (!order) {
      return null
    }
    return order
  }

  async save(order: Order) {
    const orderIndex = this.items.findIndex((item) => item.id === order.id)
    if (orderIndex >= 0) {
      this.items[orderIndex] = order
    }
    return order
  }

  public items: Order[] = []

  //encontra o pedido pelo id do usuário por página
  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  //encontra pedido feito no início do dia e no fim do dia
  async findByUserIdOnDate(userId: string, date: Date) {
    // Define o intervalo de uma hora
    const startOfTheDate = dayjs(date).startOf('date')
    const endOfTheDate = dayjs(date).endOf('date')

    // Verifica se existe algum pedido dentro do intervalo de uma hora
    const orderOnSameDate = this.items.find((order) => {
      const orderDate = dayjs(order.created_at) // Data da criação do pedido

      // Valida se a data está no intervalo de uma hora
      const isOnSameDate =
        orderDate.isAfter(startOfTheDate) && orderDate.isBefore(endOfTheDate)

      return order.user_id === userId && isOnSameDate
    })

    // Retorna o pedido encontrado ou null
    if (!orderOnSameDate) {
      return null
    }

    return orderOnSameDate
  }

  async findByUserIdLastHour(
    userId: string,
    date: Date,
  ): Promise<Order | null> {
    const oneHourAgo = dayjs(date).subtract(1, 'hour')

    return (
      this.items.find((order) => {
        const orderCreatedAt = dayjs(order.created_at)

        return order.user_id === userId && orderCreatedAt.isAfter(oneHourAgo)
      }) || null
    )
  }

  //encontra pedido feito no início da hora e no fim daquela hora
  async findByUserIdOnHour(userId: string, date: Date) {
    // Define o intervalo de uma hora
    const startOfTheHour = dayjs(date).startOf('hour')
    const endOfTheHour = dayjs(date).endOf('hour')

    // Verifica se existe um pedido do usuário dentro do intervalo de uma hora
    const orderOnSameHour = this.items.find((order) => {
      const orderCreatedAt = dayjs(order.created_at)

      return (
        order.user_id === userId &&
        orderCreatedAt.isAfter(startOfTheHour) &&
        orderCreatedAt.isBefore(endOfTheHour)
      )
    })

    return orderOnSameHour || null
  }
}
