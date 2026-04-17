import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatNumber, formatPercent } from '@/lib/utils'
import type { TrendData } from '@/lib/mock-data'
import { getPlatformLabel, getStatusLabel } from '@/lib/mock-data'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Props {
  trends: TrendData[]
}

const statusVariant: Record<string, 'success' | 'destructive' | 'info' | 'warning'> = {
  RISING: 'success',
  STABLE: 'info',
  FALLING: 'destructive',
  EMERGING: 'warning',
}

export function TopTrendsList({ trends }: Props) {
  const maxMentions = trends[0]?.mentionsCount ?? 1

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Топ трендов</CardTitle>
            <CardDescription>Самые популярные темы прямо сейчас</CardDescription>
          </div>
          <Link href="/trends" className="text-xs text-primary hover:underline">
            Все тренды →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trends.map((trend, idx) => {
            const Icon = trend.status === 'RISING' || trend.status === 'EMERGING'
              ? TrendingUp
              : trend.status === 'FALLING'
              ? TrendingDown
              : Minus
            const iconColor = trend.status === 'RISING' || trend.status === 'EMERGING'
              ? 'text-emerald-500'
              : trend.status === 'FALLING'
              ? 'text-red-500'
              : 'text-muted-foreground'

            return (
              <div key={trend.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground/60 w-5 shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold truncate">{trend.keyword}</span>
                    <Badge variant={statusVariant[trend.status]} className="text-xs shrink-0">
                      {getStatusLabel(trend.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(trend.mentionsCount / maxMentions) * 100}
                      className="h-1.5 flex-1"
                    />
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatNumber(trend.mentionsCount)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getPlatformLabel(trend.platform)}
                  </p>
                </div>
                <div className={cn('flex items-center gap-1 text-xs font-medium shrink-0', iconColor)}>
                  <Icon className="h-3 w-3" />
                  {formatPercent(trend.growthRate)}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
