import { CashbacksRepository } from '@/repositories/cashbacks-repository'

interface GetUserCashbackBalanceUseCaseRequest {
  user_id: string
}

interface GetUserCashbackBalanceUseCaseResponse {
  totalReceived: number
  totalUsed: number
  balance: number
}

export class GetUserCashbackBalanceUseCase {
  constructor(private cashbacksRepository: CashbacksRepository) {}

  async execute({
    user_id,
  }: GetUserCashbackBalanceUseCaseRequest): Promise<
    GetUserCashbackBalanceUseCaseResponse
  > {
    const totalCashback: number = (
      await this.cashbacksRepository.totalCashbackByUserId(user_id)
    ).toNumber()
    const usedCashback: number = (
      await this.cashbacksRepository.totalUsedCashbackByUserId(user_id)
    ).toNumber()

    const balance = totalCashback - usedCashback

    return {
      totalReceived: totalCashback,
      totalUsed: usedCashback,
      balance,
    }
  }
}
