import { prisma } from '@/lib/prisma'

import { Order, Prisma } from '@prisma/client'

import { CashbacksRepository } from '../cashbacks-repository'
import { Cashback } from '@prisma/client'
export class PrismaCashbacksRepository implements CashbacksRepository {
  prisma: any
  async findByUserId(userId: string): Promise<Cashback[]> {
    return this.prisma.cashback.findMany({
      where: { user_id: userId },
    })
  }
  async balanceByUserId(userId: string): Promise<number> {
    const totalBalance = await this.prisma.cashback.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        user_id: userId,
      },
    })

    return totalBalance._sum.amount || 0 // Retorna 0 se não houver saldo
  }
}
