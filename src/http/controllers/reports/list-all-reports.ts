// src/http/controllers/reports/list-all-reports.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeListAllReportsUseCase } from '@/factories/make-list-all-reports-use-case'

export async function listAllReportsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })

  const { startDate, endDate } = querySchema.parse(request.query)

  const listAllReportsUseCase = makeListAllReportsUseCase()

  const reports = await listAllReportsUseCase.execute({
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
  })

  return reply.send({ reports })
}
