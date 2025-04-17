import { FastifyInstance } from 'fastify'
import { listReports } from './list-reports'
import { create } from './create'
import { findReportById } from './fetch-report-by-id'
//import { updateReport } from './update-report'
import { downloadSignedPdf } from './download'
import { uploadPdfController } from './upload'
import { listAllReportsController } from './list-all-reports'

export async function reportsRoutes(app: FastifyInstance) {
  app.get('/reports', listReports)

  app.post('/reports', create)

  app.get('/reports/:id', findReportById)

  app.post('/reports/upload-pdf', uploadPdfController)
  //app.put('/reports/:id', updateReport)

  // 📄 Nova rota pública para PDF assinado
  app.get('/pdf/:filename', downloadSignedPdf)
}
