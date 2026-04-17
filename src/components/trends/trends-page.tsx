'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Search, Hash, RefreshCw, Youtube } from 'lucide-react'
import { MOCK_TRENDS, getPlatformLabel, getStatusLabel, generateTimeSeries, type TrendData } from '@/lib/mock-data'
import { formatNumber, formatPercent, cn } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'

const STATUS_VARIANT: Record<string, any> = {
  RISING: 'success',
  STABLE: 'info',
  FALLING: 'destructive',
  EMERGING: 'warning',
}

const ALL_PLATFORMS = ['INSTAGRAM', 'TIKTOK', 'TWITTER', 'VKONTAKTE', 'YOUTUBE']
const ALL_STATUSES = ['RISING', 'STABLE', 'FALLING', 'EMERGING']

// Convert DB trend to TrendData format for charts
function dbTrendToTrendData(t: any): TrendData {
  const growth = t.growthRate ?? 0
  const status = growth > 30 ? 'RISING' : growth > 5 ? 'STABLE' : growth < 0 ? 'FALLING' : 'EMERGING'
  return {
    id: t.id,
    keyword: t.keyword,
    platform: t.platform as any,
    mentionsCount: t.mentionsCount,
    growthRate: growth,
    sentiment: t.sentiment ?? 0.5,
    status,
    hashtags: [t.keyword],
    avgEngagement: parseFloat(((t.mentionsCount > 0 ? (t.mentionsCount * 0.05) : 0)).toFixed(1)),
    timeSeries: generateTimeSeries(30, Math.round(t.mentionsCount * 0.7), growth),
  }
}

const ALL_HASHTAGS_FROM = (trends: TrendData[]) =>
  Array.from(new Set(trends.flatMap((t) => t.hashtags)))
    .map((tag) => ({
      tag,
      mentions: trends.filter((t) => t.hashtags.includes(tag)).reduce((s, t) => s + t.mentionsCount, 0),
    }))
    .sort((a, b) => b.mentions - a.mentions)

