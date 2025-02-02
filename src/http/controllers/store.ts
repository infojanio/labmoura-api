import { z } from 'zod' //responsável pela validação dos dados
import { FastifyReply, FastifyRequest } from 'fastify'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeCreateStoreUseCase } from '@/use-cases/factories/make-create-store-use-case'

export async function store(request: FastifyRequest, reply: FastifyReply) {
  const registerStoreBodySchema = z.object({
    // id: z.string(),
    name: z.string(),
    slug: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    // created_at: z.date(),
  })

  const {
    // id,
    name,
    slug,
    latitude,
    longitude,
    //  created_at,
  } = registerStoreBodySchema.parse(request.body)

  try {
    const storeUseCase = makeCreateStoreUseCase()
    await storeUseCase.execute({
      // id,
      name,
      slug,
      latitude,
      longitude,

      //      created_at,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }

  return reply.status(201).send()
}
