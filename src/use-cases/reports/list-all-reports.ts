// src/use-cases/reports/list-all-reports.ts
import { ReportsRepository } from '@/repositories/prisma/Iprisma/reports-repository'

interface ListAllReportsUseCaseRequest {
  startDate?: Date
  endDate?: Date
  page: number
  perPage: number
}

export class ListAllReportsUseCase {
  constructor(private reportsRepository: ReportsRepository) {}

  async execute({
    startDate,
    endDate,
    page,
    perPage,
  }: ListAllReportsUseCaseRequest) {
    const {
      reports,
      totalCount,
    } = await this.reportsRepository.findByDatePaginated({
      startDate,
      endDate,
      page,
      perPage,
    })

    const totalPages = Math.ceil(totalCount / perPage)

    return { reports, totalPages }
  }
}
