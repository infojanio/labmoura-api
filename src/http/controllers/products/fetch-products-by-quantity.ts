import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchProductsByQuantityUseCase } from '@/factories/make-fetch-products-by-quantity-use-case'

export async function fetchProductsByQuantity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Alteramos para buscar da QUERY, não do BODY
  const fetchProductsQuerySchema = z.object({
    quantity: z.string().optional(), // Agora espera string (porque query params sempre são strings)
  })

  const { quantity } = fetchProductsQuerySchema.parse(request.query)

  // Converte para número e define 3 como valor padrão caso não seja passado
  const quantityValue = quantity ? Number(quantity) : 3

  const fetchProductsByQuantityUseCase = makeFetchProductsByQuantityUseCase()

  const { products } = await fetchProductsByQuantityUseCase.execute({
    quantity: quantityValue, // Usa o valor convertido
  })

  return reply.status(200).send(products)
}
