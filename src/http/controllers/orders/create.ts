import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeOrderUseCase } from '@/use-cases/factories/make-order-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createOrderParamsSchema = z.object({
    userId: z.string().uuid({ message: 'ID do usuário inválido' }),
    storeId: z.string().uuid({ message: 'ID da loja inválido' }),
  })

  const createOrderBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90, {
      message: 'Latitude inválida',
    }),
    longitude: z.number().refine((value) => Math.abs(value) <= 180, {
      message: 'Longitude inválida',
    }),
    totalAmount: z
      .number()
      .positive({ message: 'O total deve ser maior que zero' }),
    validated_at: z.union([z.string().datetime(), z.null()]).optional(),
    status: z.enum(['PENDING', 'VALIDATED', 'EXPIRED']),
    items: z
      .array(
        z.object({
          productId: z.string().uuid({ message: 'ID do produto inválido' }),
          quantity: z
            .number()
            .int()
            .positive({ message: 'Quantidade deve ser um número positivo' }),
          subtotal: z
            .number()
            .positive({ message: 'Subtotal deve ser maior que zero' }),
        }),
      )
      .min(1, { message: 'O pedido deve ter pelo menos um item' }),
  })

  try {
    // Validação dos parâmetros e do corpo da requisição
    const validatedParams = createOrderParamsSchema.parse(request.params)
    const validatedData = createOrderBodySchema.parse(request.body)

    const orderUseCase = makeOrderUseCase()

    const { order } = await orderUseCase.execute({
      ...validatedParams,
      userLatitude: validatedData.latitude,
      userLongitude: validatedData.longitude,
      totalAmount: validatedData.totalAmount,
      validated_at: validatedData.validated_at
        ? new Date(validatedData.validated_at)
        : null,
      created_at: new Date(),
      status: validatedData.status,
      items: validatedData.items,
    })

    return reply.status(201).send(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.flatten().fieldErrors,
      })
    }

    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
