import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeOrderUseCase } from '@/use-cases/factories/make-order-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  console.log('📩 Dados recebidos:', request.body) // Debug para verificar os dados enviados

  const createOrderBodySchema = z.object({
    user_id: z.string().uuid({ message: 'ID do usuário inválido' }),
    store_id: z.string().uuid({ message: 'ID da loja inválido' }),

    latitude: z.preprocess((val) => Number(val), z.number().min(-90).max(90)),
    longitude: z.preprocess(
      (val) => Number(val),
      z.number().min(-180).max(180),
    ),

    totalAmount: z
      .number()
      .positive({ message: 'O total deve ser maior que zero' }),

    validated_at: z.date().nullable(),

    status: z.enum(['PENDING', 'VALIDATED', 'EXPIRED']),

    items: z
      .array(
        z.object({
          product_id: z.string().min(1, { message: 'ID do produto inválido' }), // 🔹 Permite qualquer string não vazia
          quantity: z
            .number()
            .int()
            .positive({ message: 'Quantidade deve ser positiva' }),
          subtotal: z
            .number()
            .positive({ message: 'Subtotal deve ser maior que zero' }),
        }),
      )
      .min(1, { message: 'O pedido deve ter pelo menos um item' }),
  })

  try {
    const validatedData = createOrderBodySchema.parse(request.body)

    const orderUseCase = makeOrderUseCase()

    console.log('✅ Salvando pedido no banco:', validatedData)

    const { order } = await orderUseCase.execute({
      userLatitude: validatedData.latitude,
      userLongitude: validatedData.longitude,
      //totalAmount: validatedData.totalAmount,
      validated_at: validatedData.validated_at || null,
      created_at: new Date(),
      //status: validatedData.status,
      user_id: validatedData.user_id,
      store_id: validatedData.store_id,
      items: validatedData.items,
    })

    return reply.status(201).send(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação:', error.flatten().fieldErrors)
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.flatten().fieldErrors,
      })
    }

    console.error('❌ Erro interno:', error)
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
