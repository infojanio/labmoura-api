import { PrismaReportsRepository } from '@/repositories/prisma/prisma-reports-repository'
import { ListReportsUseCase } from '../use-cases/reports/list-reports'
export function makeListReportsUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const useCase = new ListReportsUseCase(reportsRepository)
  return useCase
}
