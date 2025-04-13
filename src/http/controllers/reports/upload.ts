// src/http/controllers/reports/upload.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import path from 'path'
import fs from 'fs'
import { makeUploadPdfUseCase } from '@/factories/make-upload-pdf-use-case'

export async function uploadPdfController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const file = await request.file()

  if (!file) {
    return reply.status(400).send({ message: 'Nenhum arquivo enviado' })
  }

  const buffer = await file.toBuffer()
  const originalName = file.filename

  // Gera nome único temporário para o PDF salvo
  const tempInputPath = path.resolve('tmp', 'laudo-original.pdf')
  await fs.promises.writeFile(tempInputPath, buffer)

  const uploadPdfUseCase = makeUploadPdfUseCase()

  const { report } = await uploadPdfUseCase.execute({
    inputPath: tempInputPath, // agora passa o caminho real do arquivo
    originalName,
    reportsRepository: uploadPdfUseCase.reportsRepository,
  })

  return reply
    .status(201)
    .send({ id: report.id, signedPdfUrl: report.signedPdfUrl })
}
