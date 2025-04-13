import { Report } from '@prisma/client'
import { ReportsRepository } from '@/repositories/prisma/Iprisma/reports-repository'

interface CreateReportUseCaseRequest {
  customerName: string
  address: string
  document: string
  phone: string
  email: string
  technicianName: string
  sampleOrigin: string
  sampleType: string
  entryDate: Date
  collectionDate: Date
  collectionTime: string
  collectionAgent: string
  notes?: string
  analysisResults: Record<string, string>
  signedPdfUrl?: string
  sampleImageUrls?: string[]
}

interface CreateReportUseCaseResponse {
  report: Report
}

export class CreateReportUseCase {
  constructor(private reportsRepository: ReportsRepository) {}

  async execute({
    customerName,
    address,
    document,
    phone,
    email,
    technicianName,
    sampleOrigin,
    sampleType,
    entryDate,
    collectionDate,
    collectionTime,
    collectionAgent,
    notes,
    analysisResults,
    signedPdfUrl,
    sampleImageUrls,
  }: CreateReportUseCaseRequest): Promise<CreateReportUseCaseResponse> {
    const report = await this.reportsRepository.create({
      customerName,
      address,
      document,
      phone,
      email,
      technicianName,
      sampleOrigin,
      sampleType,
      entryDate,
      collectionDate,
      collectionTime,
      collectionAgent,
      notes,
      analysisResults,
      signedPdfUrl,
      sampleImageUrls,
      createdAt: new Date(),
    })

    return { report }
  }
}
