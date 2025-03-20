import { OrdersRepository } from '@/repositories/prisma/Iprisma/orders-repository'

import { LateOrderValidationError } from '@/use-cases/errors/late-order-validation-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { Order } from '@prisma/client'
import dayjs from 'dayjs'

interface ValidateOrderUseCaseRequest {
  orderId: string
}
interface ValidateOrderUseCaseResponse {
  order: Order
}
export class ValidateOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}
  async execute({
    orderId,
  }: ValidateOrderUseCaseRequest): Promise<ValidateOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)
    if (!order) {
      throw new ResourceNotFoundError()
    }

    //diff -> compara uma data do futuro com a data do passado
    const distanceInHoursFromCheckInCreation = dayjs(new Date()).diff(
      order.created_at,
      'hours',
    )
    if (distanceInHoursFromCheckInCreation > 48) {
      throw new LateOrderValidationError()
    }

    order.validated_at = new Date()
    await this.ordersRepository.save(order)
    return {
      order,
    }
  }
}
