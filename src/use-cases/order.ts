import { OrdersRepository } from '@/repositories/orders-repository'
import { StoresRepository } from '@/repositories/stores-repository'

import { Order, OrderStatus, User } from '@prisma/client'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfOrdersError } from './errors/max-number-of-orders-error'
import { OrderItemsRepository } from '@/repositories/prisma/prisma-order-items-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ProductsRepository } from '@/repositories/products-repository'
import { prisma } from '@/lib/prisma'

interface OrderItem {
  product_id: string
  quantity: number
  subtotal: number
}

interface OrderUseCaseRequest {
  user_id: string
  store_id: string
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
    private productsRepository: ProductsRepository,
    private orderItemsRepository: OrderItemsRepository, // Novo repositório
    private storesRepository: StoresRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    user_id,
    store_id,
    userLatitude,
    userLongitude,
    created_at = new Date(),
    validated_at = null,
    status,
    items,
  }: OrderUseCaseRequest): Promise<OrderUseCaseResponse> {
    console.log('user_id recebido:', user_id)
    const userExists = await this.usersRepository.findById(user_id)
    if (!userExists) {
      console.log('userExists:', userExists)
      throw new Error('A usuário com esse ID não existe!')
    }

    console.log('store_id recebido:', store_id)

    const storeExists = await this.storesRepository.findById(store_id)
    if (!storeExists) {
      console.log('storeExists:', storeExists)

      throw new Error('A loja com esse ID não existe!')
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: Number(storeExists.latitude),
        longitude: Number(storeExists.longitude),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 40.0
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const hasRecentOrder = await this.ordersRepository.findByUserIdLastHour(
      user_id,
      created_at || new Date(),
    )

    if (hasRecentOrder) {
      throw new MaxNumberOfOrdersError()
    }

    // Calcular o total do pedido somando os subtotais dos itens
    const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0)

    // Criar o pedido sem os itens
    const order = await prisma.order.create({
      data: {
        user_id,
        store_id,
        totalAmount: totalAmount, // Corrigindo o nome do campo
        validated_at, // Já é `null` por padrão
        status,
        created_at: new Date(),
      },
    })
    console.log('pedido criado:', order)

    if (!order) {
      throw new Error('Falha ao criar pedido')
    }

    // Agora cria os itens, APÓS o pedido existir
    await this.orderItemsRepository.create(
      order.id,
      items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    )

    return { order }
  }
}
