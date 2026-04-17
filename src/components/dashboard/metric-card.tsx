import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  description: string
  color?: string
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-emerald-100 text-emerald-600',
  violet: 'bg-violet-100 text-violet-600',
  orange: 'bg-orange-100 text-orange-600',
  pink: 'bg-pink-100 text-pink-600',
  teal: 'bg-teal-100 text-teal-600',
}

export function MetricCard({ title, value, change, trend, icon: Icon, description, color = 'blue' }: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={cn('p-2 rounded-lg', colorMap[color] || colorMap.blue)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
            <TrendIcon className="h-3 w-3" />
            <span>{change}</span>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">{title}</p>
          <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
