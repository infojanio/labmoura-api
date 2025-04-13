// src/http/controllers/reports/create.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import path from 'path'
import { PrismaReportsRepository } from '@/repositories/prisma/prisma-reports-repository'
import { CreateReportUseCase } from '@/use-cases/reports/create-report'
import { generateReportPDF } from '@/lib/generate-pdf'
import { signPdf } from '@/lib/sign-pdf-node'
import QRCode from 'qrcode'
import fs from 'fs'
import { PDFDocument, rgb } from 'pdf-lib'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createReportBodySchema = z.object({
    customerName: z.string(),
    address: z.string(),
    document: z.string(),
    phone: z.string(),
    email: z.string().email(),
    technicianName: z.string(),
    sampleOrigin: z.string(),
    sampleType: z.string(),
    entryDate: z.string().transform((str) => new Date(str)),
    collectionDate: z.string().transform((str) => new Date(str)),
    collectionTime: z.string(),
    collectionAgent: z.string(),
    notes: z.string().optional(),
    analysisResults: z.record(z.string()),
  })

  const body = createReportBodySchema.parse(request.body)

  const reportsRepository = new PrismaReportsRepository()
  const createReportUseCase = new CreateReportUseCase(reportsRepository)

  const { report } = await createReportUseCase.execute({
    ...body,
    signedPdfUrl: '',
  })

  const reportId = report.id

  const pdfPath = await generateReportPDF({
    ...report,
    entryDate: report.entryDate.toISOString().split('T')[0],
    collectionDate: report.collectionDate.toISOString().split('T')[0],
    notes: report.notes || '',
    analysisResults: Object.fromEntries(
      Object.entries(report.analysisResults ?? {}).map(([k, v]) => [
        k,
        String(v),
      ]),
    ),
    publicUrl: `${process.env.PUBLIC_REPORT_URL}/reports/${reportId}`,
    id: reportId,
  })

  // Gera QR Code
  const qrDataUrl = await QRCode.toDataURL(
    `${process.env.PUBLIC_REPORT_URL}/reports/${reportId}`,
  )

  // Insere QR code e legenda no PDF
  const pdfBytes = fs.readFileSync(pdfPath)
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const page = pdfDoc.getPage(0)

  const pngImage = await pdfDoc.embedPng(qrDataUrl)
  const pngDims = pngImage.scale(0.3)

  page.drawImage(pngImage, {
    x: 50,
    y: 50,
    width: pngDims.width,
    height: pngDims.height,
  })

  // Texto explicativo ao lado do QR Code
  const validationText = `
Sistema para validação do laudo

A autenticidade deste documento pode ser conferida no site:
https://labmoura.com.br/laudo

Informe o código abaixo:
${reportId}
`

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

  const updatedPdfBytes = await pdfDoc.save()
  fs.writeFileSync(pdfPath, updatedPdfBytes)

  // Assina com certificado digital A1
  const signedPath = path.resolve('tmp', `signed-${path.basename(pdfPath)}`)
  await signPdf(
    pdfPath,
    signedPath,
    path.resolve('src/certs', 'certificado.pfx'),
    process.env.CERT_PASSWORD || '',
  )

  const signedUrl = `${process.env.PUBLIC_REPORT_URL}/pdf/${path.basename(
    signedPath,
  )}`
  await reportsRepository.update(reportId, {
    signedPdfUrl: signedUrl,
  })

  return reply
    .status(201)
    .send({ report: { ...report, signedPdfUrl: signedUrl } })
}
