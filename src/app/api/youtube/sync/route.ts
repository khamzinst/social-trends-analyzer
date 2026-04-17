import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchYouTubeTrending, YOUTUBE_CATEGORIES } from '@/lib/youtube'
import { getAuthUser } from '@/lib/auth'

export async function POST() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const videos = await fetchYouTubeTrending('KZ', 25)

    // Group by category to build trends
    const categoryMap = new Map<string, { views: number; likes: number; comments: number; count: number; titles: string[] }>()

    for (const video of videos) {
      const cat = video.categoryId || '24'
      const existing = categoryMap.get(cat) ?? { views: 0, likes: 0, comments: 0, count: 0, titles: [] }
      categoryMap.set(cat, {
        views: existing.views + video.viewCount,
        likes: existing.likes + video.likeCount,
        comments: existing.comments + video.commentCount,
        count: existing.count + 1,
        titles: [...existing.titles, video.title],
      })
    }

    const savedTrends = []

    for (const [categoryId, stats] of categoryMap.entries()) {
      const categoryName = YOUTUBE_CATEGORIES[categoryId] ?? 'Развлечения'
      const avgViews = Math.round(stats.views / stats.count)
      const engagementRate = stats.views > 0
        ? ((stats.likes + stats.comments) / stats.views) * 100
        : 0

      // Growth rate based on likes/views ratio (higher = more engaging = trending)
      const growthRate = Math.min(150, Math.round(engagementRate * 10))

      // Sentiment: likes ratio (no dislikes available since YouTube hid them)
      const sentiment = Math.min(0.99, 0.5 + engagementRate / 20)

      const trend = await prisma.trend.upsert({
        where: { id: `yt-${categoryId}` },
        update: {
          mentionsCount: stats.views,
          growthRate,
          sentiment,
          updatedAt: new Date(),
        },
        create: {
          id: `yt-${categoryId}`,
          keyword: `#${categoryName.replace(/ /g, '')}`,
          platform: 'YOUTUBE',
          mentionsCount: stats.views,
          growthRate,
          sentiment,
          isActive: true,
          detectedAt: new Date(),
        },
      })

      savedTrends.push(trend)
    }

    return NextResponse.json({
      success: true,
      synced: savedTrends.length,
      totalVideos: videos.length,
      trends: savedTrends,
    })
  } catch (error: any) {
    console.error('YouTube sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
