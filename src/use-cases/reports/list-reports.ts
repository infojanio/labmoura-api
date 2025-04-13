import { ReportsRepository } from '@/repositories/prisma/Iprisma/reports-repository'

export class ListReportsUseCase {
  constructor(private reportsRepository: ReportsRepository) {}

  async execute() {
    const reports = await this.reportsRepository.listMany()
    return reports
  }
}
