import { CashbacksRepository } from '@/repositories/prisma/Iprisma/cashbacks-repository'
import { Decimal } from '@prisma/client/runtime/library'

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
    //Antes de chamar .toNumber(), verifique se a variável é do tipo Decimal
    const totalCashbackRaw = await this.cashbacksRepository.totalCashbackByUserId(
      user_id,
    )
    const usedCashbackRaw = await this.cashbacksRepository.totalUsedCashbackByUserId(
      user_id,
    )

    //Se for, converta para number; caso contrário, use o valor diretamente
    const totalCashback =
      totalCashbackRaw instanceof Decimal
        ? totalCashbackRaw.toNumber()
        : totalCashbackRaw
    const usedCashback =
      usedCashbackRaw instanceof Decimal
        ? usedCashbackRaw.toNumber()
        : usedCashbackRaw

    const balance = totalCashback - usedCashback

    return {
      totalReceived: totalCashback,
      totalUsed: usedCashback,
      balance,
    }
  }
}
