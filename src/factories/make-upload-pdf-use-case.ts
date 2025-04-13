// --- src/use-cases/reports/factories/make-upload-pdf-use-case.ts
import { PrismaReportsRepository } from '@/repositories/prisma/prisma-reports-repository'
import { UploadPdfUseCase } from '../use-cases/reports/upload-pdf'

export function makeUploadPdfUseCase() {
  const reportsRepository = new PrismaReportsRepository()
  const useCase = new UploadPdfUseCase(reportsRepository)

  return {
    execute: (params: any) => useCase.execute({ ...params, reportsRepository }),
    reportsRepository,
  }
}
