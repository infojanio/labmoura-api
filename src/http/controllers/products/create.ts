import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateProductUseCase } from '@/use-cases/factories/make-create-product-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  /*
  const createProductParamsSchema = z.object({
    storeId: z.string(),
    subcategoryId: z.string(),
  })
    */

  const createProductBodySchema = z.object({
    // id: z.string().uuid(),
    store_id: z.string().uuid(),
    subcategory_id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number().positive({ message: 'O preço deve ser maior que zero' }),
    quantity: z
      .number()
      .positive({ message: 'A quantidade deve ser maior que zero' }),
    image: z.string().nullable(),
    cashbackPercentage: z
      .number()
      .positive({ message: 'O cashback deve ser maior que zero' }),
    status: z.boolean(),
  })

  try {
    const validatedData = createProductBodySchema.parse(request.body)

    const productUseCase = makeCreateProductUseCase()

    console.log('✅ Salvando no banco:', validatedData)
    const { product } = await productUseCase.execute(validatedData)

    return reply.status(201).send(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.flatten().fieldErrors,
      })
    }
    console.error('Erro interno:', error)
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
