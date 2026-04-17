import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SourcesList } from '@/components/sources/sources-list'

export default async function SourcesPage() {
  const auth = await getAuthUser()
  const sources = await prisma.dataSource.findMany({
    where: { userId: auth!.userId },
    orderBy: { createdAt: 'desc' },
  })

  return <SourcesList initialSources={sources} />
}
