import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const datasets = await prisma.importedDataset.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ datasets })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { name, recordCount, status, platform } = await request.json()

  const dataset = await prisma.importedDataset.create({
    data: {
      name,
      recordCount: recordCount ?? 0,
      status: status ?? 'COMPLETED',
      platform: platform ?? 'OTHER',
      userId: auth.userId,
    },
  })

  return NextResponse.json({ dataset }, { status: 201 })
}
