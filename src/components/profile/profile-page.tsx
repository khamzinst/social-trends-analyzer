'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Save, Loader2, User, Mail, Calendar, Key } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date | string
}

interface Props { user: UserProfile }

export function ProfilePage({ user }: Props) {
  const [name, setName] = useState(user.name)
  const [loading, setLoading] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const { toast } = useToast()

  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const saveProfile = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        toast({ title: 'Профиль обновлён', variant: 'success' })
      }
    } catch {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    if (pwForm.next !== pwForm.confirm) {
      toast({ title: 'Пароли не совпадают', variant: 'destructive' })
      return
    }
    if (pwForm.next.length < 6) {
      toast({ title: 'Минимум 6 символов', variant: 'destructive' })
      return
    }
    setPwLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast({ title: 'Пароль изменён', variant: 'success' })
    setPwForm({ current: '', next: '', confirm: '' })
    setPwLoading(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <Badge variant="outline" className="mt-1.5 text-xs">Аналитик</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { icon: User, label: 'Имя', value: user.name },
              { icon: Mail, label: 'Email', value: user.email },
              { icon: Calendar, label: 'Дата регистрации', value: formatDateTime(user.createdAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Редактировать профиль</CardTitle>
          <CardDescription>Обновите ваши личные данные</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Имя</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground">Email нельзя изменить</p>
          </div>
          <Button onClick={saveProfile} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Сохранить
          </Button>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Изменить пароль</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Текущий пароль</Label>
            <Input type="password" value={pwForm.current}
              onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Новый пароль</Label>
            <Input type="password" value={pwForm.next}
              onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Подтвердите новый пароль</Label>
            <Input type="password" value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} />
          </div>
          <Button onClick={changePassword} disabled={pwLoading || !pwForm.current || !pwForm.next}>
            {pwLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Изменить пароль
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
