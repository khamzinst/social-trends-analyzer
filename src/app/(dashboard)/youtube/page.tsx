'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RefreshCw, Youtube, TrendingUp, Eye, ThumbsUp, MessageCircle, ExternalLink } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface VideoTrend {
  id: string
  title: string
  channelTitle: string
  viewCount: number
  likeCount: number
  commentCount: number
  growthRate: number
  sentiment: number
  publishedAt: string
  videoId: string
}

export default function YouTubePage() {
  const { toast } = useToast()
  const [videos, setVideos] = useState<VideoTrend[]>([])
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [synced, setSynced] = useState(false)

  const syncData = async () => {
    setSyncing(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KZ&maxResults=25&key=AIzaSyDBi2XSy-4-mvWRGsKZLhQRYuV86Sbcrcc`)
      if (!res.ok) throw new Error('YouTube API error')
      const data = await res.json()

      const fetched: VideoTrend[] = (data.items || []).map((item: any) => {
        const views = parseInt(item.statistics?.viewCount ?? '0')
        const likes = parseInt(item.statistics?.likeCount ?? '0')
        const comments = parseInt(item.statistics?.commentCount ?? '0')
        const engagement = views > 0 ? ((likes + comments) / views) * 100 : 0
        return {
          id: item.id,
          videoId: item.id,
          title: item.snippet?.title ?? '',
          channelTitle: item.snippet?.channelTitle ?? '',
          viewCount: views,
          likeCount: likes,
          commentCount: comments,
          growthRate: Math.min(150, Math.round(engagement * 8)),
          sentiment: Math.min(0.98, 0.5 + engagement / 15),
          publishedAt: item.snippet?.publishedAt ?? '',
        }
      })

      setVideos(fetched)
      setLastSync(new Date())
      setSynced(true)
      toast({ title: `Загружено ${fetched.length} трендов YouTube для Казахстана`, variant: 'success' })
    } catch (e: any) {
      toast({ title: 'Ошибка загрузки', description: e.message, variant: 'destructive' })
    } finally {
      setSyncing(false)
    }
  }

  const maxViews = videos[0]?.viewCount ?? 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                <Youtube className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">YouTube Тренды — Казахстан</h2>
                <p className="text-xs text-muted-foreground">
                  {synced ? `Топ-${videos.length} трендящих видео прямо сейчас` : 'Нажмите синхронизировать для загрузки реальных данных'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastSync && (
                <span className="text-xs text-muted-foreground">
                  Обновлено: {format(lastSync, 'HH:mm, d MMM', { locale: ru })}
                </span>
              )}
              <Button onClick={syncData} disabled={syncing} className="gap-2 bg-red-500 hover:bg-red-600 text-white">
                {syncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Youtube className="h-4 w-4" />}
                {syncing ? 'Загрузка...' : 'Загрузить реальные данные'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      {synced && videos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Видео в тренде', value: videos.length, icon: TrendingUp, color: 'text-indigo-500' },
            { label: 'Суммарно просмотров', value: formatNumber(videos.reduce((s, v) => s + v.viewCount, 0)), icon: Eye, color: 'text-blue-500' },
            { label: 'Суммарно лайков', value: formatNumber(videos.reduce((s, v) => s + v.likeCount, 0)), icon: ThumbsUp, color: 'text-emerald-500' },
            { label: 'Суммарно комментариев', value: formatNumber(videos.reduce((s, v) => s + v.commentCount, 0)), icon: MessageCircle, color: 'text-amber-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <p className="text-xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Video list */}
      {synced && videos.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Трендящие видео в Казахстане</CardTitle>
            <CardDescription>Реальные данные с YouTube Data API v3 · Регион: KZ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {videos.map((video, idx) => (
                <div key={video.id} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/20 transition-colors">
                  <span className="text-lg font-bold text-muted-foreground w-7 shrink-0 mt-0.5">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm leading-tight mb-0.5 line-clamp-2">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.channelTitle}</p>
                      </div>
                      <a
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" /> {formatNumber(video.viewCount)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-600">
                        <ThumbsUp className="h-3 w-3" /> {formatNumber(video.likeCount)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-500">
                        <MessageCircle className="h-3 w-3" /> {formatNumber(video.commentCount)}
                      </div>
                      <Badge variant={video.growthRate > 20 ? 'success' : 'outline'} className="text-xs">
                        {video.growthRate > 20 ? 'Растёт' : 'Стабильно'}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={(video.viewCount / maxViews) * 100} className="h-1.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : !synced ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Youtube className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Реальные данные YouTube</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Нажмите кнопку выше чтобы загрузить топ трендящих видео в Казахстане прямо сейчас — реальные названия, просмотры, лайки и комментарии.
            </p>
            <Button onClick={syncData} disabled={syncing} className="gap-2 bg-red-500 hover:bg-red-600 text-white">
              <Youtube className="h-4 w-4" />
              Загрузить реальные данные
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
