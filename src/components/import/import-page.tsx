'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Upload, FileText, CheckCircle2, XCircle, Clock, Loader2, Download, Eye,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDateTime } from '@/lib/utils'
import { format } from 'date-fns'

type Dataset = {
  id: string
  name: string
  recordCount: number
  status: string
  platform: string
  createdAt: Date | string
}

const MOCK_DATASETS: Dataset[] = [
  {
    id: 'ds-1',
    name: 'instagram_posts_april.csv',
    recordCount: 1842,
    status: 'COMPLETED',
    platform: 'INSTAGRAM',
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 'ds-2',
    name: 'tiktok_trends_march.json',
    recordCount: 567,
    status: 'COMPLETED',
    platform: 'TIKTOK',
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: 'ds-3',
    name: 'twitter_hashtags.csv',
    recordCount: 3241,
    status: 'COMPLETED',
    platform: 'TWITTER',
    createdAt: new Date(Date.now() - 86400000 * 14),
  },
]

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  COMPLETED: { label: 'Загружен', icon: CheckCircle2, color: 'text-emerald-600' },
  PROCESSING: { label: 'Обработка', icon: Loader2, color: 'text-blue-600' },
  PENDING: { label: 'Ожидание', icon: Clock, color: 'text-amber-600' },
  FAILED: { label: 'Ошибка', icon: XCircle, color: 'text-red-500' },
}

const platformLabels: Record<string, string> = {
  INSTAGRAM: 'Instagram', TIKTOK: 'TikTok', TWITTER: 'Twitter/X',
  VKONTAKTE: 'ВКонтакте', YOUTUBE: 'YouTube', OTHER: 'Другое',
}

const SAMPLE_CSV = `platform,author,content,likes,comments,shares,hashtags,date
Instagram,user123,"Отличное утро для пробежки! #зож #фитнес",1234,89,45,"зож,фитнес",2024-04-01
TikTok,creator_x,"Новый танцевальный тренд #challenge #dance",5678,234,890,"challenge,dance",2024-04-01
Twitter,analyst_1,"ИИ меняет всё #tech #AI #нейросети",456,67,123,"tech,AI,нейросети",2024-04-01
Instagram,lifestyle_blog,"Идеальный завтрак #зож #питание #healthy",2341,156,78,"зож,питание,healthy",2024-04-02`

interface Props { initialDatasets: Dataset[] }

export function ImportPage({ initialDatasets }: Props) {
  const [datasets, setDatasets] = useState<Dataset[]>(
    initialDatasets.length > 0 ? initialDatasets : MOCK_DATASETS
  )
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(csv|json)$/i)) {
      toast({ title: 'Неверный формат', description: 'Поддерживаются только CSV и JSON', variant: 'destructive' })
      return
    }

    setUploading(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 90))
    }, 200)

    try {
      const text = await file.text()
      let recordCount = 0

      if (file.name.endsWith('.csv')) {
        recordCount = text.split('\n').filter((l) => l.trim()).length - 1
      } else {
        try {
          const parsed = JSON.parse(text)
          recordCount = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length
        } catch {
          recordCount = 0
        }
      }

      // Save via API
      const res = await fetch('/api/datasets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          recordCount: Math.max(recordCount, 1),
          status: 'COMPLETED',
          platform: 'OTHER',
        }),
      })

      clearInterval(interval)
      setProgress(100)

      if (res.ok) {
        const { dataset } = await res.json()
        setDatasets([dataset, ...datasets])
      } else {
        // Fallback: show locally
        setDatasets([
          {
            id: `local-${Date.now()}`,
            name: file.name,
            recordCount: Math.max(recordCount, 1),
            status: 'COMPLETED',
            platform: 'OTHER',
            createdAt: new Date(),
          },
          ...datasets,
        ])
      }

      toast({ title: 'Файл загружен', description: `${file.name}: ${Math.max(recordCount, 1)} записей`, variant: 'success' })
    } catch {
      clearInterval(interval)
      toast({ title: 'Ошибка загрузки', variant: 'destructive' })
    } finally {
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
      }, 500)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Загрузка данных</CardTitle>
              <CardDescription>Импортируйте данные в формате CSV или JSON</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={downloadSample}>
              <Download className="h-4 w-4 mr-2" />
              Скачать пример CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !uploading && fileRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
              ${dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}
              ${uploading ? 'pointer-events-none' : ''}
            `}
          >
            <input ref={fileRef} type="file" accept=".csv,.json" className="hidden" onChange={onFileChange} />

            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Обработка файла...</p>
                  <Progress value={progress} className="max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground">{progress}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground/50" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Перетащите файл сюда или нажмите для выбора
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Поддерживаются форматы CSV и JSON (до 50 МБ)
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 rounded-lg bg-muted/40 border">
            <p className="text-xs font-semibold mb-2 text-muted-foreground">ОЖИДАЕМЫЕ ПОЛЯ CSV:</p>
            <code className="text-xs text-foreground">
              platform, author, content, likes, comments, shares, hashtags, date
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Datasets list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Загруженные наборы данных</CardTitle>
          <CardDescription>{datasets.length} наборов данных</CardDescription>
        </CardHeader>
        <CardContent>
          {datasets.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Данные ещё не загружены</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя файла</TableHead>
                  <TableHead>Платформа</TableHead>
                  <TableHead>Записей</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата загрузки</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasets.map((ds) => {
                  const status = statusConfig[ds.status] || statusConfig.PENDING
                  const StatusIcon = status.icon
                  return (
                    <TableRow key={ds.id}>
                      <TableCell className="font-medium">{ds.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {platformLabels[ds.platform] || ds.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>{ds.recordCount.toLocaleString('ru-RU')}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${status.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDateTime(ds.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
