import { Prisma, Report } from '@prisma/client'

export interface ReportsRepository {
  findById(id: string): Promise<Report | null>
  findByIds(ids: string[]): Promise<Report[]>
  create(data: Prisma.ReportUncheckedCreateInput): Promise<Report>
  findByDate(startDate?: Date, endDate?: Date): Promise<Report[]>
  listMany(): Promise<Report[]> //listar todos
  searchMany(search: string, page: number): Promise<Report[]> //buscar por nome
  update(
    report_id: string,
    data: Prisma.ReportUncheckedUpdateInput,
  ): Promise<Report>
  delete(where: Prisma.ReportWhereUniqueInput): Promise<Report>
}
