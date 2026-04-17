import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchYouTubeTrending } from '@/lib/youtube'
import { getAuthUser } from '@/lib/auth'

export async function POST() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const videos = await fetchYouTubeTrending('KZ', 25)

    const saved = []

    for (const video of videos) {
      const engagementRate = video.viewCount > 0
        ? ((video.likeCount + video.commentCount) / video.viewCount) * 100
        : 0
      const growthRate = Math.min(150, Math.round(engagementRate * 8))
      const sentiment = Math.min(0.98, 0.5 + engagementRate / 15)

      // Store channel as extra info in keyword field
      const keyword = video.title.length > 60
        ? video.title.slice(0, 57) + '...'
        : video.title

      const trend = await prisma.trend.upsert({
        where: { id: `yt-video-${video.id}` },
        update: {
          mentionsCount: video.viewCount,
          growthRate,
          sentiment,
          updatedAt: new Date(),
        },
        create: {
          id: `yt-video-${video.id}`,
          keyword,
          platform: 'YOUTUBE',
          mentionsCount: video.viewCount,
          growthRate,
          sentiment,
          isActive: true,
          detectedAt: new Date(),
        },
      })

      saved.push({ ...trend, channelTitle: video.channelTitle, likeCount: video.likeCount, commentCount: video.commentCount })
    }

    return NextResponse.json({ success: true, synced: saved.length, totalVideos: videos.length, trends: saved })
  } catch (error: any) {
    console.error('YouTube sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
