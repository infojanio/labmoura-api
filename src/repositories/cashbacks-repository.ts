import { Cashback } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface CashbacksRepository {
  findByUserId(userId: string): Promise<Cashback[]>
  // balanceByUserId(userId: string): Promise<number>
  totalCashbackByUserId(userId: string): Promise<number | Decimal>
  totalUsedCashbackByUserId(userId: string): Promise<number | Decimal>
}
