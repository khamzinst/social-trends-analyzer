import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ReportsPage } from '@/components/reports/reports-page'

export default async function AnalysisReportsPage() {
  const auth = await getAuthUser()
  const reports = await prisma.analysisReport.findMany({
    where: { userId: auth!.userId },
    orderBy: { createdAt: 'desc' },
  })

  return <ReportsPage initialReports={reports} />
}
