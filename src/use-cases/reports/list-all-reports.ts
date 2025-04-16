// src/use-cases/reports/list-all-reports.ts
import { ReportsRepository } from '@/repositories/prisma/Iprisma/reports-repository'

interface ListAllReportsUseCaseRequest {
  startDate?: Date
  endDate?: Date
}

export class ListAllReportsUseCase {
  constructor(private reportsRepository: ReportsRepository) {}

  async execute({ startDate, endDate }: ListAllReportsUseCaseRequest) {
    const reports = await this.reportsRepository.listAll(startDate, endDate)
    return { reports }
  }
}
