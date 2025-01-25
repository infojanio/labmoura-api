import { OrdersRepository } from '@/repositories/orders-repository'
import { Prisma, Order, Cashback } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'

export class InMemoryOrdersRepository implements OrdersRepository {
  public orders: Order[] = []
  public cashbacks: Cashback[] = []

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

  async create(data: Prisma.OrderUncheckedCreateInput) {
    //async create(data: Order) {
    const newOrder = {
      id: randomUUID(),
      user_id: data.user_id,
      store_id: data.store_id,
      totalAmount: new Decimal(200), //data.totalAmount || new Decimal(200),
      status: data.status || 'PENDING', // Valor padrão
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: data.created_at || new Date(),
    }
    this.items.push(newOrder)
    return newOrder
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

  //encontra pedido feito no início da hora e no fim daquela hora
  async findByUserIdOnHour(userId: string, date: Date) {
    // Define o intervalo de uma hora
    const startOfTheHour = dayjs(date).startOf('hour')
    const endOfTheHour = dayjs(date).endOf('hour')

    // Verifica se existe algum pedido dentro do intervalo de uma hora
    const orderOnSameHour = this.items.find((order) => {
      const orderHour = dayjs(order.created_at) // Data da criação do pedido

      // Valida se a data está no intervalo de uma hora
      const isOnSameHour =
        orderHour.isAfter(startOfTheHour) && orderHour.isBefore(endOfTheHour)

      return order.user_id === userId && isOnSameHour
    })

    // Retorna o pedido encontrado ou null
    if (!orderOnSameHour) {
      return null
    }

    return orderOnSameHour
  }
}
