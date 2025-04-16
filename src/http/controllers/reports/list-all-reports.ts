// src/http/controllers/reports/list-all-reports.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeListAllReportsUseCase } from '@/factories/make-list-all-reports-use-case'

export async function listAllReportsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { startDate, endDate } = request.query as {
    startDate?: string
    endDate?: string
  }

  const useCase = makeListAllReportsUseCase()

  const result = await useCase.execute({
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
  })

  return reply.send(result.reports)
}
