import { Cashback } from '@prisma/client'

export interface CashbacksRepository {
  findByUserId(userId: string): Promise<Cashback[]>
}

export class InMemoryCashbacksRepository implements CashbacksRepository {
  public items: Cashback[] = []

  async findByUserId(userId: string): Promise<Cashback[]> {
    return this.items.filter((cashback) => cashback.user_id === userId)
  }
}
