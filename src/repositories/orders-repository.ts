import { Order, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface OrdersRepository {
  create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>
  findById(id: string): Promise<Order | null>
  /*findByUserIdOnDate(userId: string, date: Date): Promise<Order | null>
  findByUserIdOnHour(
    userId: string,
    date: Date,
  ): Promise<Order | boolean | null>
  */
  findByUserIdLastHour(
    userId: string,
    date: Date,
  ): Promise<Order | boolean | null>

  findManyByUserId(userId: string, page: number): Promise<Order[]>
  save(order: Order): Promise<Order>
  balanceByUserId(userId: string): Promise<number | Decimal>
}
