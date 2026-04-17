import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const reports = await prisma.analysisReport.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ reports })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { title, platform, period, recordsCount, trendsFound } = await request.json()
  if (!title?.trim()) return NextResponse.json({ error: 'Укажите название' }, { status: 400 })

  const report = await prisma.analysisReport.create({
    data: {
      title,
      platform: platform || null,
      recordsCount: recordsCount ?? 0,
      trendsFound: trendsFound ?? 0,
      status: 'COMPLETED',
      userId: auth.userId,
    },
  })

  return NextResponse.json({ report }, { status: 201 })
}
