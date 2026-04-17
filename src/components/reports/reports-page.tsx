'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Plus, FileText, Eye, Download, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDateTime } from '@/lib/utils'
import { MOCK_TRENDS, getPlatformLabel } from '@/lib/mock-data'

type Report = {
  id: string
  title: string
  description?: string | null
  status: string
  platform?: string | null
  recordsCount: number
  trendsFound: number
  createdAt: Date | string
}

const MOCK_REPORTS: Report[] = [
  {
    id: 'r1',
    title: 'Анализ Instagram — апрель 2024',
    description: 'Полный анализ трендов Instagram за апрель. Выявлено 5 растущих трендов в сегменте ЗОЖ.',
    status: 'COMPLETED',
    platform: 'INSTAGRAM',
    recordsCount: 1842,
    trendsFound: 8,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 'r2',
    title: 'TikTok-тренды Q1 2024',
    description: 'Квартальный отчёт по трендам TikTok. Анализ вирусных видео и хэштегов.',
    status: 'COMPLETED',
    platform: 'TIKTOK',
    recordsCount: 567,
    trendsFound: 12,
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: 'r3',
    title: 'Кросс-платформенный анализ марта',
    description: 'Сравнение трендов по всем платформам за март 2024 года.',
    status: 'COMPLETED',
    platform: null,
    recordsCount: 5234,
    trendsFound: 15,
    createdAt: new Date(Date.now() - 86400000 * 14),
  },
  {
    id: 'r4',
    title: 'Еженедельный дайджест',
    description: 'Автоматический еженедельный отчёт по всем отслеживаемым трендам.',
    status: 'PROCESSING',
    platform: null,
    recordsCount: 0,
    trendsFound: 0,
    createdAt: new Date(Date.now() - 3600000),
  },
]

const statusConfig: Record<string, { label: string; icon: any; variant: any }> = {
  COMPLETED: { label: 'Завершён', icon: CheckCircle2, variant: 'success' },
  PROCESSING: { label: 'Обработка', icon: Loader2, variant: 'info' },
  DRAFT: { label: 'Черновик', icon: Clock, variant: 'warning' },
  FAILED: { label: 'Ошибка', icon: XCircle, variant: 'destructive' },
}

const platformLabels: Record<string, string> = {
  INSTAGRAM: 'Instagram', TIKTOK: 'TikTok', TWITTER: 'Twitter/X',
  VKONTAKTE: 'ВКонтакте', YOUTUBE: 'YouTube',
}

interface Props { initialReports: Report[] }

const DEFAULT_REPORT_CONTENT = (report: Report) => `
# ${report.title}

**Дата создания:** ${formatDateTime(report.createdAt)}
**Платформа:** ${report.platform ? platformLabels[report.platform] : 'Все платформы'}
**Статус:** Завершён

---

## Сводка

- Проанализировано записей: **${report.recordsCount.toLocaleString('ru-RU')}**
- Выявлено трендов: **${report.trendsFound}**
- Период анализа: последние 30 дней

## Топ-5 трендов периода

${MOCK_TRENDS.slice(0, 5).map((t, i) =>
  `${i + 1}. **${t.keyword}** — ${t.mentionsCount.toLocaleString('ru-RU')} упоминаний, рост ${t.growthRate >= 0 ? '+' : ''}${t.growthRate.toFixed(1)}%`
).join('\n')}

## Выводы

Анализ показывает устойчивый рост интереса к тематике здорового образа жизни и технологий.
Рекомендуется усилить мониторинг сегментов с высоким ростом для своевременного реагирования.

---
*Отчёт сгенерирован автоматически системой TrendScope*
`

export function ReportsPage({ initialReports }: Props) {
  const [reports, setReports] = useState<Report[]>(
    initialReports.length > 0 ? initialReports : MOCK_REPORTS
  )
  const [open, setOpen] = useState(false)
  const [viewReport, setViewReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', platform: 'none', period: '30' })
  const { toast } = useToast()

  const handleCreate = async () => {
    if (!form.title.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          platform: form.platform === 'none' ? null : form.platform,
          period: form.period,
          recordsCount: Math.floor(Math.random() * 3000) + 500,
          trendsFound: Math.floor(Math.random() * 10) + 3,
        }),
      })

      const newReport: Report = res.ok ? (await res.json()).report : {
        id: `r-${Date.now()}`,
        title: form.title,
        description: `Анализ за ${form.period} дней`,
        status: 'COMPLETED',
        platform: form.platform === 'none' ? null : form.platform,
        recordsCount: Math.floor(Math.random() * 3000) + 500,
        trendsFound: Math.floor(Math.random() * 10) + 3,
        createdAt: new Date(),
      }

      setReports([newReport, ...reports])
      setOpen(false)
      setForm({ title: '', platform: '', period: '30' })
      toast({ title: 'Отчёт создан', variant: 'success' })
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Всего отчётов', value: reports.length },
          { label: 'Завершённых', value: reports.filter((r) => r.status === 'COMPLETED').length },
          { label: 'Трендов найдено', value: reports.reduce((s, r) => s + r.trendsFound, 0) },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Отчёты анализа</CardTitle>
              <CardDescription>Результаты анализа данных социальных сетей</CardDescription>
            </div>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать отчёт
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Отчёты ещё не созданы</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Платформа</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Записей</TableHead>
                  <TableHead className="text-right">Трендов</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => {
                  const st = statusConfig[report.status] || statusConfig.DRAFT
                  const StIcon = st.icon
                  return (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{report.title}</p>
                          {report.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-xs">
                              {report.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {report.platform ? (
                          <Badge variant="outline" className="text-xs">
                            {platformLabels[report.platform] || report.platform}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Все</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <StIcon className={`h-3.5 w-3.5 ${report.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
                          <Badge variant={st.variant} className="text-xs">{st.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {report.recordsCount.toLocaleString('ru-RU')}
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold">
                        {report.trendsFound}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDateTime(report.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"
                            onClick={() => setViewReport(report)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать отчёт</DialogTitle>
            <DialogDescription>Запустите анализ данных для формирования нового отчёта</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Название отчёта</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Например: Анализ трендов Instagram" />
            </div>
            <div className="space-y-2">
              <Label>Платформа (необязательно)</Label>
              <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                <SelectTrigger><SelectValue placeholder="Все платформы" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Все платформы</SelectItem>
                  {Object.entries(platformLabels).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Период анализа</Label>
              <Select value={form.period} onValueChange={(v) => setForm({ ...form, period: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 дней</SelectItem>
                  <SelectItem value="30">30 дней</SelectItem>
                  <SelectItem value="90">90 дней</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={handleCreate} disabled={loading || !form.title.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View report dialog */}
      <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewReport?.title}</DialogTitle>
          </DialogHeader>
          {viewReport && (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm font-sans text-foreground bg-muted/30 p-4 rounded-lg">
                {DEFAULT_REPORT_CONTENT(viewReport).trim()}
              </pre>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
