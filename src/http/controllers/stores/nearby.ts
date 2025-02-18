import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyStoresUseCase } from '@/use-cases/factories/make-fetch-nearby-stores-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyStoresQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })
  const { latitude, longitude } = nearbyStoresQuerySchema.parse(request.query)
  const fetchNearbyGymsUseCase = makeFetchNearbyStoresUseCase()
  const { stores } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })
  return reply.status(200).send({
    stores,
  })
}
