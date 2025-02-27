import { OrderItem, Prisma } from '@prisma/client'

export interface OrderItemCreateInput {
  order_id: string
  product_id: string
  quantity: number
  subtotal: number
}

export interface OrderItemsRepository {
  create(data: Prisma.OrderItemCreateInput): Promise<OrderItem>
}
