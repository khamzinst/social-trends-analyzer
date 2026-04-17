import { getAuthUser } from '@/lib/auth'
import { getDashboardStats, MOCK_TRENDS, getWeeklyMentionsChart, getPlatformDistribution } from '@/lib/mock-data'
import { MetricCard } from '@/components/dashboard/metric-card'
import { TrendsOverviewChart } from '@/components/dashboard/trends-overview-chart'
import { TopTrendsList } from '@/components/dashboard/top-trends-list'
import { RecommendationsPanel } from '@/components/dashboard/recommendations-panel'
import { PlatformChart } from '@/components/dashboard/platform-chart'
import { TrendingUp, Database, BarChart3, Activity, Users, ArrowUpRight } from 'lucide-react'
import { formatNumber, formatPercent } from '@/lib/utils'

export default async function DashboardPage() {
  const stats = getDashboardStats()
  const weeklyData = getWeeklyMentionsChart()
  const platformData = getPlatformDistribution()
  const topTrends = MOCK_TRENDS.sort((a, b) => b.mentionsCount - a.mentionsCount).slice(0, 5)

  const metrics = [
    {
      title: 'Всего упоминаний',
      value: formatNumber(stats.totalMentions),
      change: '+12.4%',
      trend: 'up' as const,
      icon: Activity,
      description: 'за последние 30 дней',
      color: 'blue',
    },
    {
      title: 'Растущих трендов',
      value: String(stats.risingCount),
      change: '+2',
      trend: 'up' as const,
      icon: TrendingUp,
      description: 'из ' + stats.totalTrends + ' отслеживаемых',
      color: 'green',
    },
    {
      title: 'Средний рост',
      value: formatPercent(stats.avgGrowth),
      change: '+5.2%',
      trend: 'up' as const,
      icon: ArrowUpRight,
      description: 'по всем платформам',
      color: 'violet',
    },
    {
      title: 'Источников данных',
      value: String(stats.activeSources),
      change: '0',
      trend: 'neutral' as const,
      icon: Database,
      description: 'активных подключений',
      color: 'orange',
    },
    {
      title: 'Средний engagement',
      value: stats.avgEngagement + '%',
      change: '+0.8%',
      trend: 'up' as const,
      icon: Users,
      description: 'уровень вовлечённости',
      color: 'pink',
    },
    {
      title: 'Отчётов создано',
      value: '12',
      change: '+3',
      trend: 'up' as const,
      icon: BarChart3,
      description: 'за этот месяц',
      color: 'teal',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TrendsOverviewChart data={weeklyData} />
        </div>
        <div>
          <PlatformChart data={platformData} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TopTrendsList trends={topTrends} />
        </div>
        <div>
          <RecommendationsPanel />
        </div>
      </div>
    </div>
  )
}
