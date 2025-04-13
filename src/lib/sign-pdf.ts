// POST /sign-pdf
import { FastifyRequest, FastifyReply } from 'fastify'
import { signPdf } from '@/lib/sign-pdf-node'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export async function signUploadedPDF(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await request.file()

  if (!data) {
    return reply.status(400).send({ message: 'Arquivo não enviado' })
  }

  const tempInput = path.resolve('tmp', `${randomUUID()}.pdf`)
  const tempOutput = tempInput.replace('.pdf', '_signed.pdf')

  await data.toBuffer().then((buffer) => fs.writeFileSync(tempInput, buffer))

  try {
    await signPdf({
      inputPath: tempInput,
      outputPath: tempOutput,
    })

    const signedPdf = fs.readFileSync(tempOutput)

    reply
      .type('application/pdf')
      .header('Content-Disposition', 'attachment; filename="signed-laudo.pdf"')
      .send(signedPdf)
  } catch (error) {
    return reply.status(500).send({ message: 'Erro ao assinar PDF', error })
  } finally {
    fs.unlinkSync(tempInput)
    if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput)
  }
}
