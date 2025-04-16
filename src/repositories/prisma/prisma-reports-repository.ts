import { Prisma, Report } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ReportsRepository } from './Iprisma/reports-repository'

interface FindAllParams {
  startDate?: Date
  endDate?: Date
}

export class PrismaReportsRepository implements ReportsRepository {
  async findByDate(startDate?: Date, endDate?: Date): Promise<Report[]> {
    const where = {
      createdAt: {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      },
    }

    return prisma.report.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findById(id: string): Promise<Report | null> {
    return await prisma.report.findUnique({ where: { id } })
  }

  async findByIds(ids: string[]): Promise<Report[]> {
    return await prisma.report.findMany({ where: { id: { in: ids } } })
  }

  async create(data: Prisma.ReportUncheckedCreateInput): Promise<Report> {
    return await prisma.report.create({ data })
  }

  async listMany(): Promise<Report[]> {
    return await prisma.report.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async listAll({ startDate, endDate }: FindAllParams = {}) {
    return prisma.report.findMany({
      where: {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async searchMany(search: string, page: number): Promise<Report[]> {
    return await prisma.report.findMany({
      where: {
        customerName: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async update(
    report_id: string,
    data: Prisma.ReportUncheckedUpdateInput,
  ): Promise<Report> {
    return await prisma.report.update({
      where: { id: report_id },
      data,
    })
  }

  async delete(where: Prisma.ReportWhereUniqueInput): Promise<Report> {
    return await prisma.report.delete({ where })
  }
}
