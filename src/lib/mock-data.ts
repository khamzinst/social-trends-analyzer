import { subDays, format, addDays } from 'date-fns'

export type Platform = 'INSTAGRAM' | 'TIKTOK' | 'TWITTER' | 'VKONTAKTE' | 'YOUTUBE' | 'OTHER'
export type TrendStatus = 'RISING' | 'STABLE' | 'FALLING' | 'EMERGING'

export interface TimePoint {
  date: string
  value: number
}

export interface TrendData {
  id: string
  keyword: string
  platform: Platform
  status: TrendStatus
  mentionsCount: number
  growthRate: number
  sentiment: number
  timeSeries: TimePoint[]
  hashtags: string[]
  avgEngagement: number
}

export interface ForecastPoint {
  date: string
  actual?: number
  predicted: number
  lower: number
  upper: number
}

// Generate smooth time series with trend
function generateTimeSeries(
  days: number,
  baseValue: number,
  trend: number,
  noise: number = 0.15
): TimePoint[] {
  const series: TimePoint[] = []
  let value = baseValue

  for (let i = days; i >= 0; i--) {
    value = value * (1 + trend / 100) + (Math.random() - 0.5) * value * noise
    value = Math.max(0, value)
    series.push({
      date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
      value: Math.round(value),
    })
  }
  return series
}

export const MOCK_TRENDS: TrendData[] = [
  {
    id: 't1',
    keyword: '#ЗОЖ',
    platform: 'INSTAGRAM',
    status: 'RISING',
    mentionsCount: 142500,
    growthRate: 34.7,
    sentiment: 0.78,
    hashtags: ['#зож', '#здоровье', '#фитнес', '#спорт', '#питание'],
    avgEngagement: 8.4,
    timeSeries: generateTimeSeries(30, 80000, 3.2),
  },
  {
    id: 't2',
    keyword: '#TikTokChallenge',
    platform: 'TIKTOK',
    status: 'RISING',
    mentionsCount: 389000,
    growthRate: 67.2,
    sentiment: 0.65,
    hashtags: ['#challenge', '#вирус', '#танцы', '#тренд', '#fyp'],
    avgEngagement: 12.1,
    timeSeries: generateTimeSeries(30, 150000, 5.8),
  },
  {
    id: 't3',
    keyword: '#Технологии',
    platform: 'TWITTER',
    status: 'STABLE',
    mentionsCount: 95200,
    growthRate: 3.1,
    sentiment: 0.52,
    hashtags: ['#tech', '#ИИ', '#искусственныйинтеллект', '#нейросети', '#разработка'],
    avgEngagement: 5.7,
    timeSeries: generateTimeSeries(30, 90000, 0.4),
  },
  {
    id: 't4',
    keyword: '#Мода2024',
    platform: 'INSTAGRAM',
    status: 'RISING',
    mentionsCount: 218000,
    growthRate: 28.9,
    sentiment: 0.71,
    hashtags: ['#мода', '#стиль', '#fashion', '#ootd', '#одежда'],
    avgEngagement: 9.3,
    timeSeries: generateTimeSeries(30, 120000, 2.6),
  },
  {
    id: 't5',
    keyword: '#Путешествия',
    platform: 'INSTAGRAM',
    status: 'STABLE',
    mentionsCount: 176400,
    growthRate: 8.4,
    sentiment: 0.88,
    hashtags: ['#путешествия', '#travel', '#туризм', '#отдых', '#природа'],
    avgEngagement: 11.2,
    timeSeries: generateTimeSeries(30, 160000, 0.8),
  },
  {
    id: 't6',
    keyword: '#Игры',
    platform: 'TIKTOK',
    status: 'FALLING',
    mentionsCount: 64800,
    growthRate: -12.3,
    sentiment: 0.45,
    hashtags: ['#gaming', '#игры', '#стрим', '#геймер', '#ps5'],
    avgEngagement: 7.6,
    timeSeries: generateTimeSeries(30, 90000, -1.4),
  },
  {
    id: 't7',
    keyword: '#Рецепты',
    platform: 'VKONTAKTE',
    status: 'STABLE',
    mentionsCount: 87300,
    growthRate: 5.2,
    sentiment: 0.82,
    hashtags: ['#рецепты', '#еда', '#кулинария', '#готовлю', '#вкусно'],
    avgEngagement: 6.8,
    timeSeries: generateTimeSeries(30, 80000, 0.5),
  },
  {
    id: 't8',
    keyword: '#Криптовалюта',
    platform: 'TWITTER',
    status: 'EMERGING',
    mentionsCount: 45200,
    growthRate: 89.4,
    sentiment: 0.38,
    hashtags: ['#крипто', '#биткоин', '#ethereum', '#web3', '#defi'],
    avgEngagement: 4.2,
    timeSeries: generateTimeSeries(30, 15000, 7.2),
  },
  {
    id: 't9',
    keyword: '#Образование',
    platform: 'YOUTUBE',
    status: 'RISING',
    mentionsCount: 103600,
    growthRate: 19.8,
    sentiment: 0.76,
    hashtags: ['#образование', '#учёба', '#курсы', '#обучение', '#edtech'],
    avgEngagement: 8.9,
    timeSeries: generateTimeSeries(30, 70000, 1.9),
  },
  {
    id: 't10',
    keyword: '#ЭкоЖизнь',
    platform: 'INSTAGRAM',
    status: 'EMERGING',
    mentionsCount: 34100,
    growthRate: 112.6,
    sentiment: 0.84,
    hashtags: ['#эко', '#sustainability', '#зеленый', '#экология', '#природа'],
    avgEngagement: 10.4,
    timeSeries: generateTimeSeries(30, 8000, 8.9),
  },
]

