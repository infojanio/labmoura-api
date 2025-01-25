import { prisma } from '@/lib/prisma'
import { CashbacksRepository } from '../cashbacks-repository'

export class PrismaCashbacksRepository implements CashbacksRepository {
  //total recebido pelo cliente
  async totalCashbackByUserId(userId: string): Promise<number> {
    const result = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: { user_id: userId, amount: { gt: 0 } }, // Considera apenas valores positivos
    })

    return result._sum.amount?.toNumber() || 0 // Retorna 0 se não houver resultado
  }

  //total utilizado pelo cliente
  async totalUsedCashbackByUserId(userId: string): Promise<number> {
    const result = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: { user_id: userId, amount: { lt: 0 } }, // Considera apenas valores negativos
    })

    return Math.abs(result._sum.amount?.toNumber() || 0) // Usa Math.abs para converter o total negativo em positivo
  }
}
