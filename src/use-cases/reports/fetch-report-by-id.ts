import { ReportsRepository } from '@/repositories/prisma/Iprisma/reports-repository'
import { Report } from '@prisma/client'

interface FetchReportByIdUseCaseRequest {
  id: string
}

export class FetchReportByIdUseCase {
  constructor(private reportsRepository: ReportsRepository) {}

  async execute({ id }: FetchReportByIdUseCaseRequest): Promise<Report | null> {
    const report = await this.reportsRepository.findById(id)
    return report
  }
}
