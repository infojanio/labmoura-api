import { PrismaReportsRepository } from '@/repositories/prisma/prisma-reports-repository'
import { CreateReportUseCase } from '../use-cases/reports/create-report'
export function makeCreateReportUseCase() {
  const reportsRepository = new PrismaReportsRepository()

  const useCase = new CreateReportUseCase(reportsRepository)
  return useCase
}
