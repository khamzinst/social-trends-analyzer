'use client'

import { useState, useMemo } from 'react'
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
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Search, Filter, Hash } from 'lucide-react'
import { MOCK_TRENDS, getPlatformLabel, getStatusLabel, type TrendData } from '@/lib/mock-data'
import { formatNumber, formatPercent, cn } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const STATUS_VARIANT: Record<string, any> = {
  RISING: 'success',
  STABLE: 'info',
  FALLING: 'destructive',
  EMERGING: 'warning',
}

const ALL_PLATFORMS = ['INSTAGRAM', 'TIKTOK', 'TWITTER', 'VKONTAKTE', 'YOUTUBE']
const ALL_STATUSES = ['RISING', 'STABLE', 'FALLING', 'EMERGING']
const PERIODS = ['7', '14', '30']

// Aggregate all hashtags
const ALL_HASHTAGS = Array.from(
  new Set(MOCK_TRENDS.flatMap((t) => t.hashtags))
).map((tag) => {
  const mentions = MOCK_TRENDS
    .filter((t) => t.hashtags.includes(tag))
    .reduce((s, t) => s + t.mentionsCount, 0)
  return { tag, mentions }
}).sort((a, b) => b.mentions - a.mentions)

export function TrendsPage() {
  const [platform, setPlatform] = useState('all')
  const [status, setStatus] = useState('all')
  const [period, setPeriod] = useState('30')
  const [search, setSearch] = useState('')
  const [selectedTrend, setSelectedTrend] = useState<TrendData | null>(null)

  const filtered = useMemo(() => {
    return MOCK_TRENDS.filter((t) => {
      if (platform !== 'all' && t.platform !== platform) return false
      if (status !== 'all' && t.status !== status) return false
      if (search && !t.keyword.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [platform, status, search])

  const chartData = useMemo(() => {
    const trend = selectedTrend ?? MOCK_TRENDS[0]
    const days = parseInt(period)
    return trend.timeSeries.slice(-days).map((p) => ({
      date: format(parseISO(p.date), 'd MMM', { locale: ru }),
      value: p.value,
    }))
  }, [selectedTrend, period])

  const topHashtags = ALL_HASHTAGS.slice(0, 15)
  const maxHashtagMentions = topHashtags[0]?.mentions ?? 1

  return (
    <div className="space-y-6">
      {/* Filters */}
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
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все платформы</SelectItem>
                {ALL_PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{getPlatformLabel(p as any)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{getStatusLabel(s as any)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                    <TableHead className="text-right">Engagement</TableHead>
                    <TableHead className="text-right">Тональность</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((trend) => {
                    const Icon =
                      trend.status === 'RISING' || trend.status === 'EMERGING'
                        ? TrendingUp
                        : trend.status === 'FALLING'
                        ? TrendingDown
                        : Minus
                    const growthColor =
                      trend.growthRate > 0
                        ? 'text-emerald-600'
                        : trend.growthRate < 0
                        ? 'text-red-500'
                        : 'text-muted-foreground'

                    return (
                      <TableRow
                        key={trend.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedTrend(trend)}
                      >
                        <TableCell className="font-semibold">{trend.keyword}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getPlatformLabel(trend.platform)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_VARIANT[trend.status]} className="text-xs">
                            {getStatusLabel(trend.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatNumber(trend.mentionsCount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={cn('flex items-center justify-end gap-1 text-sm font-medium', growthColor)}>
                            <Icon className="h-3.5 w-3.5" />
                            {formatPercent(trend.growthRate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{trend.avgEngagement}%</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress
                              value={Math.abs(trend.sentiment) * 100}
                              className={cn(
                                'w-16 h-1.5',
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
            {/* Trend selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Выберите тренд</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {MOCK_TRENDS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTrend(t)}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors',
                        (selectedTrend?.id ?? MOCK_TRENDS[0].id) === t.id
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

            {/* Chart */}
            <Card className="xl:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Динамика: {(selectedTrend ?? MOCK_TRENDS[0]).keyword}
                    </CardTitle>
                    <CardDescription>Количество упоминаний за {period} дней</CardDescription>
                  </div>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
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
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5}
                      dot={false} activeDot={{ r: 5 }} />
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
