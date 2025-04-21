import { Prisma, Report } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ReportsRepository } from './Iprisma/reports-repository'
import { createDecipheriv } from 'node:crypto'

interface FindAllParams {
  startDate?: Date
  endDate?: Date
}

// Defina um tipo para a resposta reduzida
type ReportSummary = {
  id: string
  createdAt: Date
  signedPdfUrl: string | null
}

interface PaginatedReportParams {
  startDate?: Date
  endDate?: Date
  page: number
  perPage: number
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

  async findByDatePaginated({
    startDate,
    endDate,
    page,
    perPage,
  }: PaginatedReportParams): Promise<{
    reports: Report[]
    totalCount: number
  }> {
    const where = {
      AND: [
        startDate ? { createdAt: { gte: startDate } } : {},
        endDate ? { createdAt: { lte: endDate } } : {},
      ],
    }

    const [reports, totalCount] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.report.count({ where }),
    ])

    return { reports, totalCount }
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
    return prisma.report.findMany({
      select: {
        id: true,
        customerName: true,
        createdAt: true,
        document: true,
        email: true,
        entryDate: true,
        notes: true,
        phone: true,
        sampleImageUrls: true,
        sampleOrigin: true,
        sampleType: true,
        signedPdfUrl: true,
        technicianName: true,
        collectionAgent: true,
        analysisResults: true,
        collectionTime: true,
        collectionDate: true,
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
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
