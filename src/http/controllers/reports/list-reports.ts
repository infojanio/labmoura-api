import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListReportsUseCase } from '@/factories/make-list-reports-use-case'

export async function listReports(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listReportsUseCase = makeListReportsUseCase()

  const reports = await listReportsUseCase.execute()

  return reply.status(200).send(reports)
}
