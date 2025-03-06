import { OrderItem, Prisma } from '@prisma/client'

export interface OrderItemCreateInput {
  id: string
  order_id: string
  product_id: string
  quantity: number
  subtotal: number
}

export interface OrderItemsRepository {
  create(data: Prisma.OrderItemCreateInput): Promise<OrderItem>
  findByProductId(product_id: string): Promise<OrderItem[]>
  createMany(orderItems: Prisma.OrderItemCreateManyInput): Promise<OrderItem[]>
}
