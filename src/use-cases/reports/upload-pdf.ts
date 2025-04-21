// --- src/use-cases/reports/upload-pdf.ts
import { randomUUID } from 'crypto'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import QRCode from 'qrcode'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

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
  const pages = pdfDoc.getPages()
  const lastPage = pages[pages.length - 1]
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  /*
  const qrDataUrl = await QRCode.toDataURL(
    `${process.env.PUBLIC_REPORT_URL}/reports/${reportId}`,
  )
    */

  const qrDataUrl = await QRCode.toDataURL(
    `https://localhost:5173/reports/${reportId}`,
    //    `https://labmoura-web-production.up.railway.app/reports/${reportId}`,
  )

  const pngImage = await pdfDoc.embedPng(qrDataUrl)
  const pngDims = pngImage.scale(0.3)

  // Desenha o QR Code no canto inferior esquerdo da última página
  lastPage.drawImage(pngImage, {
    x: 50,
    y: 150,
    width: pngDims.width,
    height: pngDims.height,
  })

  const validationLines = [
    'Sistema para validação do laudo',
    'A autenticidade deste documento pode ser conferida no site:',
    'https://labmoura.com.br/laudos',
    '',
    'Informe o código abaixo:',
    reportId,
  ]

  const footerY = 150
  const fontSize = 9
  const lineSpacing = 12
  const textX = 130

  validationLines.forEach((line, index) => {
    lastPage.drawText(line, {
      x: textX,
      y: footerY + (validationLines.length - index - 1) * lineSpacing,
      size: fontSize,
      font, // 👈 agora sim!
      color: rgb(0.2, 0.2, 0.2),
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
