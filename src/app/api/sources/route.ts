import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const sources = await prisma.dataSource.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ sources })
}

export async function POST(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { name, platform } = await request.json()
  if (!name || !platform) {
    return NextResponse.json({ error: 'Укажите название и платформу' }, { status: 400 })
  }

  const source = await prisma.dataSource.create({
    data: {
      name,
      platform,
      isActive: true,
      userId: auth.userId,
    },
  })

  return NextResponse.json({ source }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Укажите id' }, { status: 400 })

  await prisma.dataSource.deleteMany({
    where: { id, userId: auth.userId },
  })

  return NextResponse.json({ ok: true })
}
