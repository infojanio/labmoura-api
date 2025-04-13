import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchReportByIdUseCase } from '@/factories/make-fetch-report-by-id-use-case'

export async function findReportById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const fetchReportByIdUseCase = makeFetchReportByIdUseCase()

  const report = await fetchReportByIdUseCase.execute({ id })

  if (!report) {
    return reply.status(404).send({ message: 'Report not found' })
  }

  return reply.status(200).send({ report })
}
