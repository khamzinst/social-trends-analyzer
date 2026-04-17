import { NextRequest, NextResponse } from 'next/server'
import { fetchTopHeadlines } from '@/lib/newsapi'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const query = req.nextUrl.searchParams.get('q') ?? 'Казахстан'

  try {
    const articles = await fetchTopHeadlines(query, 20)
    return NextResponse.json({ articles, query })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
