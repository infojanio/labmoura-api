import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateProductUseCase } from '@/use-cases/factories/make-create-product-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createProductParamsSchema = z.object({
    storeId: z.string(),
    subcategoryId: z.string(),
  })

  const createProductBodySchema = z.object({
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
    // Validação dos parâmetros e do corpo da requisição
    const validatedParams = createProductParamsSchema.parse(request.params)
    const validatedData = createProductBodySchema.parse(request.body)

    const productUseCase = makeCreateProductUseCase()

    const { product } = await productUseCase.execute({
      ...validatedParams,
      ...validatedData,
      storeId: validatedParams.storeId,
      subcategoryId: validatedParams.subcategoryId,
      name: validatedData.name,
      description: validatedData.description,
      price: validatedData.price,
      quantity: validatedData.quantity,
      image: validatedData.image,
      cashbackPercentage: validatedData.cashbackPercentage,
      status: validatedData.status,
    })
    console.log('Produto:', product)
    return reply.status(201).send(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro de validação',
        errors: error.flatten().fieldErrors,
      })
    }
    console.error('Erro interno:', error) // 🔹 Log detalhado do erro
    return reply.status(500).send({ message: 'Erro interno no servidor' })
  }
}
