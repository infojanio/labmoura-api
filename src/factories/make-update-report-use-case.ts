import { PrismaReportsRepository } from '@/repositories/prisma/prisma-reports-repository'
import { UpdateReportUseCase } from '@/use-cases/reports/update-report'

export function makeUpdateReportUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const useCase = new UpdateReportUseCase(reportsRepository)

  return useCase
}
