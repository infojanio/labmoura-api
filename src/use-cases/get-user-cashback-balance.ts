import { OrdersRepository } from '@/repositories/orders-repository'
import { CashbacksRepository } from '@/repositories/cashbacks-repository'

interface GetUserCashbackBalanceUseCaseRequest {
  userId: string
}

interface GetUserCashbackBalanceUseCaseResponse {
  balance: number
}

export class GetUserCashbackBalanceUseCase {
  constructor(
    //  private ordersRepository: OrdersRepository,
    private cashbacksRepository: CashbacksRepository,
  ) {}

  async execute(
    request: GetUserCashbackBalanceUseCaseRequest,
  ): Promise<GetUserCashbackBalanceUseCaseResponse> {
    const { userId } = request

    // Soma dos cashbacks recebidos
    const receivedCashback = await this.cashbacksRepository.totalCashbackByUserId(
      userId,
    )

    // Soma dos cashbacks usados
    const usedCashback = await this.cashbacksRepository.totalUsedCashbackByUserId(
      userId,
    )

    // Calcula o saldo atual
    const balance = receivedCashback - usedCashback

    return { balance }
  }
}
