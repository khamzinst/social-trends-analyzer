'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Save, Bell, Globe, Shield, Database, RefreshCw } from 'lucide-react'

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    language: 'ru',
    timezone: 'Asia/Almaty',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    trendAlerts: true,
    dataRetention: '90',
    autoSync: true,
    syncInterval: '60',
  })

  const save = () => {
    toast({ title: 'Настройки сохранены', variant: 'success' })
  }

  const toggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] })
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* General */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Общие настройки</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Язык интерфейса</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Выбор языка системы</p>
            </div>
            <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Часовой пояс</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Для отображения времени</p>
            </div>
            <Select value={settings.timezone} onValueChange={(v) => setSettings({ ...settings, timezone: v })}>
              <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Almaty">Алматы (UTC+5)</SelectItem>
                <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                <SelectItem value="Asia/Novosibirsk">Новосибирск (UTC+7)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Уведомления</CardTitle>
          </div>
          <CardDescription>Настройка оповещений системы</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email-уведомления', desc: 'Получать уведомления на почту' },
            { key: 'pushNotifications', label: 'Push-уведомления', desc: 'Уведомления в браузере' },
            { key: 'weeklyReport', label: 'Еженедельный отчёт', desc: 'Автоматический отчёт каждую неделю' },
            { key: 'trendAlerts', label: 'Оповещения о трендах', desc: 'При обнаружении новых трендов' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label>{label}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <Switch
                checked={settings[key as keyof typeof settings] as boolean}
                onCheckedChange={() => toggle(key as keyof typeof settings)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Данные и синхронизация</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Автосинхронизация</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Автоматически обновлять данные</p>
            </div>
            <Switch
              checked={settings.autoSync}
              onCheckedChange={() => toggle('autoSync')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Интервал синхронизации</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Как часто обновлять данные</p>
            </div>
            <Select value={settings.syncInterval} onValueChange={(v) => setSettings({ ...settings, syncInterval: v })}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Каждые 15 мин</SelectItem>
                <SelectItem value="30">Каждые 30 мин</SelectItem>
                <SelectItem value="60">Каждый час</SelectItem>
                <SelectItem value="360">Каждые 6 часов</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Хранение данных</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Как долго хранить аналитику</p>
            </div>
            <Select value={settings.dataRetention} onValueChange={(v) => setSettings({ ...settings, dataRetention: v })}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 дней</SelectItem>
                <SelectItem value="90">90 дней</SelectItem>
                <SelectItem value="180">180 дней</SelectItem>
                <SelectItem value="365">1 год</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} className="w-full">
        <Save className="mr-2 h-4 w-4" />
        Сохранить настройки
      </Button>
    </div>
  )
}
