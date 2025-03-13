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
import { Decimal } from '@prisma/client/runtime/library'
import { CashbacksRepository } from '@/repositories/cashbacks-repository'

interface OrderItem {
  product_id: string
  quantity: number
  subtotal: number
}

interface OrderUseCaseRequest {
  id?: string
  user_id: string
  store_id: string
  totalAmount?: number
  created_at?: Date
  validated_at?: Date | null
  status?: OrderStatus
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
    private cashbacksBalanceRepository: CashbacksRepository,
  ) {}

  async execute({
    id,
    user_id,
    store_id,
    userLatitude,
    userLongitude,
    created_at = new Date(),
    validated_at,
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

    // Buscar produtos para obter cashbackPercentage
    const productIds = items.map((item) => item.product_id)
    const products = await this.productsRepository.findByIds(productIds)

    let totalAmount = new Decimal(0)
    let totalCashback = new Decimal(0)

    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id)
      if (!product) {
        throw new Error(`Produto ${item.product_id} não encontrado!`)
      }

      const itemPrice = new Decimal(product.price)
      const itemQuantity = new Decimal(item.quantity)
      const itemCashback = new Decimal(product.cashbackPercentage || 0)

      totalAmount = totalAmount.plus(itemPrice.times(itemQuantity))
      totalCashback = totalCashback.plus(
        itemPrice.times(itemQuantity).times(itemCashback.div(100)),
      )
    }

    // Criar o pedido
    const order = await this.ordersRepository.create({
      id,
      user_id,
      store_id,
      totalAmount: totalAmount.toNumber(),
      validated_at: null,
      status: 'PENDING',
      created_at: new Date(),
    })
    console.log('pedido salvo:', order)

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
        subtotal: new Decimal(item.subtotal).toNumber(),
      })),
    )

    // Salvar o cashback gerado na tabela Cashbacks
    if (totalCashback.gt(0)) {
      await prisma.cashback.create({
        data: {
          user_id,
          order_id: order.id, // Relaciona ao pedido
          amount: totalCashback.toNumber(), // Salva o cashback
          //   created_at: new Date(),
        },
      })
      console.log('Cashback registrado:', totalCashback.toNumber())
    }

    return { order }
  }
}
