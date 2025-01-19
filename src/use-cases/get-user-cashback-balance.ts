import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository'
import { OrdersRepository } from '@/repositories/orders-repository'

interface GetUserCashbackBalanceUseCaseRequest {
  userId: string
}

interface GetUserCashbackBalanceUseCaseResponse {
  balance: number
}

export class GetUserCashbackBalanceUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    request: GetUserCashbackBalanceUseCaseRequest,
  ): Promise<GetUserCashbackBalanceUseCaseResponse> {
    const { userId } = request

    const balance = await this.ordersRepository.balanceByUserId(userId)

    return { balance }
  }
}
