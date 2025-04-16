import { ReportsRepository } from '@/repositories/prisma/Iprisma/reports-repository'

interface ListAllReportsUseCaseRequest {
  startDate?: Date
  endDate?: Date
}

export class ListAllReportsUseCase {
  constructor(private reportsRepository: ReportsRepository) {}

  async execute({ startDate, endDate }: ListAllReportsUseCaseRequest) {
    if (!startDate && !endDate) {
      // Retorna todos os laudos
      const reports = await this.reportsRepository.listMany()
      return { reports }
    }

    // Filtra por data, se fornecida
    const reports = await this.reportsRepository.findByDate(startDate, endDate)
    return { reports }
  }
}
