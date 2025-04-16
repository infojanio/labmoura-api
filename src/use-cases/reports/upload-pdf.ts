// --- src/use-cases/reports/upload-pdf.ts
import { randomUUID } from 'crypto'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import QRCode from 'qrcode'
import { PDFDocument, rgb } from 'pdf-lib'

import { ReportsRepository } from '@/repositories/prisma/Iprisma/reports-repository'
import { signPdf } from '@/lib/sign-pdf-node'

interface UploadPdfUseCaseRequest {
  inputPath: string
  originalName: string
  reportsRepository: ReportsRepository
}

async function insertQRCodeAndTextIntoPdf(
  inputPath: string,
  reportId: string,
): Promise<string> {
  const pdfBytes = fs.readFileSync(inputPath)
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const page = pdfDoc.getPage(0)

  /*
  const qrDataUrl = await QRCode.toDataURL(
    `${process.env.PUBLIC_REPORT_URL}/reports/${reportId}`,
  )
    */

  const qrDataUrl = await QRCode.toDataURL(
    `https://labmoura-web-production.up.railway.app/reports/${reportId}`,
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

    // Etapa 1: Gera PDF com QR Code
    const modifiedPath = await insertQRCodeAndTextIntoPdf(inputPath, reportId)

    let finalPath = modifiedPath

    // Etapa 2: Tenta assinar digitalmente (se Java estiver instalado)
    try {
      execSync('java -version', { stdio: 'ignore' })

      const outputPath = path.resolve('tmp', `signed-${originalName}`)

      await signPdf({
        input: modifiedPath,
        output: outputPath,
        certificate: path.resolve('src/certs', 'certificado.pfx'),
        certPassword: process.env.CERT_PASSWORD || '',
      })

      finalPath = outputPath
      console.log('✅ PDF assinado com sucesso!')
    } catch (error) {
      console.warn(
        '⚠️ Java não disponível — PDF gerado sem assinatura digital.',
      )
    }

    const signedPdfUrl = `${process.env.PUBLIC_REPORT_URL}/pdf/${path.basename(
      finalPath,
    )}`

    const report = await reportsRepository.create({
      id: reportId,
      signedPdfUrl,
      createdAt: new Date(),
    })

    return { report }
  }
}
