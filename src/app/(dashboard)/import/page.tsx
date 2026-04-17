import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ImportPage } from '@/components/import/import-page'

export default async function ImportDataPage() {
  const auth = await getAuthUser()
  const datasets = await prisma.importedDataset.findMany({
    where: { userId: auth!.userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return <ImportPage initialDatasets={datasets} />
}
