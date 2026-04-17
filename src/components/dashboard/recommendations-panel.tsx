import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, AlertTriangle, TrendingUp, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const recommendations = [
  {
    type: 'opportunity',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: '#ЭкоЖизнь растёт на 112%',
    text: 'Тренд устойчиво набирает аудиторию. Рекомендуем начать мониторинг прямо сейчас.',
  },
  {
    type: 'alert',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: '#Игры падает 3 недели',
    text: 'Снижение интереса к игровому контенту. Перераспределите ресурсы на растущие сегменты.',
  },
  {
    type: 'insight',
    icon: Lightbulb,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Instagram — лидер по охвату',
    text: 'На платформе 58% всех упоминаний. Сфокусируйте контент-стратегию здесь.',
  },
  {
    type: 'action',
    icon: Zap,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    title: 'Прогноз обновлён',
    text: 'Модель предсказывает рост #TikTokChallenge ещё на 40% в ближайшие 7 дней.',
  },
]

const typeLabel: Record<string, string> = {
  opportunity: 'Возможность',
  alert: 'Внимание',
  insight: 'Инсайт',
  action: 'Действие',
}

export function RecommendationsPanel() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Рекомендации системы</CardTitle>
        <CardDescription>Автоматический анализ и советы</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className={cn('flex gap-3 p-3 rounded-lg', rec.bg)}>
              <div className={cn('shrink-0 mt-0.5', rec.color)}>
                <rec.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold truncate">{rec.title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{rec.text}</p>
                <Badge variant="outline" className="mt-1.5 text-xs h-5 px-1.5">
                  {typeLabel[rec.type]}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
