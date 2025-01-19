import { Cashback } from '@prisma/client'

export interface CashbacksRepository {
  findByUserId(userId: string): Promise<Cashback[]>
  balanceByUserId(userId: string): Promise<number>
}
