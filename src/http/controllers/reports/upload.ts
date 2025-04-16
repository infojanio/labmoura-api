// src/http/controllers/reports/upload.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import path from 'path'
import fs from 'fs'
import { makeUploadPdfUseCase } from '@/factories/make-upload-pdf-use-case'

export async function uploadPdfController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log('🚀 Chegou no uploadPdfController')
  console.log('📦 Headers:', request.headers)

  const file = await request.file()

  if (!file) {
    console.log('❌ Nenhum arquivo recebido!')
    return reply.status(400).send({ message: 'Nenhum arquivo enviado' })
  }
  console.log('✅ Arquivo recebido:', file.filename)

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
