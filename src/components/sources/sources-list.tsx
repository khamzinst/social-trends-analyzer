'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, RefreshCw, Trash2, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDateTime } from '@/lib/utils'

type Source = {
  id: string
  name: string
  platform: string
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

const MOCK_SOURCES: Source[] = [
  {
    id: 'mock-1',
    name: 'Instagram — основной',
    platform: 'INSTAGRAM',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 10),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'mock-2',
    name: 'TikTok — тренды',
    platform: 'TIKTOK',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'mock-3',
    name: 'Twitter/X — новости',
    platform: 'TWITTER',
    isActive: false,
    createdAt: new Date(Date.now() - 86400000 * 20),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 'mock-4',
    name: 'ВКонтакте — сообщества',
    platform: 'VKONTAKTE',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 15),
    updatedAt: new Date(Date.now() - 1800000),
  },
]

const platformLabels: Record<string, string> = {
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  TWITTER: 'Twitter/X',
  VKONTAKTE: 'ВКонтакте',
  YOUTUBE: 'YouTube',
  OTHER: 'Другое',
}

const platformColors: Record<string, string> = {
  INSTAGRAM: 'bg-pink-100 text-pink-700',
  TIKTOK: 'bg-slate-100 text-slate-700',
  TWITTER: 'bg-sky-100 text-sky-700',
  VKONTAKTE: 'bg-blue-100 text-blue-700',
  YOUTUBE: 'bg-red-100 text-red-700',
  OTHER: 'bg-gray-100 text-gray-700',
}

interface Props {
  initialSources: Source[]
}

export function SourcesList({ initialSources }: Props) {
  const [sources, setSources] = useState<Source[]>(
    initialSources.length > 0 ? initialSources : MOCK_SOURCES
  )
  const [open, setOpen] = useState(false)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', platform: 'INSTAGRAM' })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAdd = async () => {
    if (!form.name.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const { source } = await res.json()
        setSources([source, ...sources])
        setOpen(false)
        setForm({ name: '', platform: 'INSTAGRAM' })
        toast({ title: 'Источник добавлен', variant: 'success' })
      }
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось добавить источник', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async (id: string) => {
    setSyncing(id)
    await new Promise((r) => setTimeout(r, 2000))
    setSyncing(null)
    toast({ title: 'Синхронизация завершена', description: 'Данные обновлены', variant: 'success' })
  }

  const handleDelete = async (id: string) => {
    setSources(sources.filter((s) => s.id !== id))
    toast({ title: 'Источник удалён' })
  }

  const active = sources.filter((s) => s.isActive).length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Всего источников', value: sources.length },
          { label: 'Активных', value: active },
          { label: 'Отключённых', value: sources.length - active },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Подключённые источники</CardTitle>
              <CardDescription>
                Управляйте источниками данных социальных сетей. Сейчас используются mock-данные.
              </CardDescription>
            </div>
            <Button onClick={() => setOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                      platformColors[source.platform] || platformColors.OTHER
                    }`}
                  >
                    <span className="text-xs font-bold">
                      {platformLabels[source.platform]?.slice(0, 2) || 'SO'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{source.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs h-5 px-1.5">
                        {platformLabels[source.platform]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Обновлено: {formatDateTime(source.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    {source.isActive ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-600">Активен</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-400" />
                        <span className="text-red-500">Отключён</span>
                      </>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleSync(source.id)}
                    disabled={syncing === source.id}
                    title="Синхронизировать"
                  >
                    <RefreshCw className={`h-4 w-4 ${syncing === source.id ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(source.id)}
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {sources.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Источники не добавлены</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить источник данных</DialogTitle>
            <DialogDescription>
              Настройте подключение к социальной сети (в данный момент — mock-режим)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Например: Instagram — бренд"
              />
            </div>
            <div className="space-y-2">
              <Label>Платформа</Label>
              <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(platformLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={handleAdd} disabled={loading || !form.name.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
