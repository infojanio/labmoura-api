import { Order, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface OrdersRepository {
  create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>

  createOrderItems(
    orderId: string,
    items: { product_id: string; quantity: number; subtotal: number }[],
  ): Promise<void>

  findById(id: string): Promise<Order | null>
  findByUserIdLastHour(
    userId: string,
    date: Date,
  ): Promise<Order | boolean | null>

  findManyByUserId(userId: string, page: number): Promise<Order[]>
  save(order: Order): Promise<Order>
  balanceByUserId(userId: string): Promise<number | Decimal>
}
