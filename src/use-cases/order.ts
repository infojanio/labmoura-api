import { OrdersRepository } from '@/repositories/orders-repository'
import { StoresRepository } from '@/repositories/stores-repository'

import { Order, OrderStatus, User } from '@prisma/client'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfOrdersError } from './errors/max-number-of-orders-error'

interface OrderUseCaseRequest {
  userId: string
  storeId: string
  totalAmount: number
  created_at: Date
  validated_at: Date
  status: OrderStatus
  userLatitude: number
  userLongitude: number
}

interface OrderUseCaseResponse {
  order: Order
}

//responsável pela autenticação
export class OrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private storesRepository: StoresRepository,
  ) {}

  async execute({
    userId,
    storeId,
    userLatitude,
    userLongitude,
    totalAmount,
    validated_at,
    created_at,
    status,
  }: OrderUseCaseRequest): Promise<OrderUseCaseResponse> {
    const store = await this.storesRepository.findById(storeId)

    /*
    const hasRecentOrder = await this.ordersRepository.findByUserIdOnHour(
      userId,
      new Date(),
    )
      */

    if (!store) {
      throw new Error('Não encontrou loja vinculada.')
    }

    /*
    if (hasRecentOrder) {
      throw new Error(
        'Usuário já fez um pedido na última hora. Aguarde antes de criar outro.',
      )
    }
      */

    //se existir a loja, CALCULAR A DISTÂNCIA DO USER AND STORE
    const distance = getDistanceBetweenCoordinates(
      //coordenadas do usuário
      { latitude: userLatitude, longitude: userLongitude },
      //coordenadas da loja
      {
        latitude: store.latitude.toNumber(),
        longitude: store.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 10.0 // // 10 km na escala

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    //verifica se o usuário fez 2 pedidos no mesmo dia
    /*
    const orderOnSameDay = await this.ordersRepository.findByUserIdOnDate(
      userId,
      created_at || new Date(),
    )
    if (orderOnSameDay) {
      throw new MaxNumberOfOrdersError()
    }

    //verifica se o usuário fez 2 pedidos na mesma hora
    const orderOnSameHour = await this.ordersRepository.findByUserIdOnHour(
      userId,
      created_at || new Date(),
    )

    if (orderOnSameHour) {
      throw new MaxNumberOfOrdersError()
    }
*/
    const hasRecentOrder = await this.ordersRepository.findByUserIdLastHour(
      userId,
      created_at || new Date(),
    )

    if (hasRecentOrder) {
      throw new MaxNumberOfOrdersError()
    }

    const newOrder = await this.ordersRepository.create({
      user_id: userId,
      store_id: storeId,
      totalAmount,
      validated_at,
      status,
      created_at,
    })
    return {
      order: newOrder,
    }
  }
}
