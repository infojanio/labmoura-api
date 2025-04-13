import { Report, Prisma } from '@prisma/client'
import { ReportsRepository } from '@/repositories/prisma/Iprisma/reports-repository'

interface UpdateReportUseCaseRequest {
  reportId: string
  data: Prisma.ReportUncheckedUpdateInput
}

interface UpdateReportUseCaseResponse {
  report: Report
}

export class UpdateReportUseCase {
  constructor(private reportsRepository: ReportsRepository) {}

  async execute({
    reportId,
    data,
  }: UpdateReportUseCaseRequest): Promise<UpdateReportUseCaseResponse> {
    const report = await this.reportsRepository.update(reportId, data)

    return { report }
  }
}
