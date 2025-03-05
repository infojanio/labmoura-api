import { CashbacksRepository } from '@/repositories/cashbacks-repository'

interface GetUserCashbackBalanceUseCaseRequest {
  user_id: string
}

interface GetUserCashbackBalanceUseCaseResponse {
  balance: number
}

export class GetUserCashbackBalanceUseCase {
  constructor(private cashbacksRepository: CashbacksRepository) {}

  async execute(
    request: GetUserCashbackBalanceUseCaseRequest,
  ): Promise<GetUserCashbackBalanceUseCaseResponse> {
    const { user_id } = request

    // Soma dos cashbacks recebidos
    const receivedCashback = await this.cashbacksRepository.totalCashbackByUserId(
      user_id,
    )

    // Soma dos cashbacks usados
    const usedCashback = await this.cashbacksRepository.totalUsedCashbackByUserId(
      user_id,
    )

    // Calcula o saldo atual
    const balance = receivedCashback - usedCashback

    return { balance }
  }
}
