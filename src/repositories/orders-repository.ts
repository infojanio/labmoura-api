import { Order, Prisma } from '@prisma/client'

export interface OrdersRepository {
  create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>
  findById(id: string): Promise<Order | null>
  findByUserIdOnDate(userId: string, date: Date): Promise<Order | null>
  findManyByUserId(userId: string, page: number): Promise<Order[]>
  save(order: Order): Promise<Order>
  balanceByUserId(userId: string): Promise<number>
}
