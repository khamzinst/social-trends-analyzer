import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const trends = await prisma.trend.findMany({
    where: { isActive: true },
    orderBy: { mentionsCount: 'desc' },
  })

  return NextResponse.json({ trends })
}
