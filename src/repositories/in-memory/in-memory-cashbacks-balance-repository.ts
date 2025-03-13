import { Cashback } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface CashbacksRepository {
  findByUserId(user_id: string): Promise<Cashback[]>
}

export class InMemoryCashbacksBalanceRepository implements CashbacksRepository {
  public items: Cashback[] = []

  async findByUserId(user_id: string): Promise<Cashback[]> {
    return this.items.filter((cashback) => cashback.user_id === user_id)
  }

  async create(data: { user_id: string; order_id: string; amount: number }) {
    console.log('Cashback criado:', data)

    const cashback: Cashback = {
      id: `cashback-${this.items.length + 1}`, // Simula um ID único
      user_id: data.user_id,
      order_id: data.order_id,
      amount: new Decimal(data.amount || 0),
      credited_at: new Date(),
    }

    this.items.push(cashback)
    console.log('CASHBACK:', cashback)
    return cashback
  }

  //total recebido pelo cliente
  async totalCashbackByUserId(user_id: string): Promise<number> {
    const saldoReceive = this.items
      .filter(
        (cashback) =>
          cashback.user_id === user_id &&
          new Decimal(cashback.amount).toNumber() > 0,
      ) // Filtra apenas valores positivos
      .reduce(
        (total, cashback) => total + new Decimal(cashback.amount).toNumber(),
        0,
      ) // Soma os valores positivos

    console.log('Saldo recebido', saldoReceive)
    return saldoReceive
  }

  //total usado pelo cliente
  async totalUsedCashbackByUserId(user_id: string): Promise<number> {
    const SaldoUsed = this.items
      .filter(
        (cashback) =>
          cashback.user_id === user_id &&
          new Decimal(cashback.amount).toNumber() < 0,
      ) // Negativos representam saldo usado
      .reduce(
        (total, cashback) =>
          total + Math.abs(new Decimal(cashback.amount).toNumber()),
        0,
      ) // Usa Math.abs para somar valores absolutos
    console.log('Saldo usado', SaldoUsed)
    return SaldoUsed
  }
}
