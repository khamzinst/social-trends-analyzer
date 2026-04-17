import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })

  return NextResponse.json({ user })
}

export async function PATCH(request: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { name } = await request.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Укажите имя' }, { status: 400 })

  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json({ user })
}
