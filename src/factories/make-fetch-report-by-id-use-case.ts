import { PrismaReportsRepository } from '@/repositories/prisma/prisma-reports-repository'
import { FetchReportByIdUseCase } from '@/use-cases/reports/fetch-report-by-id'

export function makeFetchReportByIdUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const useCase = new FetchReportByIdUseCase(reportsRepository)

  return useCase
}
