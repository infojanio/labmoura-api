// src/lib/generate-pdf.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { writeFileSync, readFileSync } from 'fs'
import { join, resolve } from 'path'

interface ReportData {
  id: string
  customerName: string
  address: string
  document: string
  phone: string
  email: string
  technicianName: string
  sampleOrigin: string
  sampleType: string
  entryDate: string
  collectionDate: string
  collectionTime: string
  collectionAgent: string
  notes: string
  analysisResults: Record<string, string>
  publicUrl: string
}

export async function generateReportPDF(data: ReportData): Promise<string> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const { width, height } = page.getSize()

  let y = height - 50
  const fontSize = 10
  const lineHeight = 14

  function drawText(text: string, x = 50) {
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    })
    y -= lineHeight
  }

  // Título
  page.drawText('Laudo de Análise Físico-Química da Água', {
    x: 50,
    y,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  })
  y -= 30

  // Informações do laudo
  drawText(`Código do Laudo: ${data.id}`)
  drawText(`Cliente: ${data.customerName}`)
  drawText(`Endereço: ${data.address}`)
  drawText(`Documento: ${data.document}`)
  drawText(`Telefone: ${data.phone}`)
  drawText(`E-mail: ${data.email}`)
  drawText(`Técnico Responsável: ${data.technicianName}`)
  drawText(`Origem da Amostra: ${data.sampleOrigin}`)
  drawText(`Tipo de Amostra: ${data.sampleType}`)
  drawText(`Data de Entrada: ${data.entryDate}`)
  drawText(`Data da Coleta: ${data.collectionDate}`)
  drawText(`Hora da Coleta: ${data.collectionTime}`)
  drawText(`Responsável pela Coleta: ${data.collectionAgent}`)
  y -= 10

  // Resultados das análises
  drawText('Resultados das Análises:')
  for (const [param, value] of Object.entries(data.analysisResults)) {
    drawText(`• ${param}: ${value}`)
  }

  if (data.notes) {
    y -= 10
    drawText('Observações:')
    drawText(data.notes)
  }

  y -= 40

  // Assinatura
  try {
    const signatureBytes = readFileSync(resolve('public', 'assinatura.png'))
    const signatureImage = await pdfDoc.embedPng(signatureBytes)
    const signatureDims = signatureImage.scale(0.25)

    page.drawImage(signatureImage, {
      x: 50,
      y: 100,
      width: signatureDims.width,
      height: signatureDims.height,
    })
  } catch {
    drawText('Assinatura digital não disponível.', 50)
  }

  // Texto de validação + código
  const validationText = `Este documento pode ser validado acessando:\nhttps://labmoura.com.br/laudo\nCódigo: ${data.id}`

  page.drawText(validationText, {
    x: 300,
    y: 110,
    size: 9,
    font,
    color: rgb(0.2, 0.2, 0.2),
    lineHeight: 12,
  })

  const outputPath = join('tmp', `laudo-${data.id}.pdf`)
  const pdfBytes = await pdfDoc.save()
  writeFileSync(outputPath, pdfBytes)

  console.log('PDF gerado com sucesso em:', outputPath)
  return outputPath
}
