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
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(50).default(10),
  })

  const { startDate, endDate, page, perPage } = querySchema.parse(request.query)

  const listAllReportsUseCase = makeListAllReportsUseCase()

  const { reports, totalPages } = await listAllReportsUseCase.execute({
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    page,
    perPage,
  })

  return reply.send({ reports, totalPages })
}