export function TrendsPage() {
  const { toast } = useToast()
  const [platform, setPlatform] = useState('all')
  const [status, setStatus] = useState('all')
  const [period, setPeriod] = useState('30')
  const [search, setSearch] = useState('')
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null)
  const [dbTrends, setDbTrends] = useState<TrendData[]>([])
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [dataSource, setDataSource] = useState<'mock' | 'real'>('mock')

  // Load DB trends on mount
  useEffect(() => {
    fetch('/api/trends')
      .then((r) => r.json())
      .then((data) => {
        if (data.trends?.length > 0) {
          const ytTrends = data.trends.filter((t: any) => t.platform === 'YOUTUBE')
          if (ytTrends.length > 0) {
            setDbTrends(ytTrends.map(dbTrendToTrendData))
            setDataSource('real')
          }
        }
      })
      .catch(() => {})
  }, [])

  const syncYouTube = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/youtube/sync', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const updated = await fetch('/api/trends').then((r) => r.json())
      const ytTrends = (updated.trends ?? []).filter((t: any) => t.platform === 'YOUTUBE')
      setDbTrends(ytTrends.map(dbTrendToTrendData))
      setDataSource('real')
      setLastSync(new Date())
      toast({ title: `Синхронизировано ${data.synced} трендов из ${data.totalVideos} видео YouTube`, variant: 'success' })
    } catch (e: any) {
      toast({ title: 'Ошибка синхронизации', description: e.message, variant: 'destructive' })
    } finally {
      setSyncing(false)
    }
  }

  const allTrends = dataSource === 'real' && dbTrends.length > 0
    ? [...dbTrends, ...MOCK_TRENDS.filter((t) => t.platform !== 'YOUTUBE')]
    : MOCK_TRENDS

  const filtered = useMemo(() => {
    return allTrends.filter((t) => {
      if (platform !== 'all' && t.platform !== platform) return false
      if (status !== 'all' && t.status !== status) return false
      if (search && !t.keyword.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [allTrends, platform, status, search])

  const chartData = useMemo(() => {
    const trend = selectedTrend ?? allTrends[0]
    if (!trend) return []
    const days = parseInt(period)
    return trend.timeSeries.slice(-days).map((p) => ({
      date: format(parseISO(p.date), 'd MMM', { locale: ru }),
      value: p.value,
    }))
  }, [selectedTrend, period, allTrends])

  const topHashtags = ALL_HASHTAGS_FROM(allTrends).slice(0, 15)
  const maxHashtagMentions = topHashtags[0]?.mentions ?? 1

  return (
    <div className="space-y-6">
      {/* Filters + Sync */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по ключевому слову..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все платформы</SelectItem>
                {ALL_PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{getPlatformLabel(p as any)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{getStatusLabel(s as any)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 ml-auto">
              {dataSource === 'real' && (
                <Badge variant="success" className="text-xs">
                  <Youtube className="h-3 w-3 mr-1" />
                  Реальные данные
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={syncYouTube}
                disabled={syncing}
                className="gap-2"
              >
                {syncing
                  ? <RefreshCw className="h-4 w-4 animate-spin" />
                  : <Youtube className="h-4 w-4 text-red-500" />
                }
                {syncing ? 'Загрузка...' : 'Синхронизировать YouTube'}
              </Button>
            </div>
          </div>
          {lastSync && (
            <p className="text-xs text-muted-foreground mt-2">
              Последняя синхронизация: {format(lastSync, 'd MMM yyyy, HH:mm', { locale: ru })}
            </p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Таблица трендов</TabsTrigger>
          <TabsTrigger value="chart">Динамика роста</TabsTrigger>
          <TabsTrigger value="hashtags">Хэштеги</TabsTrigger>
        </TabsList>

        {/* Table tab */}
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Тренды ({filtered.length})</CardTitle>
              <CardDescription>Нажмите на тренд для просмотра динамики на вкладке «Динамика роста»</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ключевое слово</TableHead>
                    <TableHead>Платформа</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Упоминания</TableHead>
                    <TableHead className="text-right">Рост</TableHead>
                    <TableHead className="text-right">Тональность</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((trend) => {
                    const Icon = trend.status === 'RISING' || trend.status === 'EMERGING'
                      ? TrendingUp : trend.status === 'FALLING' ? TrendingDown : Minus
                    const growthColor = trend.growthRate > 0 ? 'text-emerald-600'
                      : trend.growthRate < 0 ? 'text-red-500' : 'text-muted-foreground'
                    return (
                      <TableRow key={trend.id} className="cursor-pointer" onClick={() => setSelectedTrend(trend)}>
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2">
                            {trend.platform === 'YOUTUBE' && dataSource === 'real' && (
                              <Youtube className="h-3.5 w-3.5 text-red-500 shrink-0" />
                            )}
                            {trend.keyword}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{getPlatformLabel(trend.platform)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_VARIANT[trend.status]} className="text-xs">
                            {getStatusLabel(trend.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatNumber(trend.mentionsCount)}</TableCell>
                        <TableCell className="text-right">
                          <div className={cn('flex items-center justify-end gap-1 text-sm font-medium', growthColor)}>
                            <Icon className="h-3.5 w-3.5" />
                            {formatPercent(trend.growthRate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress
                              value={Math.abs(trend.sentiment) * 100}
                              className={cn('w-16 h-1.5',
                                trend.sentiment >= 0.6 ? '[&>div]:bg-emerald-500' :
                                trend.sentiment >= 0.4 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'
                              )}
                            />
                            <span className="text-xs text-muted-foreground w-8">
                              {(trend.sentiment * 100).toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chart tab */}
        <TabsContent value="chart">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm">Выберите тренд</CardTitle></CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {allTrends.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTrend(t)}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors',
                        (selectedTrend?.id ?? allTrends[0]?.id) === t.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <div className="font-medium truncate">{t.keyword}</div>
                      <div className="text-xs opacity-70">{getPlatformLabel(t.platform)}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Динамика: {(selectedTrend ?? allTrends[0])?.keyword}
                    </CardTitle>
                    <CardDescription>Количество упоминаний за {period} дней</CardDescription>
                  </div>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 дней</SelectItem>
                      <SelectItem value="14">14 дней</SelectItem>
                      <SelectItem value="30">30 дней</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={2} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => v >= 1000 ? (v / 1000).toFixed(0) + 'К' : v} width={50} />
                    <Tooltip
                      formatter={(v: any) => [v.toLocaleString('ru-RU') + ' упоминаний', 'Упоминания']}
                      contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 12 }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hashtags tab */}
        <TabsContent value="hashtags">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Популярные хэштеги</CardTitle>
              <CardDescription>Топ-15 хэштегов по количеству упоминаний</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topHashtags.map(({ tag, mentions }, idx) => (
                  <div key={tag} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-5 shrink-0">{idx + 1}</span>
                    <div className="flex items-center gap-2 w-36 shrink-0">
                      <Hash className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium truncate">{tag.replace('#', '')}</span>
                    </div>
                    <Progress value={(mentions / maxHashtagMentions) * 100} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground w-20 text-right shrink-0">
                      {formatNumber(mentions)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
