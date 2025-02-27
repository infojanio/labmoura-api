import { OrdersRepository } from '@/repositories/orders-repository'
import { StoresRepository } from '@/repositories/stores-repository'

import { Order, OrderStatus, User } from '@prisma/client'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfOrdersError } from './errors/max-number-of-orders-error'
import { OrderItemsRepository } from '@/repositories/prisma/prisma-order-items-repository'

interface OrderItem {
  productId: string
  quantity: number
  subtotal: number
}

interface OrderUseCaseRequest {
  userId: string
  storeId: string
  totalAmount?: number
  created_at?: Date
  validated_at?: Date | null
  status: OrderStatus
  userLatitude: number
  userLongitude: number
  items: OrderItem[]
}

interface OrderUseCaseResponse {
  order: Order
}

// Classe responsável pela criação do pedido
export class OrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private orderItemsRepository: OrderItemsRepository, // Novo repositório
    private storesRepository: StoresRepository,
  ) {}

  async execute({
    userId,
    storeId,
    userLatitude,
    userLongitude,
    created_at = new Date(),
    validated_at = null,
    status,
    items,
  }: OrderUseCaseRequest): Promise<OrderUseCaseResponse> {
    const store = await this.storesRepository.findById(storeId)

    if (!store) {
      throw new Error('Loja não encontrada.')
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: Number(store.latitude), longitude: Number(store.longitude) },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 40.0
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const hasRecentOrder = await this.ordersRepository.findByUserIdLastHour(
      userId,
      created_at || new Date(),
    )

    if (hasRecentOrder) {
      throw new MaxNumberOfOrdersError()
    }

    // Calcular o total do pedido somando os subtotais dos itens
    const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0)

    // Criar o pedido sem os itens
    const order = await this.ordersRepository.create({
      user_id: userId,
      store_id: storeId,
      totalAmount: totalAmount, // Corrigindo o nome do campo
      validated_at, // Já é `null` por padrão
      status,
      created_at,
    })

    // Criar os itens do pedido separadamente
    await this.orderItemsRepository.create(
      order.id,
      items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    )

    return { order }
  }
}
