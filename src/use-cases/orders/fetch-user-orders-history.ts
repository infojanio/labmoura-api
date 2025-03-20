import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'
import { Order } from '@prisma/client'
interface FetchUserOrdersHistoryUseCaseRequest {
  userId: string
  storeId: string
  status: string
  validated_at: Date
  totalAmount: number
  created_at: Date
  page: number
}
interface FetchUserOrdersHistoryUseCaseResponse {
  orders: Order[]
}
export class FetchUserOrdersHistoryUseCase {
  constructor(private ordersRepository: OrdersRepository) {}
  async execute({
    userId,
    page,
  }: FetchUserOrdersHistoryUseCaseRequest): Promise<
    FetchUserOrdersHistoryUseCaseResponse
  > {
    const orders = await this.ordersRepository.findManyByUserId(userId, page)
    return {
      orders,
    }
  }
}
