import { FastifyRequest, FastifyReply } from 'fastify'
import path from 'path'
import fs from 'fs'

export async function downloadSignedPdf(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { filename } = request.params as { filename: string }

  const filePath = path.resolve('tmp', filename)

  if (!fs.existsSync(filePath)) {
    return reply.status(404).send({ message: 'PDF não encontrado' })
  }

  return reply
    .header('Content-Type', 'application/pdf')
    .header('Content-Disposition', `inline; filename="${filename}"`)
    .send(fs.createReadStream(filePath))
}
