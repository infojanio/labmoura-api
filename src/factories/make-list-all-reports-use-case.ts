// src/factories/make-list-all-reports-use-case.ts
import { PrismaReportsRepository } from '@/repositories/prisma/prisma-reports-repository'
import { ListAllReportsUseCase } from '@/use-cases/reports/list-all-reports'

export function makeListAllReportsUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  return new ListAllReportsUseCase(reportsRepository)
}
