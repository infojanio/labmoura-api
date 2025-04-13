// --- src/use-cases/reports/upload-pdf.ts
import { randomUUID } from 'crypto'
import path from 'path'

import QRCode from 'qrcode'
import { PDFDocument, rgb } from 'pdf-lib'
import fs from 'fs'
import { ReportsRepository } from '@/repositories/prisma/Iprisma/reports-repository'
import { signPdf } from '@/lib/sign-pdf-node'

interface UploadPdfUseCaseRequest {
  inputPath: string
  originalName: string
  reportsRepository: ReportsRepository
}

// Gera o QR code + insere texto explicativo no PDF antes da assinatura
async function insertQRCodeAndTextIntoPdf(
  inputPath: string,
  reportId: string,
): Promise<string> {
  const pdfBytes = fs.readFileSync(inputPath)
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const page = pdfDoc.getPage(0)

  const qrDataUrl = await QRCode.toDataURL(
    `${process.env.PUBLIC_REPORT_URL}/reports/${reportId}`,
  )

  const pngImage = await pdfDoc.embedPng(qrDataUrl)
  const pngDims = pngImage.scale(0.3)

  page.drawImage(pngImage, {
    x: 50,
    y: 50,
    width: pngDims.width,
    height: pngDims.height,
  })

  const validationText = `
Sistema para validação do laudo

A autenticidade deste documento pode ser conferida no site:
https://labmoura.com.br/laudo

Informe o código abaixo:
${reportId}`

  const fontSize = 9
  const textX = 130
  const textY = 50

  validationText.split('\n').forEach((line, index) => {
    page.drawText(line.trim(), {
      x: textX,
      y:
        textY +
        (validationText.split('\n').length - index - 1) * (fontSize + 2),
      size: fontSize,
      color: rgb(0, 0, 0),
    })
  })

  const modifiedPath = path.resolve('tmp', `laudo-${reportId}.pdf`)
  const updatedBytes = await pdfDoc.save()
  fs.writeFileSync(modifiedPath, updatedBytes)

  return modifiedPath
}

export class UploadPdfUseCase {
  constructor(private reportsRepository: ReportsRepository) {}

  async execute({
    inputPath,
    originalName,
    reportsRepository,
  }: UploadPdfUseCaseRequest) {
    const reportId = randomUUID()

    const outputPath = path.resolve('tmp', `signed-${originalName}`)

    // Etapa 1: insere QR e texto
    const modifiedPath = await insertQRCodeAndTextIntoPdf(inputPath, reportId)

    // Etapa 2: assina o PDF com certificado A1
    await signPdf({
      input: modifiedPath,
      output: outputPath,
      certificate: path.resolve('src/certs', 'certificado.pfx'),
      certPassword: process.env.CERT_PASSWORD || '',
    })

    const signedPdfUrl = `${process.env.PUBLIC_REPORT_URL}/pdf/${path.basename(
      outputPath,
    )}`

    const report = await reportsRepository.create({
      id: reportId,
      signedPdfUrl,
      createdAt: new Date(),
    })

    return { report }
  }
}