export type ForecastModel = 'linear' | 'exponential' | 'arima'

export function generateForecast(trend: TrendData, horizonDays: number = 7, model: ForecastModel = 'linear'): ForecastPoint[] {
  const series = trend.timeSeries
  const n = series.length
  const lastActual = series[n - 1].value
  const window = series.slice(-14)

  // Linear regression slope (used by all models as a base)
  const xMean = (window.length - 1) / 2
  const yMean = window.reduce((s, p) => s + p.value, 0) / window.length
  let num = 0, den = 0
  window.forEach((p, i) => { num += (i - xMean) * (p.value - yMean); den += (i - xMean) ** 2 })
  const slope = den !== 0 ? num / den : 0

  const residuals = window.map((p, i) => p.value - (yMean + slope * (i - xMean)))
  const stdDev = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / window.length)
  const zScore = 1.96

  const predictValue = (i: number): number => {
    if (model === 'linear') {
      return Math.max(0, lastActual + slope * i)
    }
    if (model === 'exponential') {
      // Exponential smoothing: dampened growth, heavier weight on recent points
      const alpha = 0.4
      let smoothed = window[window.length - 1].value
      for (let k = 1; k <= i; k++) {
        const projected = smoothed + slope * 0.85
        smoothed = alpha * projected + (1 - alpha) * smoothed
      }
      return Math.max(0, smoothed)
    }
    // arima: AR(1) — last value + autocorrelated slope with mean reversion
    const ar1 = 0.72
    const longTermMean = yMean + slope * window.length
    let val = lastActual
    for (let k = 1; k <= i; k++) {
      val = ar1 * val + (1 - ar1) * longTermMean + slope * 0.6
    }
    return Math.max(0, val)
  }

  const points: ForecastPoint[] = []

  series.slice(-7).forEach((p) => {
    points.push({ date: p.date, actual: p.value, predicted: p.value, lower: p.value, upper: p.value })
  })

  for (let i = 1; i <= horizonDays; i++) {
    const predicted = predictValue(i)
    // arima has tighter CI, exponential is wider
    const ciMultiplier = model === 'arima' ? 0.75 : model === 'exponential' ? 1.15 : 1.0
    const uncertainty = stdDev * Math.sqrt(i) * zScore * ciMultiplier
    points.push({
      date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
      predicted: Math.round(predicted),
      lower: Math.round(Math.max(0, predicted - uncertainty)),
      upper: Math.round(predicted + uncertainty),
    })
  }

  return points
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    INSTAGRAM: 'Instagram',
    TIKTOK: 'TikTok',
    TWITTER: 'Twitter/X',
    VKONTAKTE: 'ВКонтакте',
    YOUTUBE: 'YouTube',
    OTHER: 'Другое',
  }
  return labels[platform]
}

export function getStatusLabel(status: TrendStatus): string {
  const labels: Record<TrendStatus, string> = {
    RISING: 'Растёт',
    STABLE: 'Стабильный',
    FALLING: 'Падает',
    EMERGING: 'Новый',
  }
  return labels[status]
}

export function getPlatformColor(platform: Platform): string {
  const colors: Record<Platform, string> = {
    INSTAGRAM: '#E1306C',
    TIKTOK: '#010101',
    TWITTER: '#1DA1F2',
    VKONTAKTE: '#0077FF',
    YOUTUBE: '#FF0000',
    OTHER: '#6B7280',
  }
  return colors[platform]
}

export function getStatusColor(status: TrendStatus): string {
  return {
    RISING: 'text-emerald-600',
    STABLE: 'text-blue-600',
    FALLING: 'text-red-500',
    EMERGING: 'text-violet-600',
  }[status]
}

export function getDashboardStats() {
  const totalMentions = MOCK_TRENDS.reduce((s, t) => s + t.mentionsCount, 0)
  const risingCount = MOCK_TRENDS.filter((t) => t.status === 'RISING').length
  const avgGrowth = MOCK_TRENDS.reduce((s, t) => s + t.growthRate, 0) / MOCK_TRENDS.length
  const avgEngagement = MOCK_TRENDS.reduce((s, t) => s + t.avgEngagement, 0) / MOCK_TRENDS.length

  return {
    totalMentions,
    risingCount,
    avgGrowth: Math.round(avgGrowth * 10) / 10,
    avgEngagement: Math.round(avgEngagement * 10) / 10,
    totalTrends: MOCK_TRENDS.length,
    activeSources: 4,
    datasetsCount: 3,
  }
}

// Generate platform distribution
export function getPlatformDistribution() {
  const dist: Record<string, number> = {}
  MOCK_TRENDS.forEach((t) => {
    dist[t.platform] = (dist[t.platform] || 0) + t.mentionsCount
  })
  return Object.entries(dist).map(([platform, count]) => ({
    platform: getPlatformLabel(platform as Platform),
    count,
    color: getPlatformColor(platform as Platform),
  }))
}

// Aggregate weekly mentions across all trends
export function getWeeklyMentionsChart(): TimePoint[] {
  const aggregated: Record<string, number> = {}
  MOCK_TRENDS.forEach((trend) => {
    trend.timeSeries.slice(-14).forEach((point) => {
      aggregated[point.date] = (aggregated[point.date] || 0) + point.value
    })
  })
  return Object.entries(aggregated)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }))
}
