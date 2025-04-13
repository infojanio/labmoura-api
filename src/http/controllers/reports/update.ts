import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateReportUseCase } from '@/factories/make-update-report-use-case'

export async function updateReport(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    customerName: z.string().optional(),
    address: z.string().optional(),
    document: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    technicianName: z.string().optional(),
    sampleOrigin: z.string().optional(),
    sampleType: z.string().optional(),
    entryDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    collectionDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    collectionTime: z.string().optional(),
    collectionAgent: z.string().optional(),
    notes: z.string().optional(),
    analysisResults: z.record(z.string()).optional(),
    signedPdfUrl: z.string().url().optional(),
    sampleImageUrls: z.array(z.string().url()).optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  const updateReportUseCase = makeUpdateReportUseCase()
  const report = await updateReportUseCase.execute({ reportId: id, data })

  return reply.status(200).send({ report })
}
