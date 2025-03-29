import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListProductsUseCase } from '@/factories/make-list-products-use-case'

export async function listProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listProductsUseCase = makeListProductsUseCase()

  const products = await listProductsUseCase.execute()

  return reply.status(200).send(products)
}
